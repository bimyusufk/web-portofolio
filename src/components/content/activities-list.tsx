"use client";

import { Award, ExternalLink, GitBranch, Mic, Users } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { FilterChip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/banner";
import { IconTile } from "@/components/ui/icon-tile";
import type { Locale } from "@/i18n/config";
import { formatFullDate } from "@/i18n/format";
import type { ActivityCategory, ActivityData } from "@/lib/types";
import { urlForCrop } from "@/sanity/lib/image";

const categoryIcon: Record<ActivityCategory, typeof Mic> = {
  SPEAKER: Mic,
  MENTOR: Users,
  AWARD: Award,
  OSS: GitBranch,
};

const order: ActivityCategory[] = ["SPEAKER", "MENTOR", "AWARD", "OSS"];

/**
 * Daftar aktivitas dengan chip saring kategori.
 *
 * Ditampilkan sebagai baris bergaris, bukan grid kartu — jumlah entri biasanya
 * banyak dan pendek, sehingga daftar padat lebih mudah dipindai daripada kartu.
 */
export function ActivitiesList({
  activities,
  lang,
  labels,
}: {
  activities: ActivityData[];
  lang: Locale;
  labels: Record<ActivityCategory, string> & { all: string; empty: string; openLink: string };
}) {
  const [category, setCategory] = useState<ActivityCategory | "__all__">("__all__");

  const counts = useMemo(() => {
    const map = new Map<ActivityCategory, number>();
    for (const item of activities) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [activities]);

  const visible = useMemo(
    () => (category === "__all__" ? activities : activities.filter((item) => item.category === category)),
    [activities, category],
  );

  return (
    <div>
      <div className="scrollbar-thin flex gap-2 overflow-x-auto border-b border-line pb-4">
        <FilterChip
          active={category === "__all__"}
          onClick={() => setCategory("__all__")}
          count={activities.length}
        >
          {labels.all}
        </FilterChip>
        {order
          .filter((key) => counts.has(key))
          .map((key) => (
            <FilterChip
              key={key}
              active={category === key}
              onClick={() => setCategory(key)}
              count={counts.get(key)}
            >
              {labels[key]}
            </FilterChip>
          ))}
      </div>

      {visible.length === 0 ? (
        <div className="pt-8">
          <EmptyState title={labels.empty} />
        </div>
      ) : (
        <ul className="divide-y divide-line-subtle">
          {visible.map((item) => {
            const Icon = categoryIcon[item.category];
            const thumb = urlForCrop(item.cover, 160, 160);

            return (
              <li key={item._id} className="flex gap-4 py-5">
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={item.cover?.alt ?? ""}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-lg border border-line object-cover"
                  />
                ) : (
                  <IconTile icon={Icon} className="mt-0.5" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-subtitle text-ink">{item.title}</h3>
                    <span className="text-caption text-ink-tertiary">{labels[item.category]}</span>
                  </div>

                  <p className="mt-0.5 text-ui text-ink-tertiary">
                    {[item.organiser, formatFullDate(item.date, lang)].filter(Boolean).join(" · ")}
                  </p>

                  {item.description && (
                    <p className="mt-2 max-w-2xl text-ui text-ink-secondary">{item.description}</p>
                  )}

                  {(item.links?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-4">
                      {item.links!.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-ui text-brand hover:underline hover:underline-offset-4"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
