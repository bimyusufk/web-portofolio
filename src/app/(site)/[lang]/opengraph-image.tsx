import { ImageResponse } from "next/og";

import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { getSiteData } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Bim Yusuf Karang";

/** Membuat gambar tergenerate saat build, bukan on-demand per kunjungan. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Satu gambar OG per bahasa, dipasang di level [lang] (bukan di dalam
 * (pages)) supaya berlaku untuk seluruh halaman tanpa duplikasi per rute.
 * Kotak translucent di pojok menggemakan motif ProfileMosaic di beranda,
 * supaya preview link dan halaman beranda terasa satu identitas.
 */
export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = isLocale(raw) ? raw : defaultLocale;
  const site = await getSiteData(lang);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#f8f9fa",
        }}
      >
        {/* Gema mozaik - kotak translucent di pojok, sangat rendah opacity */}
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 64,
            width: 160,
            height: 160,
            borderRadius: 16,
            background: "rgba(24, 128, 56, 0.10)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 64,
            right: 180,
            width: 110,
            height: 110,
            borderRadius: 16,
            background: "rgba(26, 115, 232, 0.10)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: 40,
            width: 90,
            height: 90,
            borderRadius: 16,
            background: "rgba(249, 171, 0, 0.08)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 96,
            paddingRight: 96,
            width: "100%",
            height: "100%",
          }}
        >
          <svg width="72" height="72" viewBox="0 0 24 24">
            <rect x="2" y="7" width="13" height="13" rx="2.5" fill="#1a73e8" opacity={0.28} />
            <rect x="9" y="4" width="13" height="13" rx="2.5" fill="#1a73e8" />
          </svg>

          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 64,
              fontWeight: 500,
              color: "#202124",
              letterSpacing: "-0.02em",
            }}
          >
            {site.name}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 32,
              fontWeight: 400,
              color: "#5f6368",
            }}
          >
            {site.role}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 40,
              width: 88,
              height: 6,
              borderRadius: 3,
              background: "#1a73e8",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
