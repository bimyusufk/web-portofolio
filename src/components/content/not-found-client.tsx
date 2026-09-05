"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppBar } from "@/components/layout/app-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { defaultLocale, isLocale } from "@/i18n/config";
import en from "@/i18n/dictionaries/en.json";
import id from "@/i18n/dictionaries/id.json";
import { getNavItems } from "@/lib/nav";
import type { SocialLink } from "@/lib/site";

const dictionaries = { id, en };

/**
 * Isi halaman 404, termasuk chrome situs.
 *
 * Dijalankan di klien dan menentukan bahasa dari path. Alasannya: aplikasi ini
 * punya dua root layout, sehingga Next merender halaman not-found di shell
 * galat dan mengisinya setelah hidrasi - tidak ada markup server yang bisa
 * hilang. Membaca header di server justru akan memaksa halaman detail proyek
 * dan riset menjadi dinamis, jadi pendekatan klien di sini lebih murah.
 */
export function NotFoundClient({
  siteName,
  cvUrl,
  socials,
}: {
  siteName: string;
  cvUrl: string | null;
  socials: SocialLink[];
}) {
  const pathname = usePathname() ?? "/";
  const segment = pathname.split("/")[1] ?? "";
  const lang = isLocale(segment) ? segment : defaultLocale;
  const dict = dictionaries[lang];
  const navItems = getNavItems(lang, dict);

  return (
    <>
      <AppBar
        lang={lang}
        siteName={siteName}
        items={navItems}
        cvUrl={cvUrl}
        labels={{
          openMenu: dict.nav.openMenu,
          closeMenu: dict.nav.closeMenu,
          toggleTheme: dict.nav.toggleTheme,
          language: dict.nav.language,
          cv: dict.nav.cv,
          contact: dict.nav.contact,
        }}
      />

      <main id="main" className="flex-1 animate-slide-in-top">
        <div className="gcp-container flex min-h-[60vh] flex-col items-start justify-center py-20">
          <p className="font-mono text-ui text-ink-tertiary">404</p>
          <h1 className="mt-3 text-headline text-ink sm:text-display-sm">{dict.common.notFoundTitle}</h1>
          <p className="mt-3 max-w-prose text-body text-ink-secondary">{dict.common.notFoundBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/${lang}`}>{dict.common.backHome}</Link>
            </Button>
            <Button variant="outlined" asChild>
              <Link href={`/${lang}/projects`}>{dict.nav.projects}</Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter
        lang={lang}
        dict={dict}
        navItems={navItems}
        socials={socials}
        cvUrl={cvUrl}
        siteName={siteName}
      />
    </>
  );
}
