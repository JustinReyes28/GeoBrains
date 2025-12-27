import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/admin";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    await requireAdmin();

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!["famous-people", "landmarks"].includes(type)) {
            return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Sanitize filename: remove spaces, special chars, keep extension
        const originalName = file.name;
        const ext = path.extname(originalName);
        const nameWithoutExt = path.basename(originalName, ext);
        const sanitizedName = nameWithoutExt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${sanitizedName}${ext}`;

        // Ensure directory exists - simplified by assuming public folders exist as per structure check
        // Ideally should mkdir if not exists, but 'public/famous-people' and 'public/landmarks' exist.

        const uploadDir = path.join(process.cwd(), "public", type);
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        const publicPath = `/${type}/${filename}`;

        return NextResponse.json({ url: publicPath });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
