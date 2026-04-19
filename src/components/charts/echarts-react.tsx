"use client";

import dynamic from "next/dynamic";

export const EChartsReact = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});
