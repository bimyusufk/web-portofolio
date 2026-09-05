"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { localeShortNames, locales, switchLocalePath, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Pengalih bahasa dua segmen.
 *
 * Menukar prefiks pada path saat ini alih-alih selalu kembali ke beranda,
 * sehingga pembaca tetap berada di halaman yang sama setelah berganti bahasa.
 */
export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() || `/${current}`;

  return (
    <div
      className="inline-flex h-8 items-center rounded-lg border border-line p-0.5"
      role="group"
      aria-label={label}
    >
      {locales.map((locale) => {
        const isActive = locale === current;
        return (
          <Link
            key={locale}
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex h-7 items-center rounded px-2.5 text-caption font-medium transition-colors duration-fast",
              isActive
                ? "bg-brand-tint text-brand-on"
                : "text-ink-tertiary hover:bg-surface-sunken hover:text-ink",
            )}
          >
            {localeShortNames[locale]}
          </Link>
        );
      })}
    </div>
  );
}
