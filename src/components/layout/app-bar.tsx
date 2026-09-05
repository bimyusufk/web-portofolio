"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "./brand-mark";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string };

type AppBarProps = {
  lang: Locale;
  siteName: string;
  items: NavItem[];
  labels: {
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    language: string;
    cv: string;
    contact: string;
  };
  cvUrl: string | null;
};

/**
 * App bar Google Cloud.
 *
 * Tinggi 64px, latar permukaan, garis bawah 1px, tanpa blur atau transparansi.
 * Tautan aktif ditandai garis bawah biru setinggi 3px yang menempel ke dasar bar -
 * pola indikator yang sama dipakai tab Cloud Console.
 */
export function AppBar({ lang, siteName, items, labels, cvUrl }: AppBarProps) {
  const pathname = usePathname();

  // Keadaan laci disimpan bersama rute tempat ia dibuka, lalu diturunkan saat
  // render. Berpindah halaman - termasuk lewat tombol kembali peramban -
  // otomatis menutupnya tanpa perlu efek yang memanggil setState.
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname;
  const setMenuOpen = (open: boolean) => setMenu({ open, path: pathname });

  // Kunci gulir badan halaman selama laci navigasi terbuka.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      // setMenu berasal dari useState sehingga stabil; tidak perlu masuk daftar dependensi.
      if (event.key === "Escape") setMenu((current) => ({ ...current, open: false }));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="gcp-container flex h-16 items-center gap-6">
        <Link
          href={`/${lang}`}
          className="flex shrink-0 items-center gap-2.5 rounded-sm"
          aria-label={siteName}
        >
          <BrandMark className="h-6 w-6" />
          <span className="text-[1.0625rem] tracking-[-0.01em] text-ink">{siteName}</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 lg:block" aria-label="Utama">
          <ul className="flex h-16 items-center gap-1">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="h-full">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-full items-center px-3 text-ui transition-colors duration-fast",
                      active ? "font-medium text-brand" : "text-ink-secondary hover:text-ink",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-sm bg-brand"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher current={lang} label={labels.language} />
          </div>
          <ThemeToggle label={labels.toggleTheme} />

          {cvUrl && (
            <Button variant="outlined" size="sm" className="hidden md:inline-flex" asChild>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                {labels.cv}
              </a>
            </Button>
          )}
          <Button size="sm" className="hidden md:inline-flex" asChild>
            <Link href={`/${lang}/contact`}>{labels.contact}</Link>
          </Button>

          <Button
            variant="icon"
            size="md"
            className="lg:hidden"
            aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-line bg-surface lg:hidden"
        >
          <nav className="gcp-container py-4" aria-label="Utama (seluler)">
            <ul className="flex flex-col">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-12 items-center border-l-[3px] pl-4 text-body transition-colors duration-fast",
                        active
                          ? "border-brand bg-brand-tint font-medium text-brand-on"
                          : "border-transparent text-ink-secondary hover:bg-surface-subtle hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="gcp-divider my-4" />

            <div className="flex flex-wrap items-center gap-3 pb-4">
              <LanguageSwitcher current={lang} label={labels.language} />
              {cvUrl && (
                <Button variant="outlined" size="sm" asChild>
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                    {labels.cv}
                  </a>
                </Button>
              )}
              <Button size="sm" asChild>
                <Link href={`/${lang}/contact`}>{labels.contact}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
