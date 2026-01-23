import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

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

    // Delete from Vercel Blob Storage
    if (file.url) {
      try {
        await del(file.url);
      } catch (e) {
        console.warn("Failed to delete blob file", e);
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
