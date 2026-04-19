import { NextResponse } from "next/server";
import {
  deleteCharacter,
  insertCharacter,
  parseJsonBody,
  requireAdminSession,
  updateCharacter,
} from "@/lib/admin-service";
import { getAdminBootstrapData } from "@/lib/data-service";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    return NextResponse.json((await getAdminBootstrapData()).characters);
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "获取角色失败。" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const result = await insertCharacter(await parseJsonBody(request));
    return result.ok ? NextResponse.json(result.data) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "新增角色失败。" },
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
      return NextResponse.json({ error: "缺少角色 ID。" }, { status: 400 });
    }
    const result = await updateCharacter(id, await parseJsonBody(request));
    return result.ok ? NextResponse.json(result.data) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "编辑角色失败。" },
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
      return NextResponse.json({ error: "缺少角色 ID。" }, { status: 400 });
    }
    const result = await deleteCharacter(id);
    return result.ok ? NextResponse.json({ ok: true }) : result.response;
  } catch (cause) {
    return NextResponse.json(
      { error: cause instanceof Error ? cause.message : "删除角色失败。" },
      { status: 400 },
    );
  }
}
