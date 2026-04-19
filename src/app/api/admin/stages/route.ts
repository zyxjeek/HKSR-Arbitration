import { NextResponse } from "next/server";
import {
  deleteStage,
  insertStage,
  parseJsonBody,
  requireAdminSession,
  updateStage,
} from "@/lib/admin-service";
import { getAdminBootstrapData } from "@/lib/data-service";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    return NextResponse.json((await getAdminBootstrapData()).stages);
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "获取王棋期数失败。" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const result = await insertStage(await parseJsonBody(request));
    return result.ok ? NextResponse.json(result.data) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "新增王棋期数失败。" },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "缺少期数 ID。" }, { status: 400 });
    }
    const result = await updateStage(id, await parseJsonBody(request));
    return result.ok ? NextResponse.json(result.data) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "编辑王棋期数失败。" },
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
      return NextResponse.json({ error: "缺少期数 ID。" }, { status: 400 });
    }
    const result = await deleteStage(id);
    return result.ok ? NextResponse.json({ ok: true }) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "删除王棋期数失败。" },
      { status: 400 },
    );
  }
}
