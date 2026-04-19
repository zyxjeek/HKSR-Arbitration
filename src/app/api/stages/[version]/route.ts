import { NextResponse } from "next/server";
import { getStageDetail } from "@/lib/data-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ version: string }> },
) {
  try {
    const { version } = await context.params;
    const data = await getStageDetail(decodeURIComponent(version));

    if (!data) {
      return NextResponse.json({ error: "未找到对应期数。" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "获取期数统计失败。" },
      { status: 500 },
    );
  }
}
