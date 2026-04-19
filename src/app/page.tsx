import Link from "next/link";
import { ArrowRight, ShieldAlert, Swords, TrendingDown, Trophy } from "lucide-react";
import { AnnouncementList } from "@/components/site/announcement-list";
import { SectionShell } from "@/components/site/section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { disclaimerShort } from "@/lib/constants";
import { getHomeData } from "@/lib/data-service";
import { formatAverageGold, formatStageLabel } from "@/lib/format";

export const revalidate = 0;

export default async function Home() {
  const data = await getHomeData();
  const totalRecorded = data.rankings.reduce(
    (acc, cur) => acc + cur.stagesCovered,
    0,
  );

  return (
    <div className="space-y-12">
      {/* ---------- Hero ---------- */}
      <section className="animate-float-in relative overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-br from-[#0d1d3c] via-[#0a1430] to-[#07101e] p-8 shadow-[0_30px_80px_-30px_rgba(92,203,255,0.35)] sm:p-12">
        <div
          aria-hidden
          className="animate-aurora pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-55 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 25% 40%, rgba(92,203,255,0.55), transparent 55%), radial-gradient(circle at 70% 60%, rgba(168,144,255,0.45), transparent 55%), radial-gradient(circle at 50% 90%, rgba(141,255,234,0.30), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(rgba(148,214,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,214,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(circle at center, black 25%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 25%, transparent 78%)",
          }}
        />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="display-text tracking-[0.28em]">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(92,203,255,0.9)]" />
                PHASE ANALYTICS
              </Badge>
              <Badge className="border-violet-300/25 bg-violet-300/8 text-violet-100">
                0T · 低金
              </Badge>
            </div>

            <div className="space-y-5">
              <h1 className="display-text text-[2rem] font-semibold leading-[1.05] sm:text-[3.2rem]">
                <span className="block text-white/90">异相仲裁</span>
                <span className="gradient-text animate-aurora block">
                  王棋 · 0T 低金索引
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                面向《崩坏：星穹铁道》玩家的非官方数据索引站。按期统计不同主C的最低金数，
                同时支持按角色追踪跨版本的 0T 成本变化。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="#stages">
                  查看王棋列表
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#rankings">查看角色榜</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 sm:max-w-md">
              <StatPill label="收录期数" value={data.stages.length} />
              <StatPill label="上榜角色" value={data.rankings.length} />
              <StatPill label="通关记录" value={totalRecorded} />
            </div>
          </div>

          <aside className="relative rounded-[1.75rem] border border-white/8 bg-[#06101f]/70 p-6 backdrop-blur-xl">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10">
                  <Swords className="size-4 text-cyan-100" />
                </span>
                <div>
                  <p className="eyebrow">DATA RULES</p>
                  <p className="text-sm font-medium text-white/88">数据口径</p>
                </div>
              </div>

              <ul className="space-y-3 text-sm leading-7 text-white/72">
                <li className="flex gap-3">
                  <TrendingDown className="mt-1 size-4 shrink-0 text-cyan-300" />
                  每期图表只取每位主C的最低金数。
                </li>
                <li className="flex gap-3">
                  <Trophy className="mt-1 size-4 shrink-0 text-violet-300" />
                  角色榜按&ldquo;各期最低金数平均值&rdquo;升序排列。
                </li>
              </ul>

              <div className="rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 to-amber-500/4 p-4 text-sm leading-7 text-amber-50/92">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldAlert className="size-4" />
                  <span className="font-semibold">侵权免责声明</span>
                </div>
                <p className="leading-6 text-amber-50/80">{disclaimerShort}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Announcements ---------- */}
      <SectionShell
        eyebrow="Announcements"
        title="最新公告"
        description="管理员发布的站点更新、口径说明和维护通知。"
      >
        <AnnouncementList announcements={data.latestAnnouncements} compact />
      </SectionShell>

      {/* ---------- Stage Index ---------- */}
      <SectionShell
        eyebrow="Stage Index"
        title="王棋列表"
        description="按版本时间顺序排列，点击进入某一期查看不同主C的最低金数条形统计图。"
        action={<Badge>{data.stages.length} 期</Badge>}
      >
        <div id="stages" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.stages.map((stage) => (
            <Link
              key={stage.id}
              href={`/stages/${stage.versionLabel}`}
              className="group surface-subtle hover-lift relative flex flex-col gap-4 overflow-hidden rounded-[1.5rem] p-5"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-cyan-400/10 opacity-0 blur-2xl transition group-hover:opacity-100"
              />
              <div className="flex items-center justify-between">
                <span className="display-text rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-xs tracking-[0.22em] text-cyan-100">
                  Ver.{stage.versionLabel}
                </span>
                <ArrowRight className="size-4 text-white/40 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
              </div>
              <h3 className="text-xl font-semibold text-white">{stage.bossName}</h3>
              <CardDescription>
                {formatStageLabel(stage.versionLabel, stage.bossName)}
              </CardDescription>
              <div className="mt-auto border-t border-white/5 pt-3 text-sm text-cyan-100/80">
                查看该期统计 →
              </div>
            </Link>
          ))}
        </div>
      </SectionShell>

      {/* ---------- Character Rankings ---------- */}
      <SectionShell
        eyebrow="Character Rankings"
        title="角色列表"
        description="按角色在所有收录期数中的最低金平均值从低到高排序，点击查看跨期折线变化。"
        action={<Badge>{data.rankings.length} 位主C</Badge>}
      >
        <div id="rankings" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.rankings.map((item, index) => {
            const medal = rankStyle(index);
            return (
              <Link
                key={item.characterId}
                href={`/characters/${item.characterSlug}`}
                className="group surface-subtle hover-lift relative flex flex-col overflow-hidden rounded-[1.5rem] p-5"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition group-hover:opacity-100 ${medal.glow}`}
                />
                <div className="flex items-center justify-between">
                  <span
                    className={`display-text inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-[0.16em] ${medal.chip}`}
                  >
                    #{index + 1}
                  </span>
                  <ArrowRight className="size-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
                </div>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {item.characterName}
                </h3>
                <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
                  <Row label="平均最低金">
                    <span className="display-text text-lg text-cyan-50">
                      {formatAverageGold(item.averageMinGoldCost)}
                    </span>
                  </Row>
                  <Row label="收录期数">
                    <span className="font-mono text-sm text-white/75">
                      {item.stagesCovered}
                    </span>
                  </Row>
                </div>
              </Link>
            );
          })}
        </div>
      </SectionShell>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
      <p className="display-text text-xl font-semibold text-white sm:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-white/55">{label}</p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/55">{label}</span>
      {children}
    </div>
  );
}

function rankStyle(index: number) {
  if (index === 0)
    return {
      chip: "border-amber-300/45 bg-amber-300/15 text-amber-100",
      glow: "bg-amber-300/25",
    };
  if (index === 1)
    return {
      chip: "border-slate-200/40 bg-slate-200/10 text-slate-100",
      glow: "bg-slate-200/20",
    };
  if (index === 2)
    return {
      chip: "border-orange-300/40 bg-orange-300/12 text-orange-100",
      glow: "bg-orange-300/20",
    };
  return {
    chip: "border-cyan-300/25 bg-cyan-300/8 text-cyan-100",
    glow: "bg-cyan-300/15",
  };
}
