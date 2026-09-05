import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Tombol Material / Google Cloud.
 *
 * Ukuran mengikuti spesifikasi Google: tinggi 36px, teks 14px berbobot 500,
 * jarak huruf 0.25px, sudut 4px. Elevasi hanya muncul saat hover pada tombol
 * terisi — bukan bayangan permanen.
 */
const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded font-medium tracking-[0.0107em] " +
  "transition-colors duration-fast ease-standard " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:pointer-events-none disabled:opacity-40";

const variants = {
  /** Aksi utama pada satu layar. Gunakan maksimal satu per bagian. */
  filled:
    "bg-brand text-white hover:bg-brand-hover active:bg-brand-active hover:shadow-elevation-1 " +
    "dark:text-surface dark:hover:bg-brand-hover",
  /** Aksi sekunder dengan bobot visual sedang. */
  tonal: "bg-brand-tint text-brand-on hover:bg-brand-tint-strong",
  /** Aksi sekunder di atas permukaan putih. */
  outlined: "border border-line text-brand hover:bg-brand-tint hover:border-brand",
  /** Aksi tersier; padding lebih rapat karena tidak punya latar. */
  text: "text-brand hover:bg-brand-tint",
  /** Ikon saja - dipakai di app bar. */
  icon: "text-ink-secondary hover:bg-surface-sunken hover:text-ink rounded-full",
} as const;

const sizes = {
  sm: "h-8 px-4 text-ui",
  md: "h-9 px-6 text-ui",
  lg: "h-11 px-7 text-body",
} as const;

const iconSizes = {
  sm: "h-8 w-8 p-0",
  md: "h-10 w-10 p-0",
  lg: "h-12 w-12 p-0",
} as const;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "filled", size = "md", asChild, type, ...props },
  ref,
) {
  const Component = asChild ? Slot : "button";
  const sizing = variant === "icon" ? iconSizes[size] : sizes[size];
  const padding = variant === "text" && size !== "lg" ? "px-3" : "";

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(base, variants[variant], sizing, padding, className)}
      {...props}
    />
  );
});
