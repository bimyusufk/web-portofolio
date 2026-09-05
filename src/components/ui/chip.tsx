import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Chip statis - dipakai untuk menampilkan teknologi atau kata kunci.
 * Bukan kontrol; tidak bisa difokus atau diklik.
 */
export function Tag({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border border-line px-3 text-caption text-ink-secondary",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Filter chip Material: berubah menjadi biru muda dengan garis biru saat aktif.
 * Dipakai pada halaman indeks bergaya Cloud Console.
 */
export function FilterChip({
  active = false,
  className,
  children,
  count,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-ui transition-colors duration-fast ease-standard",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        active
          ? "border-brand bg-brand-tint font-medium text-brand-on"
          : "border-line bg-surface text-ink-secondary hover:bg-surface-sunken hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
      {typeof count === "number" && (
        <span className={cn("tabular-nums", active ? "text-brand-on/70" : "text-ink-tertiary")}>{count}</span>
      )}
    </button>
  );
}

const statusStyles = {
  green: "border-status-green/30 bg-status-green/10 text-status-green",
  blue: "border-status-blue/30 bg-status-blue/10 text-status-blue",
  yellow: "border-status-yellow/40 bg-status-yellow/10 text-status-yellow",
  red: "border-status-red/30 bg-status-red/10 text-status-red",
  neutral: "border-line bg-surface-subtle text-ink-secondary",
} as const;

/** Lencana status bergaya Console - warna Google dipakai sebagai penanda, bukan hiasan. */
export function StatusBadge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof statusStyles }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded border px-2 text-caption font-medium",
        statusStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
