/**
 * Konfigurasi bilingual.
 * Segmen rute tetap sama di kedua bahasa (/id/projects, /en/projects) —
 * cloud.google.com juga memakai jalur identik dan hanya menukar bahasa isi.
 */
export const locales = ["id", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

export const localeNames: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

export const localeShortNames: Record<Locale, string> = {
  id: "ID",
  en: "EN",
};

export const localeHtmlLang: Record<Locale, string> = {
  id: "id-ID",
  en: "en-US",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Menukar prefiks bahasa pada sebuah path tanpa mengubah sisa rute. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = next;
    return `/${segments.join("/")}`;
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}
