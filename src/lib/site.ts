import type { Locale } from "@/i18n/config";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import type { SanityImage } from "@/sanity/lib/image";

export type SocialLink = { label: string; url: string; platform?: string };
export type Metric = { value: string; label: string };

export type SiteData = {
  name: string;
  role: string;
  headline: string | null;
  bio: unknown[] | null;
  focus: string | null;
  location: string;
  email: string;
  phone: string | null;
  cvUrl: string | null;
  avatar: SanityImage | null;
  socials: SocialLink[];
  metrics: Metric[];
};

/**
 * Nilai cadangan.
 *
 * Dipakai sebelum project Sanity terhubung, dan sebagai pengisi ketika sebuah
 * field di Studio dibiarkan kosong. Dengan ini situs tidak pernah merender
 * nama kosong atau tautan kontak yang hilang.
 */
const fallback: Record<Locale, SiteData> = {
  id: {
    name: "Bim Yusuf Karang",
    role: "Software Engineer & Peneliti",
    headline: null,
    bio: null,
    focus: null,
    location: "Bandung, Jawa Barat, Indonesia",
    email: "bimyusufkarang21@gmail.com",
    phone: "+62 813 1444 891",
    cvUrl: "/CV.pdf",
    avatar: null,
    socials: [
      { platform: "github", label: "GitHub", url: "https://github.com/bimyusufk" },
      { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/bim-yusuf-k/" },
      { platform: "instagram", label: "Instagram", url: "https://instagram.com/bim_yusuf21" },
      { platform: "whatsapp", label: "WhatsApp", url: "https://wa.me/628131444891" },
    ],
    metrics: [],
  },
  en: {
    name: "Bim Yusuf Karang",
    role: "Software Engineer & Researcher",
    headline: null,
    bio: null,
    focus: null,
    location: "Bandung, West Java, Indonesia",
    email: "bimyusufkarang21@gmail.com",
    phone: "+62 813 1444 891",
    cvUrl: "/CV.pdf",
    avatar: null,
    socials: [
      { platform: "github", label: "GitHub", url: "https://github.com/bimyusufk" },
      { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/bim-yusuf-k/" },
      { platform: "instagram", label: "Instagram", url: "https://instagram.com/bim_yusuf21" },
      { platform: "whatsapp", label: "WhatsApp", url: "https://wa.me/628131444891" },
    ],
    metrics: [],
  },
};

type SettingsResult = Partial<SiteData> | null;

/** Menggabungkan Pengaturan Situs dari Sanity dengan nilai cadangan per field. */
export async function getSiteData(lang: Locale): Promise<SiteData> {
  const settings = await sanityFetch<SettingsResult>(
    siteSettingsQuery,
    { lang },
    null,
    { tags: ["siteSettings"] },
  );

  const base = fallback[lang];
  if (!settings) return base;

  return {
    name: settings.name || base.name,
    role: settings.role || base.role,
    headline: settings.headline ?? base.headline,
    bio: settings.bio ?? base.bio,
    focus: settings.focus ?? base.focus,
    location: settings.location || base.location,
    email: settings.email || base.email,
    phone: settings.phone ?? base.phone,
    cvUrl: settings.cvUrl || base.cvUrl,
    avatar: settings.avatar ?? base.avatar,
    socials: settings.socials?.length ? settings.socials : base.socials,
    metrics: settings.metrics?.length ? settings.metrics : base.metrics,
  };
}

/** URL kanonis situs; dipakai untuk metadata, sitemap, dan JSON-LD. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
