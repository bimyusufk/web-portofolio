import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProjectCard } from "@/components/project-card";
import { db } from "@/lib/prisma";
import type { Metadata } from "next";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Projects — Bim Yusuf",
  description: "Explore projects by Bim Yusuf — web apps, research tools, and open-source contributions.",
};

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  // Deserialize JSON-string fields (SQLite stores arrays as JSON strings)
  const deserialize = (data: string | null) => {
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const normalized = projects.map((p) => ({
    ...p,
    tech: deserialize(p.tech),
    images: deserialize(p.images),
  }));

  // If projects use media thumbnails (thumbnailId) or empty images, fetch thumbnails
  const thumbnailIds = normalized.map((p) => p.thumbnailId).filter(Boolean) as string[];
  const thumbnails = thumbnailIds.length
    ? await db.media.findMany({ where: { id: { in: thumbnailIds } } })
    : [];

  const withThumbnails = normalized.map((p) => {
    const thumb = thumbnails.find((t) => t.id === p.thumbnailId);
    // prefer explicit images field, otherwise use thumbnail media url
    const images = (p.images && p.images.length > 0) ? p.images : thumb ? [thumb.url] : [];
    return { ...p, images };
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 lg:py-16">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Projects</h1>
          <p className="mt-2 text-lg text-slate-600">
            A collection of applications, tools, and experiments I&apos;ve built.
          </p>
        </div>

        {withThumbnails.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white/50 px-8 py-16 text-center">
            <p className="text-slate-600">No projects published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {withThumbnails.map((project) => (
              <ProjectCard key={project.id} project={project as any} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
