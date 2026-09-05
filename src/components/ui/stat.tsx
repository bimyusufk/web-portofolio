import { cn } from "@/lib/utils";

/**
 * Ubin metrik.
 *
 * Angka dipasang dengan `tabular-nums` supaya deretan statistik tetap sejajar,
 * dan berbobot 400 seperti angka besar di dasbor Cloud - bukan display bold.
 */
export function Stat({
  value,
  label,
  hint,
  className,
}: {
  value: string;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-t-2 border-brand bg-surface-subtle px-5 py-6", className)}>
      <p className="text-[2rem] leading-none tabular-nums tracking-[-0.02em] text-ink">{value}</p>
      <p className="mt-3 text-ui text-ink-secondary">{label}</p>
      {hint && <p className="mt-1 text-caption text-ink-tertiary">{hint}</p>}
    </div>
  );
}
