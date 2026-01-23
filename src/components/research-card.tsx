"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

type Research = {
  id: string;
  title: string;
  slug: string;
  authors: string[];
  venue: string | null;
  year: number | null;
  summary: string;
  keywords: string[];
  pdfUrl: string | null;
};

export function ResearchCard({ paper }: { paper: Research }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/50 p-6 shadow-card ring-1 ring-rose-50 dark:ring-slate-700/50 backdrop-blur transition"
    >
      <Link href={`/research/${paper.slug}`} className="block space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-rose-700 text-white transition">
              {paper.title}
            </h3>
            <p className="text-sm text-[rgb(var(--foreground)/0.85)]">{paper.authors.join(", ")}</p>
            <p className="text-xs text-slate-500 dark:text-white">
              {paper.venue && `${paper.venue} · `}
              {paper.year}
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-200 transition group-hover:bg-amber-200">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-[rgb(var(--foreground)/0.75)]">{paper.summary}</p>

        <div className="flex flex-wrap items-center gap-2">
          {paper.keywords.slice(0, 3).map((k) => (
            <span
              key={k}
              className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-100"
            >
              {k}
            </span>
          ))}
          {paper.pdfUrl && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-amber-700">
              <FileText className="h-3 w-3" /> PDF
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
