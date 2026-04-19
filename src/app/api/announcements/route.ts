import { NextResponse } from "next/server";
import { getAnnouncementsData } from "@/lib/data-service";

export async function GET() {
  try {
    return NextResponse.json(await getAnnouncementsData());
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "获取公告失败。" },
      { status: 500 },
    );
  }
}
