import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";
import { LanguageSchema } from "@/src/lib/schemas";
import { z } from "zod";

export async function GET() {
    await requireAdmin();
    try {
        const languages = await prisma.language.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(languages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch languages" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await requireAdmin();
    try {
        const body = await req.json();
        const validatedData = LanguageSchema.parse(body);

        const language = await prisma.language.create({
            data: validatedData
        });
        return NextResponse.json(language, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create language" }, { status: 500 });
    }
}
