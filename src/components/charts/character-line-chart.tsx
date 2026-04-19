"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import type { CharacterTimelinePoint } from "@/lib/types";
import { EChartsReact } from "@/components/charts/echarts-react";
import { EmptyState } from "@/components/site/empty-state";
import { StatDetailDialog } from "@/components/charts/stat-detail-dialog";

export function CharacterLineChart({ timeline }: { timeline: CharacterTimelinePoint[] }) {
  const [selected, setSelected] = useState<CharacterTimelinePoint | null>(null);

  const option = useMemo<EChartsOption>(() => {
    return {
      tooltip: { trigger: "axis" },
      grid: { left: 24, right: 20, top: 20, bottom: 24, containLabel: true },
      xAxis: {
        type: "category",
        axisLabel: { color: "#eaf6ff" },
        data: timeline.map((item) => `Ver.${item.versionLabel}`),
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#b8d3ea" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },
      series: [
        {
          type: "line",
          smooth: true,
          symbolSize: 10,
          lineStyle: { color: "#8dffea", width: 3 },
          itemStyle: { color: "#47d1ff" },
          areaStyle: {
            color: "rgba(71, 209, 255, 0.18)",
          },
          data: timeline.map((item) => item.minGoldCost),
        },
      ],
    };
  }, [timeline]);

  if (timeline.length === 0) {
    return <EmptyState message="这个角色暂时还没有收录到任何王棋 0T 记录。" />;
  }

  return (
    <>
      <div className="chart-shell rounded-3xl border border-white/10 bg-[#04111f] p-4">
        <EChartsReact
          option={option}
          style={{ height: 420, width: "100%" }}
          onEvents={{
            click: (params: { dataIndex: number }) => setSelected(timeline[params.dataIndex] ?? null),
          }}
        />
      </div>
      <StatDetailDialog item={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}
