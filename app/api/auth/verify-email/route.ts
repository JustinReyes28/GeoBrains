
import { NextResponse } from "next/server";
import { verifyEmail } from "@/src/lib/auth-actions";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, code } = body;

        if (!email || !code) {
            return new NextResponse("Missing email or code", { status: 400 });
        }

        const result = await verifyEmail(email, code);

        if (result.error) {
            return new NextResponse(result.error, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.log("[VERIFY_EMAIL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
