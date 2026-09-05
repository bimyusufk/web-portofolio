import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Ubin ikon kecil di depan judul kartu.
 * Latar biru muda, sudut 8px - pola yang dipakai kartu produk cloud.google.com.
 */
export function IconTile({
  icon: Icon,
  className,
  size = "md",
}: {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className,
      )}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </span>
  );
}
