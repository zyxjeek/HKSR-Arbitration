import Link from "next/link";
import { Pin } from "lucide-react";
import { MarkdownContent } from "@/components/site/markdown-content";
import { formatPublishedAt } from "@/lib/format";
import type { Announcement } from "@/lib/types";

interface AnnouncementListProps {
  announcements: Announcement[];
  compact?: boolean;
}

export function AnnouncementList({
  announcements,
  compact = false,
}: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/12 p-6 text-sm text-white/55">
        暂无公告。
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <ul className="space-y-2">
          {announcements.map((announcement) => (
            <li key={announcement.id}>
              <Link
                href={`/announcements#${announcement.id}`}
                className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/85 transition hover:border-cyan-300/40 hover:bg-white/8 hover:text-white"
              >
                {announcement.isPinned ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-300/15 px-2 py-0.5 text-[11px] font-medium text-amber-100">
                    <Pin className="size-3" />置顶
                  </span>
                ) : null}
                <span className="flex-1 truncate font-medium">{announcement.title}</span>
                <span className="shrink-0 font-mono text-xs text-cyan-200/70">
                  {formatPublishedAt(announcement.publishedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/announcements" className="inline-flex text-sm text-cyan-100 hover:text-cyan-50">
          查看全部公告
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          id={announcement.id}
          className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/4 p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              {announcement.isPinned ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-300/15 px-2 py-0.5 text-xs font-medium text-amber-100">
                  <Pin className="size-3" />置顶
                </span>
              ) : null}
              {announcement.title}
            </h3>
            <span className="font-mono text-xs text-cyan-200/75">
              {formatPublishedAt(announcement.publishedAt)}
            </span>
          </div>
          <MarkdownContent className="mt-4">
            {announcement.bodyText}
          </MarkdownContent>
        </article>
      ))}
    </div>
  );
}
