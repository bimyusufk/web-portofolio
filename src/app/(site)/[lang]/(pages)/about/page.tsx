import { Download, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/content/portable-text";
import { SkillGrid } from "@/components/content/skill-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { fallbackSkillGroups } from "@/lib/fallback-content";
import { getSiteData } from "@/lib/site";
import type { SkillGroupData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForCrop } from "@/sanity/lib/image";
import { skillGroupsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.about.title,
    description: dict.about.lead,
    alternates: { canonical: `/${lang}/about` },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, site, skills] = await Promise.all([
    getDictionary(lang),
    getSiteData(lang),
    sanityFetch<SkillGroupData[]>(skillGroupsQuery, { lang }, [], { tags: ["skillGroup"] }),
  ]);

  const skillGroups = skills.length > 0 ? skills : fallbackSkillGroups[lang];
  const avatar = urlForCrop(site.avatar, 480, 480);

  return (
    <>
      <PageHeader
        crumbs={[{ label: dict.nav.home, href: `/${lang}` }, { label: dict.about.title }]}
        title={dict.about.title}
        lead={dict.about.lead}
        actions={
          site.cvUrl ? (
            <Button variant="outlined" asChild>
              <a href={site.cvUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" aria-hidden="true" />
                {dict.about.downloadCv}
              </a>
            </Button>
          ) : undefined
        }
      />

      <div className="gcp-container py-10 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {avatar && (
              <Image
                src={avatar}
                alt={site.name}
                width={256}
                height={256}
                priority
                className="mb-5 h-40 w-40 rounded-lg border border-line object-cover"
              />
            )}

            <p className="text-subtitle text-ink">{site.name}</p>
            <p className="mt-1 text-ui text-ink-secondary">{site.role}</p>

            <dl className="mt-5 space-y-3 border-t border-line-subtle pt-5">
              <div className="flex items-start gap-2.5">
                <dt className="sr-only">{dict.about.location}</dt>
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
                <dd className="text-ui text-ink-secondary">{site.location}</dd>
              </div>
              <div className="flex items-start gap-2.5">
                <dt className="sr-only">{dict.about.email}</dt>
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
                <dd className="min-w-0">
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all text-ui text-brand hover:underline hover:underline-offset-4"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>

          <div className="min-w-0">
            {site.focus && (
              <section className="mb-10">
                <h2 className="text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary">
                  {dict.about.focus}
                </h2>
                <p className="mt-3 max-w-prose text-body leading-[1.75] text-ink-secondary">{site.focus}</p>
              </section>
            )}

            {site.bio ? (
              <PortableText value={site.bio as never} />
            ) : (
              <p className="max-w-prose text-body leading-[1.75] text-ink-secondary">{dict.meta.description}</p>
            )}

            <section className="mt-14">
              <h2 className="text-title text-ink">{dict.about.skills}</h2>
              <div className="mt-6">
                <SkillGrid groups={skillGroups} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
