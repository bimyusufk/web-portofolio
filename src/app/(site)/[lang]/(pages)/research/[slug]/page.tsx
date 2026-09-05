import { ExternalLink, FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImageGallery } from "@/components/content/image-gallery";
import { PortableText } from "@/components/content/portable-text";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd, breadcrumbSchema, scholarlyArticleSchema } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { StatusBadge, Tag } from "@/components/ui/chip";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteUrl } from "@/lib/site";
import type { ResearchDetailData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { researchBySlugQuery, researchSlugsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(researchSlugsQuery, {}, [], { tags: ["research"] });
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const paper = await sanityFetch<ResearchDetailData | null>(
    researchBySlugQuery,
    { lang, slug },
    null,
    { tags: ["research"] },
  );
  if (!paper) return {};

  return {
    title: paper.title,
    description: paper.summary,
    alternates: {
      canonical: `/${lang}/research/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/research/${slug}`])),
    },
    openGraph: { type: "article", title: paper.title, description: paper.summary },
  };
}

export default async function ResearchDetailPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, paper] = await Promise.all([
    getDictionary(lang),
    sanityFetch<ResearchDetailData | null>(researchBySlugQuery, { lang, slug }, null, { tags: ["research"] }),
  ]);

  if (!paper) notFound();

  const authors = paper.authors ?? [];
  const keywords = paper.keywords ?? [];
  const gallery = paper.gallery ?? [];
  const state = paper.state ?? "ongoing";
  const stateLabel = state === "published" ? dict.research.published : dict.research.ongoing;
  const doiHref = paper.doi ? (paper.doi.startsWith("http") ? paper.doi : `https://doi.org/${paper.doi}`) : null;
  const pageUrl = `${siteUrl}/${lang}/research/${slug}`;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: dict.nav.home, href: `/${lang}` },
          { label: dict.research.title, href: `/${lang}/research` },
          { label: paper.title },
        ]}
        title={paper.title}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone={state === "published" ? "green" : "yellow"}>{stateLabel}</StatusBadge>
            {authors.length > 0 && <span className="text-ui text-ink-secondary">{authors.join(", ")}</span>}
            {(paper.venue || paper.year) && (
              <span className="text-ui italic text-ink-tertiary">
                {[paper.venue, paper.year].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
        }
        actions={
          <>
            {paper.pdfUrl && (
              <Button asChild>
                <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {dict.research.pdf}
                </a>
              </Button>
            )}
            {doiHref && (
              <Button variant="outlined" asChild>
                <a href={doiHref} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {dict.research.doi}
                </a>
              </Button>
            )}
          </>
        }
      />

      <div className="gcp-container py-10 lg:py-14">
        <div className="max-w-prose">
          <h2 className="text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary">
            {dict.research.abstract}
          </h2>
          <p className="mt-3 text-body leading-[1.75] text-ink-secondary">{paper.summary}</p>
        </div>

        {keywords.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-caption uppercase tracking-[0.06em] text-ink-tertiary">
              {dict.research.keywords}
            </span>
            {keywords.map((keyword) => (
              <Tag key={keyword}>{keyword}</Tag>
            ))}
          </div>
        )}

        <div className="mt-12">
          <PortableText value={paper.body} />
        </div>

        {gallery.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-title text-ink">{dict.projectDetail.gallery}</h2>
            <ImageGallery images={gallery} title={paper.title} hint={dict.projectDetail.galleryHint} />
          </section>
        )}
      </div>

      <JsonLd
        data={scholarlyArticleSchema({
          name: paper.title,
          description: paper.summary,
          url: pageUrl,
          authors,
          year: paper.year,
          venue: paper.venue,
          doi: paper.doi,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${siteUrl}/${lang}` },
          { name: dict.research.title, url: `${siteUrl}/${lang}/research` },
          { name: paper.title, url: pageUrl },
        ])}
      />
    </>
  );
}
