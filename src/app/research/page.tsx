import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ResearchCard } from "@/components/research-card";
import { db } from "@/lib/prisma";
import type { Metadata } from "next";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Research — Bim Yusuf",
  description: "Academic research and publications by Bim Yusuf Karang in HCI and software systems.",
};

export default async function ResearchPage() {
  const papers = await db.research.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { year: "desc" },
  });

  // Parse JSON fields
  const parsedPapers = papers.map((paper) => ({
    ...paper,
    authors: JSON.parse(paper.authors) as string[],
    keywords: JSON.parse(paper.keywords) as string[],
  }));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 lg:py-16">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Research</h1>
          <p className="mt-2 text-lg text-white">
            Academic publications and research projects exploring human-computer interaction and software systems.
          </p>
        </div>

        {parsedPapers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white/50 px-8 py-16 text-center">
            <p className="text-slate-600">No research papers published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {parsedPapers.map((paper) => (
              <ResearchCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
