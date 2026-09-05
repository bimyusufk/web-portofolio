import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Tabel padat bergaya Cloud Console.
 *
 * Header 12px huruf kecil berbobot 500, baris 48px, garis pemisah tipis,
 * hover baris memakai permukaan tenggelam. Dibungkus wadah yang bisa digulir
 * horizontal agar halaman tidak pernah menggulir ke samping di layar sempit.
 */
export function TableWrapper({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("scrollbar-thin overflow-x-auto rounded-lg border border-line", className)}>
      {children}
    </div>
  );
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full min-w-[46rem] border-collapse text-left", className)} {...props} />;
}

export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line bg-surface-subtle px-4 py-3 text-caption font-medium uppercase tracking-[0.05em] text-ink-secondary",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("border-b border-line-subtle px-4 py-3 text-ui text-ink-secondary", className)} {...props} />;
}

export function Tr({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("transition-colors duration-fast last:[&>td]:border-b-0 hover:bg-surface-subtle", className)}
      {...props}
    />
  );
}
