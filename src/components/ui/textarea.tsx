import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20",
        className,
      )}
      {...props}
    />
  );
}
