import Link from "next/link";

import { BrandMark } from "./brand-mark";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { NavItem } from "./app-bar";

type SocialLink = { label: string; url: string; platform?: string };

/**
 * Footer bergaya cloud.google.com: kolom tautan bertajuk huruf kecil,
 * garis pemisah tipis, dan baris bawah berisi hak cipta.
 * Tidak ada formulir langganan atau ikon sosial berukuran besar.
 */
export function SiteFooter({
  lang,
  dict,
  navItems,
  socials,
  cvUrl,
  siteName,
}: {
  lang: Locale;
  dict: Dictionary;
  navItems: NavItem[];
  socials: SocialLink[];
  cvUrl: string | null;
  siteName: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface-subtle">
      <div className="gcp-container py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark className="h-6 w-6" />
              <span className="text-[1.0625rem] tracking-[-0.01em] text-ink">{siteName}</span>
            </div>
            <p className="mt-3 max-w-xs text-ui text-ink-secondary">{dict.footer.tagline}</p>
          </div>

          <FooterColumn title={dict.footer.navTitle}>
            {navItems.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={dict.footer.connectTitle}>
            {socials.map((social) => (
              <FooterLink key={social.url} href={social.url} external>
                {social.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={dict.footer.resourceTitle}>
            {cvUrl && (
              <FooterLink href={cvUrl} external>
                {dict.nav.downloadCv}
              </FooterLink>
            )}
            <FooterLink href={`/${lang}/contact`}>{dict.nav.contact}</FooterLink>
          </FooterColumn>
        </div>

        <div className="gcp-divider my-8" />

        <div className="flex flex-col gap-2 text-caption text-ink-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteName}. {dict.footer.rights}
          </p>
          <p>{dict.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = "text-ui text-ink-secondary transition-colors duration-fast hover:text-brand";

  return (
    <li>
      {external ? (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    </li>
  );
}
