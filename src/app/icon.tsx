import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon digenerate dari geometri BrandMark (dua persegi biru bertumpuk),
 * bukan file .ico statis, supaya tetap satu sumber kebenaran dengan
 * src/components/layout/brand-mark.tsx.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24">
          <rect x="2" y="7" width="13" height="13" rx="2.5" fill="#1a73e8" opacity={0.28} />
          <rect x="9" y="4" width="13" height="13" rx="2.5" fill="#1a73e8" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
