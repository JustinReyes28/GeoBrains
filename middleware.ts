import NextAuth from "next-auth";
import authConfig from "@/src/auth.config";
import { NextResponse } from "next/server";
import { setRequestContext, extractClientInfoFromRequest } from "@/src/auth.edge";

const { auth } = NextAuth(authConfig);

// Simple in-memory rate limiter for development
// For production, use Redis-based rate limiting
const requestCounts = new Map();
const RATE_LIMIT = 10; // 10 requests
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const MAX_ENTRIES = 1000; // Maximum number of IP entries to track



function cleanupRequestCounts() {
    const now = Date.now();
    let entryCount = 0;

    // First pass: clean up old timestamps and count entries
    for (const [ip, timestamps] of requestCounts.entries()) {
        // Filter timestamps to keep only those within the rate limit window
        const filteredTimestamps = (timestamps as number[]).filter((timestamp: number) => {
            return now - timestamp < RATE_LIMIT_WINDOW;
        });

        if (filteredTimestamps.length > 0) {
            // Update with filtered timestamps
            requestCounts.set(ip, filteredTimestamps);
            entryCount++;
        } else {
            // Remove entries with no recent activity
            requestCounts.delete(ip);
        }
    }

    // Second pass: enforce max entries if needed (FIFO eviction - remove oldest)
    if (entryCount > MAX_ENTRIES) {
        // Convert to array of entries with their last access time
        const entriesWithAccessTime = Array.from(requestCounts.entries()).map(([ip, timestamps]) => {
            const lastTimestamp = timestamps.length > 0 ? Math.max(...(timestamps as number[])) : 0;
            return { ip, lastTimestamp };
        });

        // Sort by last access time (oldest first)
        entriesWithAccessTime.sort((a, b) => a.lastTimestamp - b.lastTimestamp);

        // Remove oldest entries until we're under the limit
        const entriesToRemove = entryCount - MAX_ENTRIES;
        for (let i = 0; i < entriesToRemove; i++) {
            const oldestEntry = entriesWithAccessTime[i];
            requestCounts.delete(oldestEntry.ip);
        }
    }
}

function getClientIp(request: Request): string {
    // Use the trusted-proxy-aware client info extraction
    const clientContext = extractClientInfoFromRequest(request);

    // Return the validated IP from client context, falling back to "unknown" if not available
    return clientContext.ip || "unknown";
}

async function rateLimitMiddleware(request: Request) {
    const ip = getClientIp(request);
    const now = Date.now();

    const pathname = new URL(request.url).pathname;

    // Limits and windows based on route type
    const isAuthRoute = pathname.startsWith("/api/auth");
    const limit = isAuthRoute ? 20 : 50; // MORE_RELAXED_LIMIT
    const window = isAuthRoute ? 10000 : 60000; // 10s for auth, 60s for others

    // Simple in-memory rate limiting
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, []);
    }

    let timestamps = requestCounts.get(ip);

    // Remove old timestamps (cleanup old entries)
    timestamps = timestamps.filter((timestamp: number) =>
        now - timestamp < window
    );

    if (timestamps.length >= limit) {
        const oldest = timestamps[0];
        const resetTime = Math.ceil((oldest + window - now) / 1000);

        return new NextResponse(
            JSON.stringify({ error: "Too Many Requests" }),
            {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": resetTime.toString(),
                    "Content-Type": "application/json",
                },
            }
        );
    }

    // Add current timestamp
    timestamps.push(now);
    requestCounts.set(ip, timestamps);

    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", (limit - timestamps.length).toString());
    response.headers.set("X-RateLimit-Reset", Math.ceil(window / 1000).toString());

    return response;
}

// Consolidated middleware handler that contains all the route protection logic
async function consolidatedMiddlewareHandler(req: any) {
    // Apply rate limiting first
    const rateLimitResponse = await rateLimitMiddleware(req);
    if (rateLimitResponse.status === 429) {
        return rateLimitResponse;
    }

    // Extract client info and set request context
    const clientContext = extractClientInfoFromRequest(req);
    setRequestContext(req, clientContext);

    // Route protection logic (moved from the default export)
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthRoute = nextUrl.pathname.startsWith("/auth");
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/", "/api"].includes(nextUrl.pathname);
    const isProtectedRoute = nextUrl.pathname.startsWith("/profile");

    // Allow API auth routes to pass through
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // If on auth page and logged in, redirect to home
    if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
    }

    // If trying to access protected route without being logged in
    const isLeaderboard = nextUrl.pathname.startsWith("/profile") && nextUrl.searchParams.get("tab") === "leaderboard";
    if (isProtectedRoute && !isLoggedIn && !isLeaderboard) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(
            new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    // Admin Route Protection
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute) {
        // 1. Must be logged in
        if (!isLoggedIn) {
            return Response.redirect(new URL("/auth/login", nextUrl));
        }

        // 2. Must be the admin user (Email Check)
        // Note: Middleware can't easily check DB role without edge adapter, so we rely on email env var here for speed
        if (req.auth?.user?.email !== process.env.ADMIN_EMAIL) {
            return Response.redirect(new URL("/", nextUrl));
        }
    }

    // Continue with the request if no special handling is needed
    return NextResponse.next();
}

// Export the consolidated handler wrapped with auth for the default export
export default auth(consolidatedMiddlewareHandler);

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

