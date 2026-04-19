import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { hasServiceSupabaseEnv } from "@/lib/env";

export function SiteHeader() {
  const isLive = hasServiceSupabaseEnv();

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#05101c]/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <Link href="/" className="display-text text-lg font-semibold text-white">
            {siteConfig.name}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="font-mono">{isLive ? "Live Data" : "Demo Data"}</Badge>
            <span className="text-xs text-white/55">
              异相仲裁王棋（普通）0T 低金通关索引
            </span>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {siteConfig.nav.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
