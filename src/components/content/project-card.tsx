import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Tag } from "@/components/ui/chip";
import type { Locale } from "@/i18n/config";
import type { ProjectCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { urlForCrop } from "@/sanity/lib/image";

/**
 * Kartu proyek bergaya kartu produk cloud.google.com:
 * gambar rasio 16:10 di atas, judul, ringkasan dua baris, lalu chip teknologi.
 * Seluruh kartu bisa diklik lewat tautan meluas (stretched link) sehingga
 * tetap satu target tekan di layar sentuh tanpa menyarangkan tautan di dalam tautan.
 */
export function ProjectCard({
  project,
  lang,
  labels,
  priority = false,
}: {
  project: ProjectCardData;
  lang: Locale;
  labels: { featured: string; readCase: string };
  priority?: boolean;
}) {
  const cover = urlForCrop(project.cover, 720, 450);
  const stack = project.techStack ?? [];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow duration-fast ease-standard focus-within:shadow-elevation-2 hover:shadow-elevation-2">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-subtle">
        {cover ? (
          <Image
            src={cover}
            alt={project.cover?.alt ?? project.title}
            fill
            priority={priority}
            placeholder={project.cover?.lqip ? "blur" : "empty"}
            blurDataURL={project.cover?.lqip ?? undefined}
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <PlaceholderCover title={project.title} />
        )}

        {project.featured && (
          <span className="absolute left-3 top-3 inline-flex h-6 items-center rounded bg-surface px-2 text-caption font-medium text-brand shadow-elevation-1">
            {labels.featured}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {(project.projectType || project.year) && (
          <p className="mb-2 text-caption uppercase tracking-[0.06em] text-ink-tertiary">
            {[project.projectType, project.year].filter(Boolean).join(" · ")}
          </p>
        )}

        <h3 className="text-subtitle text-ink">
          <Link
            href={`/${lang}/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-ui text-ink-secondary">{project.summary}</p>

        {stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {stack.slice(0, 3).map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
            {stack.length > 3 && <Tag className="text-ink-tertiary">+{stack.length - 3}</Tag>}
          </div>
        )}

        <p className="mt-5 inline-flex items-center gap-1.5 text-ui font-medium text-brand">
          {labels.readCase}
          <ArrowRight className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5" aria-hidden="true" />
        </p>
      </div>
    </article>
  );
}

/**
 * Sampul pengganti saat proyek belum punya gambar.
 * Pola garis diagonal halus — cukup untuk mengisi ruang tanpa terlihat seperti
 * gambar rusak, dan tidak meniru foto.
 */
function PlaceholderCover({ title, className }: { title: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-[repeating-linear-gradient(135deg,rgb(var(--surface-sunken))_0_12px,rgb(var(--surface-subtle))_12px_24px)]",
        className,
      )}
      aria-hidden="true"
    >
      <span className="text-[2.5rem] font-light text-ink-tertiary/60">{title.charAt(0).toUpperCase()}</span>
    </div>
  );
}
