import { notFound } from "next/navigation";

import { AppBar } from "@/components/layout/app-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd, personSchema, websiteSchema } from "@/components/seo/json-ld";
import { isLocale, localeHtmlLang, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getNavItems } from "@/lib/nav";
import { getSiteData, siteUrl } from "@/lib/site";
import { urlForImage } from "@/sanity/lib/image";

/**
 * Chrome situs: app bar, area konten utama, dan footer.
 *
 * Semua halaman publik berbagi lapisan ini, termasuk data identitas dan
 * tautan navigasi yang diambil sekali per permintaan lalu diteruskan ke app
 * bar dan footer. Halaman 404 tidak melewati sini - lihat src/app/not-found.tsx.
 */
export default async function PagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const [dict, site] = await Promise.all([getDictionary(locale), getSiteData(locale)]);
  const navItems = getNavItems(locale, dict);
  const avatarUrl = urlForImage(site.avatar, { width: 512 });

  return (
    <>
      <a className="skip-link" href="#main">
        {dict.nav.skipToContent}
      </a>

      <AppBar
        lang={locale}
        siteName={site.name}
        items={navItems}
        cvUrl={site.cvUrl}
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
        {children}
      </main>

      <SiteFooter
        lang={locale}
        dict={dict}
        navItems={navItems}
        socials={site.socials}
        cvUrl={site.cvUrl}
        siteName={site.name}
      />

      <JsonLd
        data={personSchema({
          name: site.name,
          url: `${siteUrl}/${locale}`,
          jobTitle: site.role,
          description: dict.meta.description,
          email: site.email,
          image: avatarUrl,
          location: site.location,
          sameAs: site.socials.map((social) => social.url),
        })}
      />
      <JsonLd
        data={websiteSchema({
          name: site.name,
          url: `${siteUrl}/${locale}`,
          description: dict.meta.description,
          lang: localeHtmlLang[locale],
        })}
      />
    </>
  );
}
