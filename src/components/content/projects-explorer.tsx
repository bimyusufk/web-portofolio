"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ProjectCard } from "./project-card";
import { FilterChip, Tag } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/banner";
import { Table, TableWrapper, Td, Th, Tr } from "@/components/ui/data-table";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/i18n/format";
import type { ProjectCardData } from "@/lib/types";
import { cn } from "@/lib/utils";

type Labels = {
  filterLabel: string;
  filterAll: string;
  viewGrid: string;
  viewTable: string;
  colName: string;
  colRole: string;
  colType: string;
  colStack: string;
  colYear: string;
  featured: string;
  readCase: string;
  countOne: string;
  countOther: string;
  noMatch: string;
  resetFilter: string;
};

/**
 * Halaman indeks proyek bergaya Cloud Console.
 *
 * Menggabungkan dua pola Google: chip saring di atas daftar, dan pengalih
 * tampilan kartu/tabel. Penyaringan dilakukan di klien karena jumlah proyek
 * kecil — tidak perlu perjalanan bolak-balik ke server untuk itu.
 */
export function ProjectsExplorer({
  projects,
  lang,
  labels,
}: {
  projects: ProjectCardData[];
  lang: Locale;
  labels: Labels;
}) {
  const [type, setType] = useState<string>("__all__");
  const [view, setView] = useState<"grid" | "table">("grid");

  // Jenis proyek diturunkan dari data, jadi chip tidak pernah usang saat CMS berubah.
  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      const key = project.projectType?.trim();
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const filtered = useMemo(
    () => (type === "__all__" ? projects : projects.filter((project) => project.projectType === type)),
    [projects, type],
  );

  const countLabel = interpolate(filtered.length === 1 ? labels.countOne : labels.countOther, {
    count: filtered.length,
  });

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden shrink-0 text-caption uppercase tracking-[0.06em] text-ink-tertiary sm:inline">
            {labels.filterLabel}
          </span>
          <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1" role="group" aria-label={labels.filterLabel}>
            <FilterChip active={type === "__all__"} onClick={() => setType("__all__")} count={projects.length}>
              {labels.filterAll}
            </FilterChip>
            {types.map(([value, count]) => (
              <FilterChip key={value} active={type === value} onClick={() => setType(value)} count={count}>
                {value}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <span className="text-ui tabular-nums text-ink-tertiary">{countLabel}</span>
          <div className="inline-flex rounded-lg border border-line p-0.5" role="group">
            <ViewButton
              active={view === "grid"}
              onClick={() => setView("grid")}
              label={labels.viewGrid}
              icon={<LayoutGrid className="h-4 w-4" />}
            />
            <ViewButton
              active={view === "table"}
              onClick={() => setView("table")}
              label={labels.viewTable}
              icon={<Table2 className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <div className="pt-8">
        {filtered.length === 0 ? (
          <EmptyState
            title={labels.noMatch}
            action={
              <Button variant="outlined" size="sm" onClick={() => setType("__all__")}>
                {labels.resetFilter}
              </Button>
            }
          />
        ) : view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                lang={lang}
                labels={{ featured: labels.featured, readCase: labels.readCase }}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th className="w-[38%]">{labels.colName}</Th>
                  <Th>{labels.colRole}</Th>
                  <Th>{labels.colType}</Th>
                  <Th>{labels.colStack}</Th>
                  <Th className="text-right">{labels.colYear}</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <Tr key={project._id}>
                    <Td className="align-top">
                      <Link
                        href={`/${lang}/projects/${project.slug}`}
                        className="font-medium text-brand hover:underline hover:underline-offset-4"
                      >
                        {project.title}
                      </Link>
                      <p className="mt-1 line-clamp-2 max-w-md text-caption text-ink-tertiary">{project.summary}</p>
                    </Td>
                    <Td className="align-top">{project.role ?? "—"}</Td>
                    <Td className="align-top">{project.projectType ?? "—"}</Td>
                    <Td className="align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {(project.techStack ?? []).slice(0, 2).map((tech) => (
                          <Tag key={tech}>{tech}</Tag>
                        ))}
                        {(project.techStack?.length ?? 0) > 2 && (
                          <Tag className="text-ink-tertiary">+{(project.techStack?.length ?? 0) - 2}</Tag>
                        )}
                      </div>
                    </Td>
                    <Td className="align-top text-right tabular-nums">{project.year ?? "—"}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex h-7 w-8 items-center justify-center rounded transition-colors duration-fast",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        active ? "bg-brand-tint text-brand-on" : "text-ink-tertiary hover:bg-surface-sunken hover:text-ink",
      )}
    >
      {icon}
    </button>
  );
}
