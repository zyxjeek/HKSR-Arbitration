"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import type { StageMinStat } from "@/lib/types";
import { EChartsReact } from "@/components/charts/echarts-react";
import { StatDetailDialog } from "@/components/charts/stat-detail-dialog";
import { EmptyState } from "@/components/site/empty-state";

export function StageBarChart({ stats }: { stats: StageMinStat[] }) {
  const [selected, setSelected] = useState<StageMinStat | null>(null);

  const option = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: { left: 20, right: 20, top: 20, bottom: 20, containLabel: true },
      xAxis: {
        type: "value",
        axisLabel: { color: "#b8d3ea" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },
      yAxis: {
        type: "category",
        inverse: true,
        axisLabel: { color: "#eaf6ff" },
        data: stats.map((item) => item.characterName),
      },
      series: [
        {
          type: "bar",
          barWidth: 18,
          data: stats.map((item) => ({
            value: item.minGoldCost,
            itemStyle: {
              borderRadius: [0, 999, 999, 0],
              color: "#47d1ff",
            },
            name: item.characterName,
          })),
        },
      ],
    };
  }, [stats]);

  if (stats.length === 0) {
    return <EmptyState message="这一期王棋还没有收录到 0T 记录。" />;
  }

  return (
    <>
      <div className="chart-shell rounded-3xl border border-white/10 bg-[#04111f] p-4">
        <EChartsReact
          option={option}
          style={{ height: 420, width: "100%" }}
          onEvents={{
            click: (params: { dataIndex: number }) => setSelected(stats[params.dataIndex] ?? null),
          }}
        />
      </div>
      <StatDetailDialog item={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}
