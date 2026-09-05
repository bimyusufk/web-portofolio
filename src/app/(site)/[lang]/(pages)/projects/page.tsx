import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectsExplorer } from "@/components/content/projects-explorer";
import { SetupNotice } from "@/components/content/setup-notice";
import { EmptyState } from "@/components/ui/banner";
import { PageHeader } from "@/components/layout/page-header";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { ProjectCardData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { projectsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.projects.title,
    description: dict.projects.lead,
    alternates: { canonical: `/${lang}/projects` },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, projects] = await Promise.all([
    getDictionary(lang),
    sanityFetch<ProjectCardData[]>(projectsQuery, { lang }, [], { tags: ["project"] }),
  ]);

  return (
    <>
      <SetupNotice dict={dict} />

      <PageHeader
        crumbs={[
          { label: dict.nav.home, href: `/${lang}` },
          { label: dict.projects.title },
        ]}
        title={dict.projects.title}
        lead={dict.projects.lead}
      />

      <div className="gcp-container py-8 lg:py-12">
        {projects.length === 0 ? (
          <EmptyState title={dict.projects.empty} description={dict.projects.emptyHint} />
        ) : (
          <ProjectsExplorer
            projects={projects}
            lang={lang}
            labels={{
              filterLabel: dict.projects.filterLabel,
              filterAll: dict.projects.filterAll,
              viewGrid: dict.projects.viewGrid,
              viewTable: dict.projects.viewTable,
              colName: dict.projects.colName,
              colRole: dict.projects.colRole,
              colType: dict.projects.colType,
              colStack: dict.projects.colStack,
              colYear: dict.projects.colYear,
              featured: dict.projects.featured,
              readCase: dict.projects.readCase,
              countOne: dict.projects.count_one,
              countOther: dict.projects.count_other,
              noMatch: dict.projects.noMatch,
              resetFilter: dict.projects.resetFilter,
            }}
          />
        )}
      </div>
    </>
  );
}
