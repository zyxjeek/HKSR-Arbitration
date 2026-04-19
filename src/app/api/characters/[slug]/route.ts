import { NextResponse } from "next/server";
import { getCharacterDetail } from "@/lib/data-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const data = await getCharacterDetail(decodeURIComponent(slug));

    if (!data) {
      return NextResponse.json({ error: "未找到对应角色。" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "获取角色统计失败。" },
      { status: 500 },
    );
  }
}
