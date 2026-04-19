import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/constants";
import { hasServiceSupabaseEnv } from "@/lib/env";

export function SiteHeader() {
  const isLive = hasServiceSupabaseEnv();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050914]/80 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative inline-flex size-9 items-center justify-center rounded-xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/25 via-sky-400/10 to-violet-400/25 shadow-[0_0_30px_-10px_rgba(92,203,255,0.6)]">
            <Sparkles className="size-4 text-cyan-100" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="display-text text-[15px] font-semibold tracking-[0.22em] text-white">
              HKSR · 0T
            </span>
            <span className="text-[11px] text-white/50">
              异相仲裁王棋 · 低金索引
            </span>
          </span>
        </Link>

        <nav className="order-3 flex w-full flex-wrap items-center gap-1 sm:order-none sm:w-auto">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-full px-3 py-1.5 text-sm text-white/70 transition hover:text-white"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="pointer-events-none absolute inset-0 rounded-full bg-white/0 transition group-hover:bg-white/8" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Badge
            className={
              isLive
                ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                : "border-amber-300/30 bg-amber-300/10 text-amber-100"
            }
          >
            <span
              className={`mr-1.5 inline-block size-1.5 rounded-full ${
                isLive ? "bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" : "bg-amber-300"
              }`}
            />
            <span className="font-mono text-[11px]">
              {isLive ? "LIVE" : "DEMO"}
            </span>
          </Badge>
        </div>
      </div>
    </header>
  );
}
