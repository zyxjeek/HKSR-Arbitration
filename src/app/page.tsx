import Link from "next/link";
import { ArrowRight, ShieldAlert, Swords } from "lucide-react";
import { AnnouncementList } from "@/components/site/announcement-list";
import { SectionShell } from "@/components/site/section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { disclaimerShort } from "@/lib/constants";
import { getHomeData } from "@/lib/data-service";
import { formatAverageGold, formatStageLabel } from "@/lib/format";

export default async function Home() {
  const data = await getHomeData();

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden p-0">
        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-8">
          <div className="space-y-6">
            <Badge className="display-text">Phase Analytics</Badge>
            <div className="space-y-4">
              <h1 className="display-text text-3xl leading-tight text-white sm:text-5xl">
                异相仲裁王棋（普通）
                <br />
                0T 低金成绩统计
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                面向《崩坏：星穹铁道》玩家的非官方数据索引站。这里按期统计不同主C的最低金数，
                也支持按角色追踪跨版本的 0T 成本变化。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="#stages">
                  查看王棋列表
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">项目说明与声明</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-cyan-300/12 bg-[#04111f] p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Swords className="size-5 text-cyan-200" />
                <p className="display-text text-sm text-cyan-100">数据口径</p>
              </div>
              <ul className="space-y-3 text-sm leading-7 text-white/70">
                <li>每期图表只取每位主C的最低金数。</li>
                <li>角色榜按“各期最低金数平均值”升序排列。</li>
                <li>同最低金多条记录会在详情弹窗中全部展示。</li>
              </ul>
              <div className="rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4 text-sm text-amber-50/88">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldAlert className="size-4" />
                  <span className="font-semibold">侵权免责声明</span>
                </div>
                <p className="leading-7">{disclaimerShort}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <SectionShell
        eyebrow="Announcements"
        title="最新公告"
        description="管理员发布的站点更新、口径说明和维护通知。"
      >
        <AnnouncementList announcements={data.latestAnnouncements} compact />
      </SectionShell>

      <SectionShell
        eyebrow="Stage Index"
        title="王棋列表"
        description="按版本时间顺序排列，点击进入某一期查看不同主C的最低金数条形统计图。"
      >
        <div id="stages" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.stages.map((stage) => (
            <Link
              key={stage.id}
              href={`/stages/${stage.versionLabel}`}
              className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/24 hover:bg-white/8"
            >
              <p className="display-text text-sm text-cyan-100">Ver.{stage.versionLabel}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{stage.bossName}</h3>
              <CardDescription className="mt-3">{formatStageLabel(stage.versionLabel, stage.bossName)}</CardDescription>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-100">
                查看该期统计
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Character Rankings"
        title="角色列表"
        description="按角色在所有收录期数中的最低金平均值从低到高排序，点击查看跨期折线变化。"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.rankings.map((item, index) => (
            <Link
              key={item.characterId}
              href={`/characters/${item.characterSlug}`}
              className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/24 hover:bg-white/8"
            >
              <p className="font-mono text-sm text-cyan-200/78">#{index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.characterName}</h3>
              <div className="mt-4 flex items-center justify-between text-sm text-white/68">
                <span>平均最低金</span>
                <span className="display-text text-base text-cyan-50">
                  {formatAverageGold(item.averageMinGoldCost)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-white/48">
                <span>收录期数</span>
                <span>{item.stagesCovered}</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
