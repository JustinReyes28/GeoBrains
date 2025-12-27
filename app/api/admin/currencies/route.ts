import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";
import { CurrencySchema } from "@/src/lib/schemas";
import { z } from "zod";

export async function GET() {
    await requireAdmin();
    try {
        const currencies = await prisma.currency.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(currencies);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch currencies" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await requireAdmin();
    try {
        const body = await req.json();
        const validatedData = CurrencySchema.parse(body);

        const currency = await prisma.currency.create({
            data: validatedData
        });
        return NextResponse.json(currency, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create currency" }, { status: 500 });
    }
}
