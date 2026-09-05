import Image from "next/image";

import { PortableText } from "./portable-text";
import { StatusBadge } from "@/components/ui/chip";
import type { Locale } from "@/i18n/config";
import { formatDuration, formatMonthYear, monthsBetween } from "@/i18n/format";
import type { ExperienceData } from "@/lib/types";
import { urlForCrop } from "@/sanity/lib/image";

/**
 * Linimasa dua kolom.
 *
 * Kolom kiri berisi rentang tanggal dengan angka tabular agar sejajar antar baris;
 * kolom kanan berisi isi. Garis vertikal tipis dan simpul persegi kecil mengikuti
 * gaya linimasa Cloud, bukan lingkaran bergradien.
 */
export function ExperienceTimeline({
  items,
  lang,
  labels,
}: {
  items: ExperienceData[];
  lang: Locale;
  labels: {
    present: string;
    highlights: string;
    months_one: string;
    months_other: string;
    years_one: string;
    years_other: string;
  };
}) {
  return (
    <ol className="relative">
      {items.map((item, index) => {
        const start = formatMonthYear(item.startDate, lang);
        const end = item.endDate ? formatMonthYear(item.endDate, lang) : labels.present;
        const duration = formatDuration(monthsBetween(item.startDate, item.endDate), lang, labels);
        const logo = urlForCrop(item.logo, 96, 96);
        const isCurrent = !item.endDate;
        const highlights = item.highlights ?? [];

        return (
          <li key={item._id} className="relative grid gap-x-8 gap-y-3 pb-12 last:pb-0 md:grid-cols-[13rem_1fr]">
            {index < items.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-2 hidden h-full w-px bg-line md:left-[13rem] md:block"
              />
            )}

            <div className="md:pr-8 md:text-right">
              <p className="text-ui tabular-nums text-ink">
                {start} &ndash; {end}
              </p>
              <p className="mt-1 text-caption text-ink-tertiary">{duration}</p>
              {item.location && <p className="mt-1 text-caption text-ink-tertiary">{item.location}</p>}
            </div>

            <div className="relative md:pl-8">
              <span
                aria-hidden="true"
                className="absolute -left-[3px] top-[7px] hidden h-[7px] w-[7px] rounded-sm bg-brand md:block"
              />

              <div className="flex items-start gap-3">
                {logo && (
                  <Image
                    src={logo}
                    alt=""
                    width={40}
                    height={40}
                    className="mt-0.5 h-10 w-10 shrink-0 rounded border border-line object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-subtitle text-ink">{item.role}</h3>
                    {isCurrent && <StatusBadge tone="green">{labels.present}</StatusBadge>}
                  </div>
                  <p className="mt-0.5 text-ui text-ink-secondary">{item.company}</p>
                </div>
              </div>

              {item.description && (
                <PortableText value={item.description} className="mt-4 max-w-2xl [&_p:last-child]:mb-0" />
              )}

              {highlights.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary">
                    {labels.highlights}
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="relative pl-5 text-ui text-ink-secondary before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
