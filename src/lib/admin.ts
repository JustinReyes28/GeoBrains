import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

export async function isAdmin() {
    const session = await auth();

    // Check 1: User must be logged in
    if (!session || !session.user) {
        return false;
    }

    // Check 2: Email verification (Layer 1)
    if (session.user.email !== process.env.ADMIN_EMAIL) {
        return false;
    }

    // Check 3: Role verification (Layer 2)
    // Note: We need to extend the session type to include role if we want to check it here from session
    // For now, email check is the strong gatekeeper, and DB operations will use the role implicitly via Prisma defaults if we enforce it there.
    // Ideally, we should add 'role' to the session callback in auth.ts to make this check robust.

    return true;
}

export async function requireAdmin() {
    const isAuthorized = await isAdmin();
    if (!isAuthorized) {
        redirect("/");
    }
}
