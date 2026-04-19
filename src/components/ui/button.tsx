import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
  {
    variants: {
      variant: {
        default:
          "border-cyan-300/30 bg-cyan-300/10 text-cyan-50 hover:bg-cyan-300/18",
        secondary:
          "border-white/10 bg-white/5 text-white/88 hover:bg-white/10",
        outline:
          "border-cyan-300/18 bg-transparent text-cyan-100 hover:bg-cyan-300/10",
        ghost: "border-transparent bg-transparent text-cyan-100 hover:bg-white/8",
        danger:
          "border-rose-400/25 bg-rose-400/10 text-rose-100 hover:bg-rose-400/18",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5",
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
