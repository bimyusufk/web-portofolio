import "../globals.css";

export const metadata = {
  title: "Sanity Studio",
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  interactiveWidget: "resizes-content" as const,
};

/** Studio dirender sebagai halaman statis; seluruh datanya diambil di peramban. */
export const dynamic = "force-static";

/**
 * Root layout terpisah untuk Studio.
 *
 * Studio membawa sistem desainnya sendiri, jadi tidak diberi app bar, footer,
 * maupun font situs - hanya kerangka dokumen yang bersih.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
