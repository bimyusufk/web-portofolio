import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// DELETE - Delete a file
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get file from database
    const file = await db.media.findUnique({ where: { id } });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete local file if it exists
    if (file.url) {
      try {
        // Expecting URL like /uploads/media/{folder}/{filename}
        const urlPath = file.url.split("/uploads/media/")[1];
        if (urlPath) {
          const absolutePath = path.join(process.cwd(), "public", "uploads", "media", urlPath);
          await fs.unlink(absolutePath).catch(() => {});
        }
      } catch (e) {
        // ignore file delete errors
        console.warn("Failed to delete local file", e);
      }
    }

    // Delete from database
    await db.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
