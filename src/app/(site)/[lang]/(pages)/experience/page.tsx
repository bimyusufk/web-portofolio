import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExperienceTimeline } from "@/components/content/experience-timeline";
import { SetupNotice } from "@/components/content/setup-notice";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/banner";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { ExperienceData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { experienceQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.experience.title,
    description: dict.experience.lead,
    alternates: { canonical: `/${lang}/experience` },
  };
}

export default async function ExperiencePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, items] = await Promise.all([
    getDictionary(lang),
    sanityFetch<ExperienceData[]>(experienceQuery, { lang }, [], { tags: ["experience"] }),
  ]);

  return (
    <>
      <SetupNotice dict={dict} />

      <PageHeader
        crumbs={[{ label: dict.nav.home, href: `/${lang}` }, { label: dict.experience.title }]}
        title={dict.experience.title}
        lead={dict.experience.lead}
      />

      <div className="gcp-container py-10 lg:py-14">
        {items.length === 0 ? (
          <EmptyState title={dict.experience.empty} description={dict.experience.emptyHint} />
        ) : (
          <div className="max-w-5xl">
            <ExperienceTimeline
              items={items}
              lang={lang}
              labels={{
                present: dict.experience.present,
                highlights: dict.experience.highlights,
                months_one: dict.experience.months_one,
                months_other: dict.experience.months_other,
                years_one: dict.experience.years_one,
                years_other: dict.experience.years_other,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
