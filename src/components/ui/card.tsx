import { cn } from "@/lib/utils";
import * as React from "react";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/50 p-6 shadow-card ring-1 ring-rose-50 dark:ring-slate-700/50 backdrop-blur",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40" aria-hidden>
        <div className="absolute -inset-10 bg-gradient-to-br from-rose-50 via-white to-amber-100 dark:from-slate-700/10 dark:via-slate-800/5 dark:to-slate-700/10" />
      </div>
      <div className="relative space-y-3">{children}</div>
    </div>
  ),
);

Card.displayName = "Card";
