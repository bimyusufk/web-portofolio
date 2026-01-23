"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tech: string[];
  images: string[];
  featured: boolean;
};

export function ProjectCard({ project }: { project: Project }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
      className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/50 shadow-card ring-1 ring-rose-50 dark:ring-slate-700/50 backdrop-blur transition"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        {project.images.length > 0 ? (
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50">
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
            <span className="text-4xl font-bold text-rose-200">{project.title.charAt(0)}</span>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-rose-700 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition">
                {project.title}
              </h3>
              <p className="line-clamp-2 text-sm text-[rgb(var(--foreground)/0.85)]">{project.summary}</p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-100 transition group-hover:bg-rose-100">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-100"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-700/50 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>

      {project.featured && (
        <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
          Featured
        </span>
      )}
    </motion.article>
  );
}
