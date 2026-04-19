import { NextResponse } from "next/server";
import {
  deleteRecord,
  insertRecord,
  parseJsonBody,
  requireAdminSession,
  updateRecord,
} from "@/lib/admin-service";
import { getAdminBootstrapData } from "@/lib/data-service";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    return NextResponse.json((await getAdminBootstrapData()).records);
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "获取记录失败。" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const result = await insertRecord(await parseJsonBody(request));
    return result.ok ? NextResponse.json(result.data) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "新增记录失败。" },
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
      return NextResponse.json({ error: "缺少记录 ID。" }, { status: 400 });
    }
    const result = await updateRecord(id, await parseJsonBody(request));
    return result.ok ? NextResponse.json(result.data) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "编辑记录失败。" },
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
      return NextResponse.json({ error: "缺少记录 ID。" }, { status: 400 });
    }
    const result = await deleteRecord(id);
    return result.ok ? NextResponse.json({ ok: true }) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "删除记录失败。" },
      { status: 400 },
    );
  }
}
