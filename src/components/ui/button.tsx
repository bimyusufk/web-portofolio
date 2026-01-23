import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700",
  secondary:
    "bg-white/60 text-slate-900 ring-1 ring-rose-100 backdrop-blur hover:bg-white",
  ghost:
    "bg-transparent text-slate-900 hover:bg-rose-50",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild, children, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component ref={ref} className={cn(baseClasses, variants[variant], className)} {...props}>
        {children}
      </Component>
    );
  },
);

Button.displayName = "Button";
