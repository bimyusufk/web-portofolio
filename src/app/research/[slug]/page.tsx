import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paper = await db.research.findUnique({ where: { slug } });
  if (!paper) return { title: "Research Not Found" };
  return {
    title: `${paper.title} — Bim Yusuf`,
    description: paper.summary,
  };
}

export default async function ResearchDetailPage({ params }: Props) {
  const { slug } = await params;
  const paper = await db.research.findUnique({ where: { slug } });

  if (!paper || paper.status !== "PUBLISHED") {
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

  const normalized = {
    ...paper,
    authors: deserialize(paper.authors) as string[],
    keywords: deserialize(paper.keywords) as string[],
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 lg:py-16">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Research
        </Link>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {normalized.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100"
                >
                  {k}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{normalized.title}</h1>
            <p className="text-white">{normalized.authors.join(", ")}</p>
            <p className="text-sm text-white">
              {normalized.venue && `${normalized.venue} · `}
              {normalized.year}
            </p>
            <div className="flex flex-wrap gap-3">
              {normalized.pdfUrl && (
                <Button asChild>
                  <a href={normalized.pdfUrl} target="_blank" rel="noopener noreferrer" download>
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                </Button>
              )}
              {normalized.doi && (
                <Button variant="secondary" asChild>
                  <a href={`https://doi.org/${normalized.doi}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" /> DOI
                  </a>
                </Button>
              )}
            </div>
          </header>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Abstract</h2>
            <p className="mt-3 text-white" style={{ textAlign: 'justify' }}>{normalized.summary}</p>
          </Card>

          {normalized.mdxContent && (
            <div className="prose text-white max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: normalized.mdxContent }} 
                style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
              />
            </div>
          )}

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">BibTeX</h2>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
{`@article{${normalized.slug},
  title = {${normalized.title}},
  author = {${normalized.authors.join(" and ")}},
  year = {${normalized.year}},
  ${normalized.venue ? `journal = {${normalized.venue}},` : ""}
  ${normalized.doi ? `doi = {${normalized.doi}}` : ""}
}`}
            </pre>
          </Card>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
