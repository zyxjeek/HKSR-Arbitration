import { NextResponse } from "next/server";
import { hasPublicSupabaseEnv, hasServiceSupabaseEnv } from "@/lib/env";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import { getServiceSupabaseClient } from "@/lib/supabase-service";
import {
  announcementInputSchema,
  characterInputSchema,
  clearRecordInputSchema,
  idSchema,
  stageInputSchema,
} from "@/lib/validators";
import { slugify, versionLabelToSortKey } from "@/lib/utils";

export async function requireAdminSession() {
  if (!hasPublicSupabaseEnv()) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "未配置 Supabase 登录环境变量，当前后台不可用。" },
        { status: 503 },
      ),
    };
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Supabase 客户端初始化失败。" }, { status: 500 }),
    };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "请先登录管理员账号。" }, { status: 401 }),
    };
  }

  return { ok: true as const, session };
}

export function getAdminDbOrError() {
  if (!hasServiceSupabaseEnv()) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "未配置数据库服务端环境变量，无法执行管理操作。" },
        { status: 503 },
      ),
    };
  }

  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "数据库客户端初始化失败。" }, { status: 500 }),
    };
  }

  return { ok: true as const, supabase };
}

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error("请求体不是合法 JSON。");
  }
}

export async function insertCharacter(payload: unknown) {
  const parsed = characterInputSchema.parse(payload);
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase
    .from("characters")
    .insert({
      name: parsed.name,
      slug: slugify(parsed.name),
    })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const, data: result.data };
}

export async function updateCharacter(id: string, payload: unknown) {
  idSchema.parse({ id });
  const parsed = characterInputSchema.parse(payload);
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase
    .from("characters")
    .update({
      name: parsed.name,
      slug: slugify(parsed.name),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const, data: result.data };
}

export async function deleteCharacter(id: string) {
  idSchema.parse({ id });
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const dependencyResult = await db.supabase
    .from("clear_records")
    .select("id", { count: "exact", head: true })
    .eq("character_id", id);

  if (dependencyResult.error) {
    throw dependencyResult.error;
  }

  if ((dependencyResult.count ?? 0) > 0) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "该角色仍被通关记录引用，不能直接删除。" },
        { status: 409 },
      ),
    };
  }

  const result = await db.supabase.from("characters").delete().eq("id", id);

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const };
}

export async function insertStage(payload: unknown) {
  const parsed = stageInputSchema.parse(payload);
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase
    .from("arbiter_stages")
    .insert({
      version_label: parsed.versionLabel,
      version_sort_key: versionLabelToSortKey(parsed.versionLabel),
      boss_name: parsed.bossName,
    })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const, data: result.data };
}

export async function updateStage(id: string, payload: unknown) {
  idSchema.parse({ id });
  const parsed = stageInputSchema.parse(payload);
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase
    .from("arbiter_stages")
    .update({
      version_label: parsed.versionLabel,
      version_sort_key: versionLabelToSortKey(parsed.versionLabel),
      boss_name: parsed.bossName,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const, data: result.data };
}

export async function deleteStage(id: string) {
  idSchema.parse({ id });
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const dependencyResult = await db.supabase
    .from("clear_records")
    .select("id", { count: "exact", head: true })
    .eq("stage_id", id);

  if (dependencyResult.error) {
    throw dependencyResult.error;
  }

  if ((dependencyResult.count ?? 0) > 0) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "该期王棋仍被通关记录引用，不能直接删除。" },
        { status: 409 },
      ),
    };
  }

  const result = await db.supabase.from("arbiter_stages").delete().eq("id", id);

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const };
}

export async function insertRecord(payload: unknown) {
  const parsed = clearRecordInputSchema.parse(payload);
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase
    .from("clear_records")
    .insert({
      character_id: parsed.characterId,
      stage_id: parsed.stageId,
      gold_cost: parsed.goldCost,
      video_url: parsed.videoUrl,
    })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const, data: result.data };
}

export async function updateRecord(id: string, payload: unknown) {
  idSchema.parse({ id });
  const parsed = clearRecordInputSchema.parse(payload);
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase
    .from("clear_records")
    .update({
      character_id: parsed.characterId,
      stage_id: parsed.stageId,
      gold_cost: parsed.goldCost,
      video_url: parsed.videoUrl,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const, data: result.data };
}

export async function deleteRecord(id: string) {
  idSchema.parse({ id });
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase.from("clear_records").delete().eq("id", id);

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const };
}

export async function insertAnnouncement(payload: unknown) {
  const parsed = announcementInputSchema.parse(payload);
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase
    .from("announcements")
    .insert({
      title: parsed.title,
      body_text: parsed.bodyText,
      published_at: new Date(parsed.publishedAt).toISOString(),
    })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const, data: result.data };
}

export async function updateAnnouncement(id: string, payload: unknown) {
  idSchema.parse({ id });
  const parsed = announcementInputSchema.parse(payload);
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase
    .from("announcements")
    .update({
      title: parsed.title,
      body_text: parsed.bodyText,
      published_at: new Date(parsed.publishedAt).toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const, data: result.data };
}

export async function deleteAnnouncement(id: string) {
  idSchema.parse({ id });
  const db = getAdminDbOrError();

  if (!db.ok) {
    return db;
  }

  const result = await db.supabase.from("announcements").delete().eq("id", id);

  if (result.error) {
    throw result.error;
  }

  return { ok: true as const };
}
