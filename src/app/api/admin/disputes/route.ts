import { NextResponse } from "next/server";
import { requireAdminSession, resolveDispute } from "@/lib/admin-service";

export async function DELETE(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "缺少指正 ID。" }, { status: 400 });
    }
    const result = await resolveDispute(id);
    return result.ok ? NextResponse.json({ ok: true }) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "处理失败。" },
      { status: 400 },
    );
  }
}
