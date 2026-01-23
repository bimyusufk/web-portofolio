import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// GET - List media files
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const files = await db.media.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error loading media:", error);
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}

// POST - Upload file
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure upload directory exists
    const uploadsRoot = path.join(process.cwd(), "public", "uploads", "media");
    await fs.mkdir(uploadsRoot, { recursive: true });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Generate unique filename and save locally under public/uploads/media
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const filename = `${uuid()}.${ext}`;
    const folder = file.type.startsWith("image/") ? "images" : "files";
    const relativePath = path.posix.join(folder, filename);
    const absoluteDir = path.join(uploadsRoot, folder);
    await fs.mkdir(absoluteDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const absolutePath = path.join(absoluteDir, filename);
    await fs.writeFile(absolutePath, buffer);

    // Public URL served from /uploads/media
    const url = `/uploads/media/${relativePath}`;

    // Save to database
    const media = await db.media.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        uploadedById: session.user.id!,
      },
    });

    return NextResponse.json({ file: media });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
