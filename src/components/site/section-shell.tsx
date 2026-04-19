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
            <p className="display-text text-xs uppercase tracking-[0.34em] text-cyan-200/70">
              {eyebrow}
            </p>
          ) : null}
          <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
