import { notFound } from "next/navigation";
import { CharacterLineChart } from "@/components/charts/character-line-chart";
import { SectionShell } from "@/components/site/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCharacterDetail } from "@/lib/data-service";

export const revalidate = 0;

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCharacterDetail(decodeURIComponent(slug));

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <SectionShell
        eyebrow="Character View"
        title={`${data.character.name} · 跨期最低金趋势`}
        description={"折线图按王棋版本时间顺序排列，所有王棋期数都会显示。点击节点可直接跳转对应视频；未收录的期数标记为\"未收录\"。"}
        action={
          <Badge>
            {data.timeline.filter((p) => p.minGoldCost !== null).length} /{" "}
            {data.timeline.length} 期已收录
          </Badge>
        }
      >
        <CharacterLineChart timeline={data.timeline} />
      </SectionShell>
      <Card className="bg-white/4">
        <p className="text-sm leading-7 text-white/72">
          统计说明：折线图的每个点只记录该角色在对应一期中的最低金数，因此更适合观察版本环境下的组队成本变化。
        </p>
      </Card>
    </div>
  );
}
