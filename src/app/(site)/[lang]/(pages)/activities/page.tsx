import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActivitiesList } from "@/components/content/activities-list";
import { SetupNotice } from "@/components/content/setup-notice";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/banner";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { ActivityData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { activitiesQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.activities.title,
    description: dict.activities.lead,
    alternates: { canonical: `/${lang}/activities` },
  };
}

export default async function ActivitiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, activities] = await Promise.all([
    getDictionary(lang),
    sanityFetch<ActivityData[]>(activitiesQuery, { lang }, [], { tags: ["activity"] }),
  ]);

  return (
    <>
      <SetupNotice dict={dict} />

      <PageHeader
        crumbs={[{ label: dict.nav.home, href: `/${lang}` }, { label: dict.activities.title }]}
        title={dict.activities.title}
        lead={dict.activities.lead}
      />

      <div className="gcp-container py-10 lg:py-14">
        {activities.length === 0 ? (
          <EmptyState title={dict.activities.empty} description={dict.activities.emptyHint} />
        ) : (
          <div className="max-w-4xl">
            <ActivitiesList
              activities={activities}
              lang={lang}
              labels={{
                all: dict.activities.categoryAll,
                empty: dict.activities.empty,
                openLink: dict.activities.openLink,
                SPEAKER: dict.activities.SPEAKER,
                MENTOR: dict.activities.MENTOR,
                AWARD: dict.activities.AWARD,
                OSS: dict.activities.OSS,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
