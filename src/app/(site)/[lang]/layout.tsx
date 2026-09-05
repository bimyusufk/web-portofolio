import type { Metadata } from "next";
import { Google_Sans_Code, Roboto } from "next/font/google";
import { notFound } from "next/navigation";

import "../../globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { isLocale, localeHtmlLang, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteData, siteUrl } from "@/lib/site";

/**
 * Root layout situs publik.
 *
 * Tanggung jawabnya terbatas pada kerangka dokumen: elemen html/body, font,
 * penyedia tema, dan metadata. App bar serta footer ada satu tingkat lebih
 * dalam di (pages)/layout.tsx, sehingga lapisan ini tetap bebas dari data
 * navigasi dan bisa dipakai ulang bila kelak ada cabang rute lain di bawah
 * bahasa yang sama.
 *
 * Roboto adalah huruf antarmuka Google yang tersedia publik; Google Sans Code
 * adalah huruf kode resmi Google Cloud.
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

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const [dict, site] = await Promise.all([getDictionary(lang), getSiteData(lang)]);
  const title = `${site.name} — ${site.role}`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}`])),
    },
    openGraph: {
      type: "website",
      locale: localeHtmlLang[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeHtmlLang[l]),
      url: `/${lang}`,
      siteName: site.name,
      title,
      description: dict.meta.description,
    },
    twitter: { card: "summary_large_image", title, description: dict.meta.description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={localeHtmlLang[lang]}
      className={`${roboto.variable} ${googleSansCode.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-surface text-ink antialiased mosaic-bg">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
