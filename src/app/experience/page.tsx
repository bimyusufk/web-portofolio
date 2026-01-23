import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { db } from "@/lib/prisma";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience — Bim Yusuf",
  description: "Professional experience and career history of Bim Yusuf.",
};

export default async function ExperiencePage() {
  const experiences = await db.experience.findMany({
    include: { thumbnail: true },
    orderBy: { startDate: "desc" },
  });

  // Parse JSON fields
  const parsedExperiences = experiences.map((exp) => ({
    ...exp,
    highlights: JSON.parse(exp.highlights) as string[],
  }));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 lg:py-16">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Experience</h1>
          <p className="mt-2 text-lg text-slate-600">
            My professional journey and the organizations I&apos;ve contributed to.
          </p>
        </div>

        {parsedExperiences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white/50 px-8 py-16 text-center">
            <p className="text-slate-600">No experience entries yet. Check back soon!</p>
          </div>
        ) : (
          <ExperienceTimeline experiences={parsedExperiences} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
