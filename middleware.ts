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

function getClientIp(request: Request) {
    return request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
}

async function rateLimitMiddleware(request: Request) {
    const ip = getClientIp(request);
    const now = Date.now();

    const pathname = new URL(request.url).pathname;

    // Limits and windows based on route type
    const isAuthRoute = pathname.startsWith("/api/auth");
    const limit = isAuthRoute ? 5 : 10;
    const window = isAuthRoute ? 5000 : 10000;

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

        return new NextResponse("Too Many Requests", {
            status: 429,
            headers: {
                "X-RateLimit-Limit": limit.toString(),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": resetTime.toString(),
                "Content-Type": "text/plain",
            },
        });
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

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    const isAuthRoute = nextUrl.pathname.startsWith("/auth");
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/", "/api"].includes(nextUrl.pathname);
    const isProtectedRoute = nextUrl.pathname.startsWith("/profile");

    // Allow API auth routes to pass through
    if (isApiAuthRoute) {
        return;
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

    return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

export async function middleware(request: any) {
    // Apply rate limiting first
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse.status === 429) {
        return rateLimitResponse;
    }

    // Extract client info and set request context
    const clientContext = extractClientInfoFromRequest(request);
    setRequestContext(request, clientContext);

    // Continue with auth middleware
    return auth(request);
}