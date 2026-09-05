import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Webhook Sanity: menyegarkan cache saat dokumen diterbitkan.
 *
 * Tanda tangan permintaan diverifikasi dengan SANITY_REVALIDATE_SECRET sebelum
 * apa pun disegarkan, sehingga endpoint ini tidak bisa dipakai pihak luar untuk
 * memaksa pembangunan ulang berulang kali.
 *
 * Konfigurasi di Sanity: Manage > API > Webhooks
 *   URL     : https://<domain>/api/revalidate
 *   Dataset : production
 *   Trigger : create, update, delete
 *   Filter  : _type in ["project","research","experience","activity","skillGroup","siteSettings"]
 *   Body    : { "_type": _type, "slug": slug.current }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET belum diatur di server." },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(
      request,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Tanda tangan tidak valid." }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Badan permintaan tidak memuat _type." }, { status: 400 });
    }

    // Profil "max" membuat entri bertag ini langsung kedaluwarsa (wajib sejak Next 16).
    revalidateTag(body._type, "max");

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      slug: body.slug ?? null,
      at: Date.now(),
    });
  } catch (error) {
    console.error("[revalidate] gagal:", error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
