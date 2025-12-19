import type { NextAuthConfig } from "next-auth";

export default {
    providers: [], // Providers will be added in auth.ts (Node.js runtime)
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token }) {
            return token;
        },
    },
} satisfies NextAuthConfig;

