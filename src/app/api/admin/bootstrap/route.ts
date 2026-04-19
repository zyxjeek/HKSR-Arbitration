import { NextResponse } from "next/server";
import { getAdminBootstrapData } from "@/lib/data-service";
import { requireAdminSession } from "@/lib/admin-service";

export async function GET() {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    return NextResponse.json(await getAdminBootstrapData());
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "获取后台数据失败。" },
      { status: 500 },
    );
  }
}
