import { NextResponse } from "next/server";
import { getHomeData } from "@/lib/data-service";

export async function GET() {
  try {
    return NextResponse.json(await getHomeData());
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "获取首页数据失败。" },
      { status: 500 },
    );
  }
}
