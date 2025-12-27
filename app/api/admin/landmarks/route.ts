import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";
import { LandmarkSchema } from "@/src/lib/schemas";
import { z } from "zod";

export async function GET() {
    await requireAdmin();
    try {
        const landmarks = await prisma.landmark.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(landmarks);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch landmarks" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await requireAdmin();
    try {
        const body = await req.json();
        const validatedData = LandmarkSchema.parse(body);

        const landmark = await prisma.landmark.create({
            data: {
                name: validatedData.name,
                country: validatedData.country,
                description: validatedData.description,
                imageUrl: validatedData.imageUrl,
                hints: validatedData.hints || [],
            }
        });
        return NextResponse.json(landmark, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create landmark" }, { status: 500 });
    }
}
