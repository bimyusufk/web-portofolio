import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/content/project-card";
import { ProfileMosaic } from "@/components/content/profile-mosaic";
import { ResearchCard } from "@/components/content/research-card";
import { SetupNotice } from "@/components/content/setup-notice";
import { SkillGrid } from "@/components/content/skill-grid";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { Stat } from "@/components/ui/stat";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { fallbackMetrics, fallbackSkillGroups } from "@/lib/fallback-content";
import { getSiteData } from "@/lib/site";
import type { ProjectCardData, ResearchCardData, SkillGroupData } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { featuredProjectsQuery, researchListQuery, skillGroupsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, site, projects, skills, research] = await Promise.all([
    getDictionary(lang),
    getSiteData(lang),
    sanityFetch<ProjectCardData[]>(featuredProjectsQuery, { lang, limit: 4 }, [], { tags: ["project"] }),
    sanityFetch<SkillGroupData[]>(skillGroupsQuery, { lang }, [], { tags: ["skillGroup"] }),
    sanityFetch<ResearchCardData[]>(researchListQuery, { lang }, [], { tags: ["research"] }),
  ]);

  const metrics = site.metrics.length > 0 ? site.metrics : fallbackMetrics[lang];
  const skillGroups = skills.length > 0 ? skills : fallbackSkillGroups[lang];
  const gridProjects = projects.slice(0, 3);

  return (
    <>
      <SetupNotice dict={dict} />

      {/* Hero: teks rata kiri, profil dengan mozaik di sebelah kanan. */}
      <section className="border-b border-line">
        <div className="gcp-container grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="max-w-xl animate-slide-in-left">
            <p className="text-ui font-medium tracking-[0.01em] text-brand">{dict.home.eyebrow}</p>

            <h1 className="mt-4 text-[2.25rem] leading-[1.15] tracking-[-0.02em] text-ink sm:text-[3rem] lg:text-[3.5rem]">
              {site.headline ?? (
                <>
                  {dict.home.headlineLead} <span className="text-brand">{dict.home.headlineAccent}</span>{" "}
                  {dict.home.headlineTail}
                </>
              )}
            </h1>

            <p className="mt-6 text-[1.0625rem] leading-[1.65] text-ink-secondary">
              {site.focus ?? dict.home.lead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={`/${lang}/projects`}>
                  {dict.home.ctaPrimary}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="text" size="lg" asChild>
                <Link href={`/${lang}/contact`}>{dict.home.ctaSecondary}</Link>
              </Button>
            </div>
          </div>

          <ProfileMosaic />
        </div>
      </section>

      {/* Metrik: pita statistik dengan garis pemisah tipis, khas ringkasan dasbor Cloud. */}
      <section className="border-b border-line bg-surface-subtle animate-slide-in-bottom">
        <div className="gcp-container py-12 lg:py-16">
          <h2 className="text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary">
            {dict.home.metricsTitle}
          </h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <Stat key={metric.label} value={metric.value} label={metric.label} className="border-t-0" />
            ))}
          </div>
          <p className="mt-4 text-caption text-ink-tertiary">{dict.home.metricsLead}</p>
        </div>
      </section>

      {gridProjects.length > 0 && (
        <Section className="animate-slide-in-left">
          <SectionHeader
            title={dict.home.workTitle}
            lead={dict.home.workLead}
            action={
              <Button variant="outlined" asChild>
                <Link href={`/${lang}/projects`}>{dict.home.workAll}</Link>
              </Button>
            }
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridProjects.map((project, idx) => (
              <div
                key={project._id}
                className={idx === 0 ? "animate-slide-in-bottom" : idx === 1 ? "animate-slide-in-bottom-delayed" : "animate-slide-in-bottom-delayed"}
                style={idx > 1 ? { animationDelay: `${0.2 + (idx - 1) * 0.1}s` } : undefined}
              >
                <ProjectCard
                  project={project}
                  lang={lang}
                  labels={{ featured: dict.projects.featured, readCase: dict.projects.readCase }}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="border-y border-line bg-surface-subtle animate-slide-in-right">
        <Section>
          <SectionHeader title={dict.home.skillsTitle} lead={dict.home.skillsLead} />
          <div className="mt-10">
            <SkillGrid groups={skillGroups} />
          </div>
        </Section>
      </div>

      {research.length > 0 && (
        <Section className="animate-slide-in-left">
          <SectionHeader
            title={dict.home.researchTitle}
            lead={dict.home.researchLead}
            action={
              <Button variant="outlined" asChild>
                <Link href={`/${lang}/research`}>{dict.home.researchAll}</Link>
              </Button>
            }
          />
          <div className="mt-8 space-y-4">
            {research.slice(0, 2).map((paper, idx) => (
              <div key={paper._id} className={idx === 0 ? "animate-slide-in-bottom" : "animate-slide-in-bottom-delayed"}>
                <ResearchCard
                  paper={paper}
                  lang={lang}
                  labels={{
                    pdf: dict.research.pdf,
                    doi: dict.research.doi,
                    ongoing: dict.research.ongoing,
                    published: dict.research.published,
                  }}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Pita ajakan: satu-satunya blok berkontras terbalik di halaman. */}
      <section className="border-t border-line bg-surface-inverse animate-slide-in-bottom">
        <div className="gcp-container flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between lg:py-16">
          <div className="max-w-xl">
            <h2 className="text-title text-ink-inverse">{dict.home.contactTitle}</h2>
            <p className="mt-2 text-body text-ink-inverse/70">{dict.home.contactLead}</p>
          </div>
          <Button
            size="lg"
            className="shrink-0 self-start bg-surface text-brand hover:bg-surface-subtle md:self-auto"
            asChild
          >
            <Link href={`/${lang}/contact`}>
              {dict.home.contactCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
