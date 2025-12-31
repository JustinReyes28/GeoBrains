import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";
import { CapitalSchema } from "@/src/lib/schemas";
import { z } from "zod";

export async function GET() {
    await requireAdmin();
    try {
        const capitals = await prisma.capital.findMany({
            include: { country: true },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(capitals);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch capitals" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await requireAdmin();
    try {
        const body = await req.json();
        const validatedData = CapitalSchema.parse(body);

        const capital = await prisma.capital.create({
            data: {
                name: validatedData.name,
                countryId: validatedData.countryId,
            }
        });
        return NextResponse.json(capital, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create capital" }, { status: 500 });
    }
}
