import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectSlugsQuery, researchSlugsQuery } from "@/sanity/lib/queries";

const staticRoutes = ["", "/projects", "/research", "/experience", "/activities", "/about", "/contact"];

/**
 * Sitemap bilingual.
 *
 * Setiap URL menyertakan tautan alternatif hreflang ke padanan bahasanya agar
 * mesin pencari memperlakukan keduanya sebagai satu halaman dalam dua bahasa,
 * bukan konten duplikat.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, researchSlugs] = await Promise.all([
    sanityFetch<string[]>(projectSlugsQuery, {}, [], { tags: ["project"] }),
    sanityFetch<string[]>(researchSlugsQuery, {}, [], { tags: ["research"] }),
  ]);

  const paths = [
    ...staticRoutes,
    ...projectSlugs.map((slug) => `/projects/${slug}`),
    ...researchSlugs.map((slug) => `/research/${slug}`),
  ];

  const now = new Date();

  return locales.flatMap((lang) =>
    paths.map((path) => ({
      url: `${siteUrl}/${lang}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.includes("/") ? 0.6 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
      },
    })),
  );
}
