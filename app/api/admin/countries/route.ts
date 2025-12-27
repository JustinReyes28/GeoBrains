import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";
import { CountrySchema } from "@/src/lib/schemas"; // We will add this
import { z } from "zod";

export async function GET() {
    await requireAdmin();

    try {
        const countries = await prisma.country.findMany({
            orderBy: { name: 'asc' },
            include: { capitals: true }
        });
        return NextResponse.json(countries);
    } catch (error) {
        console.error("Error fetching countries:", error);
        return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await requireAdmin();

    try {
        const body = await req.json();
        const validatedData = CountrySchema.parse(body);

        const country = await prisma.country.create({
            data: validatedData
        });

        return NextResponse.json(country, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
        }
        console.error("Error creating country:", error);
        return NextResponse.json({ error: "Failed to create country" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await requireAdmin();

    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const validatedData = CountrySchema.parse(data);

        const country = await prisma.country.update({
            where: { id },
            data: validatedData
        });

        return NextResponse.json(country);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
        }
        console.error("Error updating country:", error);
        return NextResponse.json({ error: "Failed to update country" }, { status: 500 });
    }
}
