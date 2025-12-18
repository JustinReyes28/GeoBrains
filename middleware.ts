import NextAuth from "next-auth";
import authConfig from "@/src/auth.config";

const { auth } = NextAuth(authConfig);

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
    if (isProtectedRoute && !isLoggedIn) {
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
