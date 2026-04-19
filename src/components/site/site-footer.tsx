import Link from "next/link";
import { disclaimerShort } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-white/8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-white/56 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="max-w-2xl leading-6">{disclaimerShort}</p>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/announcements" className="transition hover:text-cyan-100">
            公告合集
          </Link>
          <Link href="/submit" className="transition hover:text-cyan-100">
            游客投稿
          </Link>
          <span className="font-mono text-[11px] text-white/36">HKSR · Fan Site</span>
        </div>
      </div>
    </footer>
  );
}
