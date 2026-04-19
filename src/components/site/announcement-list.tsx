import Link from "next/link";
import { CardDescription } from "@/components/ui/card";
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

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          className="rounded-2xl border border-white/10 bg-white/4 p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
            <span className="font-mono text-xs text-cyan-200/75">
              {formatPublishedAt(announcement.publishedAt)}
            </span>
          </div>
          <CardDescription className={compact ? "line-clamp-2 whitespace-pre-wrap" : "prose-notice mt-4"}>
            {announcement.bodyText}
          </CardDescription>
        </article>
      ))}
      {compact ? (
        <Link href="/announcements" className="inline-flex text-sm text-cyan-100 hover:text-cyan-50">
          查看全部公告
        </Link>
      ) : null}
    </div>
  );
}
