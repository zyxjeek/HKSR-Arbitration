import { NextResponse } from "next/server";
import {
  approvePendingRecord,
  rejectPendingRecord,
  requireAdminSession,
} from "@/lib/admin-service";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "缺少投稿 ID。" }, { status: 400 });
    }
    const result = await approvePendingRecord(id);
    return result.ok ? NextResponse.json(result.data) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "审批失败。" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "缺少投稿 ID。" }, { status: 400 });
    }
    const result = await rejectPendingRecord(id);
    return result.ok ? NextResponse.json({ ok: true }) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "拒绝失败。" },
      { status: 400 },
    );
  }
}
