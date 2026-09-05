import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Ikon layar utama iOS. Latar putih solid karena iOS tidak mengizinkan
 * transparansi - komposit di atas hitam kalau dibiarkan transparan.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24">
          <rect x="2" y="7" width="13" height="13" rx="2.5" fill="#1a73e8" opacity={0.28} />
          <rect x="9" y="4" width="13" height="13" rx="2.5" fill="#1a73e8" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
