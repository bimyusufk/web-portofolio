import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb Cloud Console: 14px, pemisah chevron, ruas terakhir tidak bisa diklik
 * dan ditandai aria-current agar pembaca layar tahu posisi halaman.
 */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-ui text-ink-secondary">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="truncate rounded-sm text-brand hover:underline hover:underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="truncate text-ink" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
