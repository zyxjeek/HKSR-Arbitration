import type { ReactNode } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface SectionShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function SectionShell({
  eyebrow,
  title,
  description,
  action,
  children,
}: SectionShellProps) {
  return (
    <Card className="animate-float-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          {eyebrow ? (
            <div className="flex items-center gap-2">
              <span className="inline-block h-px w-8 bg-gradient-to-r from-cyan-300/80 to-transparent" />
              <p className="eyebrow">{eyebrow}</p>
            </div>
          ) : null}
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription className="max-w-3xl">{description}</CardDescription> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </Card>
  );
}
