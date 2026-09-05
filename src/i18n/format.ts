import type { Locale } from "./config";

/** Mengganti placeholder `{nama}` pada string kamus. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Memilih bentuk tunggal/jamak.
 * Bahasa Indonesia tidak membedakan keduanya, tetapi kunci `_one`/`_other`
 * tetap disediakan agar bahasa Inggris benar tanpa cabang khusus di komponen.
 */
export function plural(
  forms: { one: string; other: string },
  count: number,
  locale: Locale,
): string {
  const rules = new Intl.PluralRules(locale === "id" ? "id-ID" : "en-US");
  const form = rules.select(count) === "one" ? forms.one : forms.other;
  return interpolate(form, { count });
}

const dateLocale: Record<Locale, string> = { id: "id-ID", en: "en-GB" };

/** Contoh keluaran: "Agustus 2024" / "August 2024". */
export function formatMonthYear(value: string | null | undefined, locale: Locale): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(dateLocale[locale], { month: "long", year: "numeric" }).format(date);
}

export function formatFullDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(dateLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Rentang bulan antara dua tanggal, dibulatkan ke atas minimal satu bulan. */
export function monthsBetween(start: string, end?: string | null): number {
  const from = new Date(start);
  const to = end ? new Date(end) : new Date();
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  return Math.max(1, months + 1);
}

/** Ubah jumlah bulan menjadi teks "2 tahun 3 bulan" sesuai bahasa. */
export function formatDuration(
  months: number,
  locale: Locale,
  labels: { years_one: string; years_other: string; months_one: string; months_other: string },
): string {
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(plural({ one: labels.years_one, other: labels.years_other }, years, locale));
  }
  if (remainder > 0 || years === 0) {
    parts.push(plural({ one: labels.months_one, other: labels.months_other }, remainder || months, locale));
  }

  return parts.join(" ");
}
