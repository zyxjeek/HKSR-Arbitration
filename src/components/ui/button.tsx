import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          "btn-shine border-cyan-300/30 bg-gradient-to-b from-cyan-400/20 to-cyan-500/10 text-cyan-50 shadow-[0_8px_28px_-12px_rgba(92,203,255,0.55)] hover:from-cyan-400/28 hover:to-cyan-500/16 hover:border-cyan-300/55",
        secondary:
          "border-white/10 bg-white/5 text-white/88 hover:bg-white/10 hover:border-white/18",
        outline:
          "border-cyan-300/25 bg-transparent text-cyan-100 hover:bg-cyan-300/10 hover:border-cyan-300/50",
        ghost:
          "border-transparent bg-transparent text-white/80 hover:bg-white/6 hover:text-white",
        danger:
          "border-rose-400/30 bg-rose-400/10 text-rose-100 hover:bg-rose-400/18 hover:border-rose-400/55",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-10 px-5",
        lg: "h-12 px-6 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
