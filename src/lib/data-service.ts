import {
  type AdminBootstrapData,
  type Announcement,
  type ArbiterStage,
  type Character,
  type CharacterDetailData,
  type HomeData,
  type JoinedRecord,
  type StageDetailData,
} from "@/lib/types";
import { hasServiceSupabaseEnv } from "@/lib/env";
import { getMockAdminBootstrap, mockDb } from "@/lib/mock-data";
import { buildCharacterRankings, buildCharacterTimeline, buildStageMinStats, sortAnnouncements, sortStages } from "@/lib/stats";
import { getServiceSupabaseClient } from "@/lib/supabase-service";

function mapCharacterRow(row: Record<string, unknown>): Character {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    createdAt: String(row.created_at),
  };
}

function mapStageRow(row: Record<string, unknown>): ArbiterStage {
  return {
    id: String(row.id),
    versionLabel: String(row.version_label),
    versionSortKey: Number(row.version_sort_key),
    bossName: String(row.boss_name),
    createdAt: String(row.created_at),
  };
}

function mapAnnouncementRow(row: Record<string, unknown>): Announcement {
  return {
    id: String(row.id),
    title: String(row.title),
    bodyText: String(row.body_text),
    publishedAt: String(row.published_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapJoinedRecordRow(row: Record<string, unknown>): JoinedRecord {
  return {
    id: String(row.id),
    characterId: String(row.character_id),
    stageId: String(row.stage_id),
    goldCost: Number(row.gold_cost),
    videoUrl: String(row.video_url),
    createdAt: String(row.created_at),
    characterName: String(row.character_name),
    characterSlug: String(row.character_slug),
    stageVersionLabel: String(row.stage_version_label),
    stageVersionSortKey: Number(row.stage_version_sort_key),
    stageBossName: String(row.stage_boss_name),
  };
}

function getMockHomeData(): HomeData {
  return {
    stages: sortStages(mockDb.stages),
    rankings: buildCharacterRankings(mockDb.characters, mockDb.records),
    latestAnnouncements: sortAnnouncements(mockDb.announcements).slice(0, 5),
  };
}

function getMockStageDetail(versionLabel: string): StageDetailData | null {
  const stage = mockDb.stages.find((item) => item.versionLabel === versionLabel);

  if (!stage) {
    return null;
  }

  return {
    stage,
    stats: buildStageMinStats(mockDb.records.filter((record) => record.stageId === stage.id)),
  };
}

function getMockCharacterDetail(slug: string): CharacterDetailData | null {
  const character = mockDb.characters.find((item) => item.slug === slug);

  if (!character) {
    return null;
  }

  return {
    character,
    timeline: buildCharacterTimeline(
      mockDb.records.filter((record) => record.characterId === character.id),
    ),
  };
}

export async function getHomeData(): Promise<HomeData> {
  if (!hasServiceSupabaseEnv()) {
    return getMockHomeData();
  }

  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return getMockHomeData();
  }

  const [stagesResult, rankingsResult, announcementsResult] = await Promise.all([
    supabase.from("arbiter_stages").select("*").order("version_sort_key", { ascending: true }),
    supabase
      .from("character_avg_min_gold_rankings")
      .select("*")
      .order("average_min_gold_cost", { ascending: true })
      .order("stages_covered", { ascending: false })
      .order("character_name", { ascending: true }),
    supabase
      .from("announcements")
      .select("*")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(5),
  ]);

  if (stagesResult.error) {
    throw stagesResult.error;
  }

  if (rankingsResult.error) {
    throw rankingsResult.error;
  }

  if (announcementsResult.error) {
    throw announcementsResult.error;
  }

  return {
    stages: (stagesResult.data ?? []).map(mapStageRow),
    rankings: (rankingsResult.data ?? []).map((row) => ({
      characterId: String(row.character_id),
      characterName: String(row.character_name),
      characterSlug: String(row.character_slug),
      averageMinGoldCost: Number(row.average_min_gold_cost),
      stagesCovered: Number(row.stages_covered),
    })),
    latestAnnouncements: (announcementsResult.data ?? []).map(mapAnnouncementRow),
  };
}

export async function getStageDetail(versionLabel: string): Promise<StageDetailData | null> {
  if (!hasServiceSupabaseEnv()) {
    return getMockStageDetail(versionLabel);
  }

  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return getMockStageDetail(versionLabel);
  }

  const stageResult = await supabase
    .from("arbiter_stages")
    .select("*")
    .eq("version_label", versionLabel)
    .maybeSingle();

  if (stageResult.error) {
    throw stageResult.error;
  }

  if (!stageResult.data) {
    return null;
  }

  const statsResult = await supabase
    .from("stage_character_min_records")
    .select("*")
    .eq("stage_id", stageResult.data.id)
    .order("gold_cost", { ascending: true })
    .order("character_name", { ascending: true })
    .order("created_at", { ascending: true });

  if (statsResult.error) {
    throw statsResult.error;
  }

  return {
    stage: mapStageRow(stageResult.data),
    stats: buildStageMinStats((statsResult.data ?? []).map(mapJoinedRecordRow)),
  };
}

export async function getCharacterDetail(slug: string): Promise<CharacterDetailData | null> {
  if (!hasServiceSupabaseEnv()) {
    return getMockCharacterDetail(slug);
  }

  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return getMockCharacterDetail(slug);
  }

  const characterResult = await supabase
    .from("characters")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (characterResult.error) {
    throw characterResult.error;
  }

  if (!characterResult.data) {
    return null;
  }

  const timelineResult = await supabase
    .from("character_stage_min_records")
    .select("*")
    .eq("character_id", characterResult.data.id)
    .order("stage_version_sort_key", { ascending: true })
    .order("created_at", { ascending: true });

  if (timelineResult.error) {
    throw timelineResult.error;
  }

  return {
    character: mapCharacterRow(characterResult.data),
    timeline: buildCharacterTimeline((timelineResult.data ?? []).map(mapJoinedRecordRow)),
  };
}

export async function getAnnouncementsData(): Promise<Announcement[]> {
  if (!hasServiceSupabaseEnv()) {
    return sortAnnouncements(mockDb.announcements);
  }

  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return sortAnnouncements(mockDb.announcements);
  }

  const result = await supabase
    .from("announcements")
    .select("*")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (result.error) {
    throw result.error;
  }

  return (result.data ?? []).map(mapAnnouncementRow);
}

export async function getAdminBootstrapData(): Promise<AdminBootstrapData> {
  if (!hasServiceSupabaseEnv()) {
    return getMockAdminBootstrap();
  }

  const supabase = getServiceSupabaseClient();

  if (!supabase) {
    return getMockAdminBootstrap();
  }

  const [charactersResult, stagesResult, recordsResult, announcementsResult] = await Promise.all([
    supabase.from("characters").select("*").order("name", { ascending: true }),
    supabase.from("arbiter_stages").select("*").order("version_sort_key", { ascending: true }),
    supabase
      .from("clear_records")
      .select(
        `
          id,
          character_id,
          stage_id,
          gold_cost,
          video_url,
          created_at,
          character:characters!clear_records_character_id_fkey(id, name, slug),
          stage:arbiter_stages!clear_records_stage_id_fkey(id, version_label, version_sort_key, boss_name)
        `,
      )
      .order("created_at", { ascending: false }),
    supabase.from("announcements").select("*").order("published_at", { ascending: false }),
  ]);

  if (charactersResult.error) {
    throw charactersResult.error;
  }

  if (stagesResult.error) {
    throw stagesResult.error;
  }

  if (recordsResult.error) {
    throw recordsResult.error;
  }

  if (announcementsResult.error) {
    throw announcementsResult.error;
  }

  const records = (recordsResult.data ?? []).map((row) => {
    const character = Array.isArray(row.character) ? row.character[0] : row.character;
    const stage = Array.isArray(row.stage) ? row.stage[0] : row.stage;

    return {
      id: String(row.id),
      characterId: String(row.character_id),
      stageId: String(row.stage_id),
      goldCost: Number(row.gold_cost),
      videoUrl: String(row.video_url),
      createdAt: String(row.created_at),
      characterName: String(character?.name),
      characterSlug: String(character?.slug),
      stageVersionLabel: String(stage?.version_label),
      stageVersionSortKey: Number(stage?.version_sort_key),
      stageBossName: String(stage?.boss_name),
    };
  });

  return {
    characters: (charactersResult.data ?? []).map(mapCharacterRow),
    stages: (stagesResult.data ?? []).map(mapStageRow),
    records,
    announcements: (announcementsResult.data ?? []).map(mapAnnouncementRow),
  };
}
