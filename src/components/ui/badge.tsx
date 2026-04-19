import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-300/18 bg-cyan-300/8 px-3 py-1 text-xs text-cyan-100",
        className,
      )}
      {...props}
    />
  );
}
