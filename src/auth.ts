import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

import { prisma } from "./lib/prisma";
import { LoginSchema } from "./lib/schemas";
import authConfig from "./auth.config";

// Custom error classes for authentication
class AccountLockoutError extends Error {
    constructor(message: string, public lockedUntil: Date, public retryAfterSeconds: number) {
        super(message);
        this.name = "AccountLockoutError";
    }
}

class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
    }
}

// Security constants
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATIONS = [
    5 * 60 * 1000,      // 5 minutes after 5 attempts
    15 * 60 * 1000,     // 15 minutes after 6 attempts
    30 * 60 * 1000,     // 30 minutes after 7 attempts
    60 * 60 * 1000,     // 1 hour after 8 attempts
    24 * 60 * 60 * 1000, // 24 hours after 9+ attempts
];

import {
    setRequestContext,
    getRequestContext,
    extractClientInfoFromRequest,
    type ClientContext,
    requestContextMap
} from "./auth.edge";

async function getClientInfo(request: Request, context?: ClientContext): Promise<{ ip: string; userAgent: string }> {
    // If explicit context is provided, use it (highest priority)
    if (context) {
        return {
            ip: context.ip || "unknown",
            userAgent: context.userAgent || "unknown"
        };
    }

    // If no explicit context, try to get from request-scoped storage
    const requestContext = getRequestContext(request);
    if (requestContext) {
        return {
            ip: requestContext.ip || "unknown",
            userAgent: requestContext.userAgent || "unknown"
        };
    }

    // Fallback to unknown
    return { ip: "unknown", userAgent: "unknown" };
}

async function logAudit(request: Request, userId: string | null, action: string, metadata: any = {}, context?: ClientContext) {
    const { ip, userAgent } = await getClientInfo(request, context);

    await prisma.auditLog.create({
        data: {
            userId,
            action,
            ipAddress: ip,
            userAgent,
            metadata: {
                ...metadata,
                ip,
                userAgent,
            },
        },
    });
}

async function checkAccountLockout(request: Request, user: any) {
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        const lockedUntilDate = new Date(user.lockedUntil);
        const retryAfterSeconds = Math.ceil((lockedUntilDate.getTime() - Date.now()) / 1000);

        await logAudit(request, user.id, "ACCOUNT_LOCKED", {
            reason: "Account temporarily locked due to too many failed login attempts",
            lockedUntil: user.lockedUntil,
            retryAfterSeconds: retryAfterSeconds,
        });

        throw new AccountLockoutError(
            `Account temporarily locked due to too many failed login attempts. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
            lockedUntilDate,
            retryAfterSeconds
        );
    }
    // No lockout - continue normally
}

async function handleFailedLogin(request: Request, user: any) {
    const now = new Date();

    // Calculate lockout duration based on failed attempts
    // We need to determine the new failedAttemptCount to calculate lockout
    const newFailedAttemptCount = user.failedAttemptCount + 1;
    let lockedUntil = null;
    if (newFailedAttemptCount >= MAX_FAILED_ATTEMPTS) {
        const lockoutIndex = Math.min(newFailedAttemptCount - MAX_FAILED_ATTEMPTS, LOCKOUT_DURATIONS.length - 1);
        lockedUntil = new Date(now.getTime() + LOCKOUT_DURATIONS[lockoutIndex]);
    }

    // Update user record atomically using Prisma's increment operation
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            failedAttemptCount: { increment: 1 }, // Atomic increment
            lastFailedAt: now,
            lockedUntil,
        },
    });

    // Use the actual updated count from the database for audit logging
    const actualFailedAttemptCount = updatedUser.failedAttemptCount;

    await logAudit(request, user.id, "LOGIN_FAILED", {
        failedAttemptCount: actualFailedAttemptCount,
        lockedUntil,
        reason: "Invalid credentials",
    });

    return updatedUser;
}

async function handleSuccessfulLogin(request: Request, user: any) {
    // Reset security fields on successful login
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            failedAttemptCount: 0,
            lastFailedAt: null,
            lockedUntil: null,
        },
    });

    await logAudit(request, user.id, "LOGIN_SUCCESS", {
        message: "User logged in successfully",
    });

    return updatedUser;
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    trustHost: true,
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            async authorize(credentials, request) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user || !user.password) {
                        // Log failed attempt even if user doesn't exist to prevent enumeration
                        await logAudit(request as Request, null, "LOGIN_FAILED", {
                            email,
                            reason: "User not found or no password set",
                        });
                        return null;
                    }

                    // Check if account is locked
                    try {
                        await checkAccountLockout(request as Request, user);
                    } catch (error) {
                        if (error instanceof AccountLockoutError) {
                            // Throw the AccountLockoutError so NextAuth handles it via its error flow
                            throw error;
                        }
                        // For other types of errors, just return null
                        return null;
                    }

                    // Check if email is verified
                    if (!user.emailVerified) {
                        await logAudit(request as Request, user.id, "LOGIN_FAILED", {
                            reason: "Email not verified",
                        });
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (passwordsMatch) {
                        // Successful login - reset security fields
                        const updatedUser = await handleSuccessfulLogin(request as Request, user);
                        return updatedUser;
                    } else {
                        // Failed login - update security fields
                        await handleFailedLogin(request as Request, user);
                        return null;
                    }
                }

                // Log invalid credentials format
                await logAudit(request as Request, null, "LOGIN_FAILED", {
                    reason: "Invalid credentials format",
                });

                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token }) {
            return token;
        },
        async signIn() {
            // No special handling needed since AccountLockoutError is thrown directly
            return true;
        },
    },
    events: {
        async signIn(message: any) {
            // Capture request context when sign-in event occurs
            // In NextAuth, the request might be available in different ways depending on the version
            let request: Request | undefined;

            // Try to get request from different possible locations
            if (message.request) {
                request = message.request;
            } else if (message?.req) {
                // Some versions use req instead of request
                request = message.req;
            }

            if (request) {
                const clientContext = extractClientInfoFromRequest(request);
                setRequestContext(request, clientContext);

                // Audit logging for OAuth/Social Providers
                // Credentials provider has its own audit logging in authorize()
                if (message.account?.provider && message.account.provider !== "credentials") {
                    await logAudit(request, message.user?.id || null, "LOGIN_SUCCESS", {
                        provider: message.account.provider,
                        message: `User logged in via ${message.account.provider}`,
                    }, clientContext);
                }
            }
        },
        async signOut(message: any) {
            // No need to explicitly clear - WeakMap handles garbage collection automatically
        },
    },
});

// Export request context functions for use in middleware and route handlers
export { setRequestContext, getRequestContext, extractClientInfoFromRequest };

