import { Google_Sans_Code, Roboto } from "next/font/google";

import "./globals.css";
import { NotFoundClient } from "@/components/content/not-found-client";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { defaultLocale } from "@/i18n/config";
import { getSiteData } from "@/lib/site";

/**
 * Halaman 404 tingkat aplikasi.
 *
 * Aplikasi punya dua root layout - (site) dan (studio) - sehingga Next tidak
 * bisa memilih salah satunya untuk membungkus not-found dan akan memakai shell
 * galat bawaan. Karena itu berkas ini merender dokumennya sendiri secara utuh.
 *
 * Tidak ada API dinamis yang dipakai di sini: begitu `headers()` masuk, seluruh
 * rute yang bisa memicu notFound() - termasuk halaman detail proyek dan riset -
 * kehilangan prarender. Bahasa karena itu ditentukan di klien.
 */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export default async function NotFound() {
  // Field yang dipakai app bar dan footer sama untuk kedua bahasa.
  const site = await getSiteData(defaultLocale);

  return (
    <html
      lang={defaultLocale}
      className={`${roboto.variable} ${googleSansCode.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-surface text-ink antialiased">
        <ThemeProvider>
          <NotFoundClient siteName={site.name} cvUrl={site.cvUrl} socials={site.socials} />
        </ThemeProvider>
      </body>
    </html>
  );
}
