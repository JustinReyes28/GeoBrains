import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";
import { FamousPersonSchema } from "@/src/lib/schemas";
import { z } from "zod";

export async function GET() {
    await requireAdmin();
    try {
        const people = await prisma.famousPerson.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(people);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch famous people" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await requireAdmin();
    try {
        const body = await req.json();
        const validatedData = FamousPersonSchema.parse(body);

        const person = await prisma.famousPerson.create({
            data: validatedData
        });
        return NextResponse.json(person, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create famous person" }, { status: 500 });
    }
}
