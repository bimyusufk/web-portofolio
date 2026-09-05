import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export type NavItem = { href: string; label: string };

/**
 * Sumber tunggal daftar navigasi.
 *
 * Segmen rute sengaja tetap dalam bahasa Inggris untuk kedua bahasa supaya satu
 * dokumen Sanity punya satu alamat; hanya labelnya yang diterjemahkan.
 */
export function getNavItems(lang: Locale, dict: Dictionary): NavItem[] {
  return [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/projects`, label: dict.nav.projects },
    { href: `/${lang}/research`, label: dict.nav.research },
    { href: `/${lang}/experience`, label: dict.nav.experience },
    { href: `/${lang}/activities`, label: dict.nav.activities },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];
}
