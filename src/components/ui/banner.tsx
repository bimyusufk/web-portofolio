import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const tones = {
  info: {
    icon: Info,
    wrapper: "border-brand/30 bg-brand-tint",
    iconColor: "text-brand",
  },
  warning: {
    icon: AlertTriangle,
    wrapper: "border-status-yellow/40 bg-status-yellow/10",
    iconColor: "text-status-yellow",
  },
  success: {
    icon: CheckCircle2,
    wrapper: "border-status-green/30 bg-status-green/10",
    iconColor: "text-status-green",
  },
  error: {
    icon: XCircle,
    wrapper: "border-status-red/30 bg-status-red/10",
    iconColor: "text-status-red",
  },
} as const;

/** Banner informasi bergaya Cloud Console: ikon kiri, garis tipis, tanpa bayangan. */
export function Banner({
  tone = "info",
  title,
  children,
  action,
  className,
}: {
  tone?: keyof typeof tones;
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, wrapper, iconColor } = tones[tone];

  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", wrapper, className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColor)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-ui font-medium text-ink">{title}</p>}
        {children && <div className={cn("text-ui text-ink-secondary", title && "mt-1")}>{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}

/** Kondisi kosong untuk daftar yang belum berisi dokumen. */
export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface-subtle px-6 py-16 text-center">
      {Icon && <Icon className="mb-4 h-8 w-8 text-ink-tertiary" />}
      <p className="text-subtitle text-ink">{title}</p>
      {description && <p className="mt-2 max-w-sm text-ui text-ink-secondary">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
