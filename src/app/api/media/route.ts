import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Upload to Vercel Blob Storage
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Save to database
    const media = await db.media.create({
      data: {
        filename: file.name,
        url: blob.url,
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
