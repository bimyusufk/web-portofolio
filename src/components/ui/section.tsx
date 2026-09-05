import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Kepala bagian standar: eyebrow biru kecil, judul berbobot ringan, lead abu.
 * Semua bagian memakai ini agar ritme vertikal halaman konsisten.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  align = "start",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow && (
          <p className="mb-2 text-ui font-medium tracking-[0.01em] text-brand">{eyebrow}</p>
        )}
        <Heading className={Heading === "h1" ? "text-headline sm:text-display-sm" : "text-title sm:text-headline"}>
          {title}
        </Heading>
        {lead && <p className="mt-3 text-body text-ink-secondary">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Pembungkus bagian dengan jarak vertikal seragam. */
export function Section({
  className,
  bleed = false,
  ...props
}: React.HTMLAttributes<HTMLElement> & { bleed?: boolean }) {
  return (
    <section
      className={cn("py-14 lg:py-20", bleed ? "" : "gcp-container", className)}
      {...props}
    />
  );
}
