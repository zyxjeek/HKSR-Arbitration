import { AnnouncementList } from "@/components/site/announcement-list";
import { SectionShell } from "@/components/site/section-shell";
import { getAnnouncementsData } from "@/lib/data-service";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncementsData();

  return (
    <SectionShell
      eyebrow="Archive"
      title="公告合集"
      description="按发布时间倒序展示管理员发布的全部公告。"
    >
      <AnnouncementList announcements={announcements} />
    </SectionShell>
  );
}
