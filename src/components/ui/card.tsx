import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Kartu Google Cloud: latar permukaan, garis 1px, sudut 8px, tanpa bayangan saat diam.
 * Bayangan hanya muncul pada kartu yang bisa diklik ketika di-hover -
 * itulah sinyal "bisa ditekan" di Material, bukan dekorasi.
 */
export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-surface",
        interactive &&
          "transition-shadow duration-fast ease-standard hover:shadow-elevation-2 focus-within:shadow-elevation-2",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-subtitle text-ink", className)} {...props} />;
}

export function CardText({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-ui text-ink-secondary", className)} {...props} />;
}

/** Garis pemisah internal kartu, memakai warna pembatas yang lebih halus. */
export function CardDivider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-line-subtle", className)} role="presentation" />;
}
