import { notFound } from "next/navigation";
import { StageBarChart } from "@/components/charts/stage-bar-chart";
import { SectionShell } from "@/components/site/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getStageDetail } from "@/lib/data-service";

export const revalidate = 0;

export default async function StageDetailPage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const data = await getStageDetail(decodeURIComponent(version));

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <SectionShell
        eyebrow="Stage View"
        title={`Ver.${data.stage.versionLabel} · ${data.stage.bossName}`}
        description="以下为该期王棋中，不同主C达成 0T 通关时的最低金数统计。点击柱条可直接跳转对应视频。"
        action={<Badge>{data.stats.length} 位主C已收录</Badge>}
      >
        <StageBarChart stats={data.stats} />
      </SectionShell>
      <Card className="bg-white/4">
        <p className="text-sm leading-7 text-white/72">
          统计说明：同一主C在本期内只保留最低金数的一条记录。点击柱条会在新标签页直接打开对应视频。
        </p>
      </Card>
    </div>
  );
}
