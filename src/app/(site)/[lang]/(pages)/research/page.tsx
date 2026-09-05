import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResearchCard } from "@/components/content/research-card";
import { SetupNotice } from "@/components/content/setup-notice";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/banner";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { ResearchCardData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { researchListQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.research.title,
    description: dict.research.lead,
    alternates: { canonical: `/${lang}/research` },
  };
}

export default async function ResearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, papers] = await Promise.all([
    getDictionary(lang),
    sanityFetch<ResearchCardData[]>(researchListQuery, { lang }, [], { tags: ["research"] }),
  ]);

  return (
    <>
      <SetupNotice dict={dict} />

      <PageHeader
        crumbs={[{ label: dict.nav.home, href: `/${lang}` }, { label: dict.research.title }]}
        title={dict.research.title}
        lead={dict.research.lead}
      />

      <div className="gcp-container py-10 lg:py-14">
        {papers.length === 0 ? (
          <EmptyState title={dict.research.empty} description={dict.research.emptyHint} />
        ) : (
          <div className="max-w-4xl">
            {papers.map((paper) => (
              <ResearchCard
                key={paper._id}
                paper={paper}
                lang={lang}
                labels={{
                  pdf: dict.research.pdf,
                  doi: dict.research.doi,
                  ongoing: dict.research.ongoing,
                  published: dict.research.published,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
