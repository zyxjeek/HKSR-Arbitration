import Link from "next/link";
import { disclaimerShort } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#030812]/92">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-white/56 sm:px-6 lg:px-8">
        <p>{disclaimerShort}</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/announcements" className="hover:text-cyan-100">
            公告合集
          </Link>
        </div>
      </div>
    </footer>
  );
}
