import { ArrowRight, ExternalLink, Github } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ImageGallery } from "@/components/content/image-gallery";
import { PortableText, extractHeadings } from "@/components/content/portable-text";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd, breadcrumbSchema, creativeWorkSchema } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/chip";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteData, siteUrl } from "@/lib/site";
import type { AdjacentProject, ProjectDetailData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { adjacentProjectQuery, projectBySlugQuery, projectSlugsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(projectSlugsQuery, {}, [], { tags: ["project"] });
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const project = await sanityFetch<ProjectDetailData | null>(
    projectBySlugQuery,
    { lang, slug },
    null,
    { tags: ["project"] },
  );
  if (!project) return {};

  const cover = urlForImage(project.cover, { width: 1200 });

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/${lang}/projects/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/projects/${slug}`])),
    },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/${lang}/projects/${slug}`,
      images: cover ? [{ url: cover, width: 1200, alt: project.cover?.alt ?? project.title }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, site, project] = await Promise.all([
    getDictionary(lang),
    getSiteData(lang),
    sanityFetch<ProjectDetailData | null>(projectBySlugQuery, { lang, slug }, null, { tags: ["project"] }),
  ]);

  if (!project) notFound();

  const next = await sanityFetch<AdjacentProject>(adjacentProjectQuery, { lang, slug }, null, {
    tags: ["project"],
  });

  const cover = urlForImage(project.cover, { width: 1600 });
  const headings = extractHeadings(project.body);
  const stack = project.techStack ?? [];
  const gallery = project.gallery ?? [];
  const metrics = project.metrics ?? [];
  const pageUrl = `${siteUrl}/${lang}/projects/${slug}`;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: dict.nav.home, href: `/${lang}` },
          { label: dict.projects.title, href: `/${lang}/projects` },
          { label: project.title },
        ]}
        title={project.title}
        lead={project.summary}
        meta={
          stack.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          ) : undefined
        }
        actions={
          <>
            {project.demoUrl && (
              <Button asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {dict.projectDetail.demo}
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button variant="outlined" asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  {dict.projectDetail.repo}
                </a>
              </Button>
            )}
          </>
        }
      />

      <div className="gcp-container py-10 lg:py-14">
        {cover && (
          <figure className="mb-12 overflow-hidden rounded-lg border border-line bg-surface-subtle">
            <div className="relative aspect-[16/9]">
              <Image
                src={cover}
                alt={project.cover?.alt ?? project.title}
                fill
                priority
                placeholder={project.cover?.lqip ? "blur" : "empty"}
                blurDataURL={project.cover?.lqip ?? undefined}
                className="object-cover"
                sizes="(min-width: 1280px) 1200px, 100vw"
              />
            </div>
            {project.cover?.caption && (
              <figcaption className="border-t border-line px-4 py-2.5 text-caption text-ink-tertiary">
                {project.cover.caption}
              </figcaption>
            )}
          </figure>
        )}

        {metrics.length > 0 && (
          <dl className="mb-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-surface-subtle px-5 py-6">
                <dt className="order-2 mt-3 text-ui text-ink-secondary">{metric.label}</dt>
                <dd className="text-[2rem] leading-none tabular-nums tracking-[-0.02em] text-ink">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <article className="min-w-0">
            <PortableText value={project.body} />

            {gallery.length > 0 && (
              <section className="mt-14" aria-labelledby="gallery-heading">
                <h2 id="gallery-heading" className="mb-5 text-title text-ink">
                  {dict.projectDetail.gallery}
                </h2>
                <ImageGallery
                  images={gallery}
                  title={project.title}
                  hint={dict.projectDetail.galleryHint}
                />
              </section>
            )}
          </article>

          {/* Sidebar lengket bergaya dokumentasi Google Cloud. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-line bg-surface-subtle p-5">
              <h2 className="text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary">
                {dict.projectDetail.details}
              </h2>
              <dl className="mt-4 space-y-4">
                {project.role && <DetailRow label={dict.projectDetail.role} value={project.role} />}
                {project.projectType && (
                  <DetailRow label={dict.projectDetail.type} value={project.projectType} />
                )}
                {project.year && <DetailRow label={dict.projectDetail.year} value={project.year} />}
              </dl>
            </div>

            {headings.length > 0 && (
              <nav className="mt-6 border-l border-line pl-4" aria-labelledby="toc-heading">
                <h2
                  id="toc-heading"
                  className="text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary"
                >
                  {dict.projectDetail.onThisPage}
                </h2>
                <ul className="mt-3 space-y-2">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className="text-ui text-ink-secondary transition-colors hover:text-brand"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
        </div>

        {next && (
          <nav className="mt-16 border-t border-line pt-8" aria-label={dict.projectDetail.next}>
            <p className="text-caption uppercase tracking-[0.06em] text-ink-tertiary">
              {dict.projectDetail.next}
            </p>
            <Link
              href={`/${lang}/projects/${next.slug}`}
              className="group mt-2 inline-flex items-baseline gap-2 text-title text-ink transition-colors hover:text-brand"
            >
              {next.title}
              <ArrowRight
                className="h-5 w-5 shrink-0 self-center transition-transform duration-fast group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </nav>
        )}
      </div>

      <JsonLd
        data={creativeWorkSchema({
          name: project.title,
          description: project.summary,
          url: pageUrl,
          author: site.name,
          image: cover,
          datePublished: project.publishedAt,
          keywords: stack,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${siteUrl}/${lang}` },
          { name: dict.projects.title, url: `${siteUrl}/${lang}/projects` },
          { name: project.title, url: pageUrl },
        ])}
      />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption uppercase tracking-[0.06em] text-ink-tertiary">{label}</dt>
      <dd className="mt-1 text-ui text-ink">{value}</dd>
    </div>
  );
}
