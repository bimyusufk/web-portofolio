import { NextResponse, type NextRequest } from "next/server";

// Konvensi "proxy" menggantikan "middleware" sejak Next.js 16.

import { defaultLocale, isLocale, locales } from "@/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

/** Rute yang tidak boleh diberi prefiks bahasa. */
const EXCLUDED_PREFIXES = ["/studio", "/api", "/_next", "/_vercel"];

/**
 * File tunggal di app root yang digenerate lewat konvensi metadata Next.js
 * (icon.tsx, apple-icon.tsx). Tidak berekstensi, jadi lolos dari pengecualian
 * berkas statis di bawah - harus dicocokkan persis di sini.
 */
const EXCLUDED_EXACT_PATHS = ["/icon", "/apple-icon"];

/**
 * Memilih bahasa dari cookie pilihan pengguna, lalu header Accept-Language,
 * dan terakhir jatuh ke bahasa default.
 */
function resolveLocale(request: NextRequest): string {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language");
  if (header) {
    const preferred = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.toLowerCase(), quality: q ? Number(q) : 1 };
      })
      .sort((a, b) => b.quality - a.quality);

    for (const { tag } of preferred) {
      const base = tag.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (EXCLUDED_EXACT_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Berkas statis di /public (punya ekstensi) dilewati.
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    const current = pathname.split("/")[1];

    const response = NextResponse.next();

    // Simpan pilihan pengguna agar kunjungan berikutnya langsung tepat.
    if (request.cookies.get(LOCALE_COOKIE)?.value !== current) {
      response.cookies.set(LOCALE_COOKIE, current, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
