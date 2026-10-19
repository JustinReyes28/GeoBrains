import NextAuth, { type Session } from 'next-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import authConfig from '@/src/auth.config';
import { setRequestContext, extractClientInfoFromRequest } from '@/src/auth.edge';
import { RateLimiter } from '@/src/lib/rate-limit';
const { auth } = NextAuth(authConfig);
// Bounded per-process protection. Use a shared store for multi-instance deployments.
const limiter = new RateLimiter(1000);
async function rateLimitMiddleware(request: Request) {
    const ip = extractClientInfoFromRequest(request).ip ?? 'unknown';
    const isAuth = new URL(request.url).pathname.startsWith('/api/auth');
    const limit = isAuth ? 20 : 50;
    const result = limiter.check((isAuth ? 'auth:' : 'public:') + ip, limit, isAuth ? 10000 : 60000);
    const response = result.allowed ? NextResponse.next() : NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429 });
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    if (!result.allowed)
        response.headers.set('Retry-After', String(result.retryAfter));
    return response;
}
// Consolidated middleware handler that contains all the route protection logic
async function consolidatedMiddlewareHandler(req: NextRequest & {
    auth: Session | null;
}) {
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
    const isProtectedRoute = nextUrl.pathname.startsWith("/profile");
    // Allow API auth routes to pass through
    if (isApiAuthRoute) {
        return rateLimitResponse;
    }
    // If on auth page and logged in, redirect to home
    if (isAuthRoute && isLoggedIn) {
        console.log(`[Middleware] Auth route redirect: ${nextUrl.origin} -> /`);
        return NextResponse.redirect(new URL("/", nextUrl));
    }
    // If trying to access protected route without being logged in
    const isLeaderboard = nextUrl.pathname.startsWith("/profile") && nextUrl.searchParams.get("tab") === "leaderboard";
    if (isProtectedRoute && !isLoggedIn && !isLeaderboard) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        const redirectUrl = new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl);
        console.log(`[Middleware] Protected route redirect: ${nextUrl.origin} -> ${redirectUrl.toString()}`);
        return NextResponse.redirect(redirectUrl);
    }
    // Admin Route Protection
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute) {
        // 1. Must be logged in
        if (!isLoggedIn) {
            console.log(`[Middleware] Admin redirect (not logged in): ${nextUrl.origin} -> /auth/login`);
            return NextResponse.redirect(new URL("/auth/login", nextUrl));
        }
        // 2. Must be the admin user (Email Check)
        // Note: Middleware can't easily check DB role without edge adapter, so we rely on email env var here for speed
        if (req.auth?.user?.email !== process.env.ADMIN_EMAIL) {
            console.log(`[Middleware] Admin redirect (unauthorized): ${nextUrl.origin} -> /`);
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }
    // Continue with the request if no special handling is needed
    return rateLimitResponse;
}
// Export the consolidated handler wrapped with auth for the default export
export default auth(consolidatedMiddlewareHandler);
// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
