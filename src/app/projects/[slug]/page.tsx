import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Bim Yusuf`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  const deserialize = (data: string | null) => {
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const techArray = deserialize(project.tech) as string[];
  const imagesArray = deserialize(project.images) as string[];

  // Load thumbnail media (if thumbnailId set) and gallery media linked via projectGalleryId
  const thumbnail = project.thumbnailId
    ? await db.media.findUnique({ where: { id: project.thumbnailId } })
    : null;

  const gallery = await db.media.findMany({ where: { projectGalleryId: project.id }, orderBy: { createdAt: "asc" } });

  // If project.images is empty, prefer thumbnail or gallery urls
  let finalImages = [...imagesArray];
  if ((!finalImages || finalImages.length === 0) && thumbnail) {
    finalImages = [thumbnail.url];
  }
  // Append gallery urls after existing images (avoid duplicates)
  const galleryUrls = gallery.map((m) => m.url).filter((u) => !finalImages.includes(u));
  finalImages = [...finalImages, ...galleryUrls];

  const normalized = {
    ...project,
    tech: techArray,
    images: finalImages,
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 lg:py-16">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {normalized.tech.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100"
                >
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{normalized.title}</h1>
            <p className="text-lg text-white">{normalized.summary}</p>
            <div className="flex flex-wrap gap-3">
              {project.demoUrl && (
                <Button asChild>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                </Button>
              )}
              {project.repoUrl && (
                <Button variant="secondary" asChild>
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" /> Source Code
                  </a>
                </Button>
              )}
            </div>
          </header>

          {normalized.images.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-amber-50">
              <div className="relative aspect-video">
                <Image
                  src={normalized.images[0]}
                  alt={normalized.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {normalized.images.length > 1 && (
            <section aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="sr-only">Project gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {normalized.images.slice(1).map((url, i) => (
                  <div key={i} className="overflow-hidden rounded-lg bg-surface">
                    <Image
                      src={url}
                      alt={`${normalized.title} — image ${i + 2}`}
                      width={800}
                      height={600}
                      className="h-36 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              {normalized.role && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-rose-700 dark:text-rose-300">Role</p>
                  <p className="mt-1 text-sm text-rose-700">{normalized.role}</p>
                </div>
              )}
              {normalized.type && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-rose-700 dark:text-rose-300">Type</p>
                  <p className="mt-1 text-sm text-rose-700">{normalized.type}</p>
                </div>
              )}
            </div>
          </Card>

          <div className="prose prose-slate text-rose-700 max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: normalized.mdxContent }} 
              style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
            />
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
