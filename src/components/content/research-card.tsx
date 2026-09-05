import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

import { StatusBadge, Tag } from "@/components/ui/chip";
import type { Locale } from "@/i18n/config";
import type { ResearchCardData } from "@/lib/types";

const stateTone = {
  ongoing: "yellow",
  review: "blue",
  published: "green",
} as const;

/**
 * Entri riset disusun seperti daftar sitasi: judul, penulis, venue, tahun,
 * lalu kata kunci. Format ini mudah dipindai pembaca akademik dan memetakan
 * langsung ke metadata ScholarlyArticle.
 */
export function ResearchCard({
  paper,
  lang,
  labels,
}: {
  paper: ResearchCardData;
  lang: Locale;
  labels: { pdf: string; doi: string; ongoing: string; published: string; review?: string };
}) {
  const authors = paper.authors ?? [];
  const meta = [paper.venue, paper.year].filter(Boolean).join(" · ");
  const state = paper.state ?? "ongoing";
  const stateLabel =
    state === "published"
      ? labels.published
      : state === "review"
        ? (labels.review ?? labels.ongoing)
        : labels.ongoing;
  const keywords = paper.keywords ?? [];

  return (
    <article className="group relative border-b border-line py-6 first:pt-0 last:border-b-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-subtitle leading-snug text-ink">
            <Link
              href={`/${lang}/research/${paper.slug}`}
              className="transition-colors hover:text-brand after:absolute after:inset-0 after:content-['']"
            >
              {paper.title}
            </Link>
          </h3>

          {authors.length > 0 && <p className="mt-1.5 text-ui text-ink-secondary">{authors.join(", ")}</p>}
          {meta && <p className="mt-0.5 text-ui italic text-ink-tertiary">{meta}</p>}

          <p className="mt-3 line-clamp-2 max-w-2xl text-ui text-ink-secondary">{paper.summary}</p>

          {keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {keywords.map((keyword) => (
                <Tag key={keyword}>{keyword}</Tag>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <StatusBadge tone={stateTone[state]}>{stateLabel}</StatusBadge>

          <div className="relative z-10 flex flex-wrap gap-3">
            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-ui text-brand hover:underline hover:underline-offset-4"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                {labels.pdf}
              </a>
            )}
            {paper.doi && (
              <a
                href={paper.doi.startsWith("http") ? paper.doi : `https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-ui text-brand hover:underline hover:underline-offset-4"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {labels.doi}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
