"use client";

import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { CharacterTimelinePoint } from "@/lib/types";
import { EChartsReact } from "@/components/charts/echarts-react";
import { EmptyState } from "@/components/site/empty-state";

export function CharacterLineChart({ timeline }: { timeline: CharacterTimelinePoint[] }) {
  const option = useMemo<EChartsOption>(() => {
    // 未收录期数在视觉上放在 Y 轴最高点
    const recordedValues = timeline
      .map((t) => t.minGoldCost)
      .filter((v): v is number => v !== null);
    const maxValue = recordedValues.length > 0 ? Math.max(...recordedValues) : 0;
    // 多留 20% 的顶部空间，让"未收录"点比最高纪录更显眼
    const placeholder = Math.max(maxValue + Math.max(2, Math.ceil(maxValue * 0.2)), 5);

    const hasRecorded = timeline.some((t) => t.minGoldCost !== null);
    const hasMissing = timeline.some((t) => t.minGoldCost === null);

    const recordedData = timeline.map((item) =>
      item.minGoldCost === null ? null : item.minGoldCost,
    );

    // 单独一条 series 来画"未收录"标记，方便独立样式
    const missingData = timeline.map((item) =>
      item.minGoldCost === null ? placeholder : null,
    );

    return {
      tooltip: {
        trigger: "axis",
        formatter: (params: unknown) => {
          const arr = Array.isArray(params) ? params : [params];
          const first = arr[0] as { dataIndex: number };
          const item = timeline[first.dataIndex];
          if (!item) return "";
          const label = `Ver.${item.versionLabel} · ${item.bossName}`;
          if (item.minGoldCost === null) {
            return `${label}<br/><span style="color:#ff9bb0;">未收录</span>`;
          }
          return `${label}<br/>最低金数：<strong>${item.minGoldCost}</strong>`;
        },
      },
      legend: {
        data: ["最低金数", "未收录"].filter((name) =>
          name === "最低金数" ? hasRecorded : hasMissing,
        ),
        textStyle: { color: "#b8d3ea" },
        top: 8,
        itemGap: 18,
      },
      grid: { left: 24, right: 20, top: 72, bottom: 24, containLabel: true },
      xAxis: {
        type: "category",
        axisLabel: { color: "#eaf6ff" },
        data: timeline.map((item) => `Ver.${item.versionLabel}`),
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#b8d3ea" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
        max: hasMissing ? placeholder : undefined,
      },
      series: [
        {
          name: "最低金数",
          type: "line",
          smooth: true,
          symbolSize: 10,
          connectNulls: false,
          lineStyle: { color: "#8dffea", width: 3 },
          itemStyle: { color: "#47d1ff" },
          areaStyle: {
            color: "rgba(71, 209, 255, 0.18)",
          },
          data: recordedData,
        },
        {
          name: "未收录",
          type: "scatter",
          symbol: "triangle",
          symbolSize: 14,
          itemStyle: { color: "#ff7a9e" },
          label: {
            show: true,
            position: "bottom",
            distance: 6,
            color: "#ffc7d2",
            fontSize: 11,
            formatter: "未收录",
          },
          data: missingData,
        },
      ],
    };
  }, [timeline]);

  if (timeline.length === 0) {
    return <EmptyState message="暂无任何王棋期数。" />;
  }

  return (
    <div className="chart-shell rounded-3xl border border-white/8 p-4 sm:p-5">
      <EChartsReact
        option={option}
        style={{ height: 420, width: "100%" }}
        onEvents={{
          click: (params: { dataIndex: number }) => {
            const item = timeline[params.dataIndex];
            if (item?.videoUrl) window.open(item.videoUrl, "_blank", "noreferrer");
          },
        }}
      />
    </div>
  );
}
