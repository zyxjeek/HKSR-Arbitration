import {
  type AdminRecordListItem,
  type Announcement,
  type ArbiterStage,
  type Character,
  type CharacterRankingItem,
  type CharacterTimelinePoint,
  type JoinedRecord,
  type StageMinStat,
} from "@/lib/types";
import { roundToSingleDecimal } from "@/lib/utils";

export function buildStageMinStats(records: JoinedRecord[]): StageMinStat[] {
  const grouped = new Map<string, JoinedRecord[]>();

  for (const record of records) {
    const key = `${record.stageId}:${record.characterId}`;
    const bucket = grouped.get(key) ?? [];
    bucket.push(record);
    grouped.set(key, bucket);
  }

  return [...grouped.values()]
    .map((bucket) => {
      const minGoldCost = Math.min(...bucket.map((item) => item.goldCost));
      const best = bucket
        .filter((item) => item.goldCost === minGoldCost)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];

      return {
        characterId: best.characterId,
        characterName: best.characterName,
        characterSlug: best.characterSlug,
        stageId: best.stageId,
        versionLabel: best.stageVersionLabel,
        versionSortKey: best.stageVersionSortKey,
        bossName: best.stageBossName,
        minGoldCost,
        videoUrl: best.videoUrl,
      };
    })
    .sort((a, b) => a.minGoldCost - b.minGoldCost || a.characterName.localeCompare(b.characterName));
}

export function buildCharacterTimeline(records: JoinedRecord[]): CharacterTimelinePoint[] {
  return buildStageMinStats(records)
    .map((stat) => ({
      ...stat,
    }))
    .sort((a, b) => a.versionSortKey - b.versionSortKey || a.characterName.localeCompare(b.characterName));
}

export function buildCharacterRankings(
  characters: Character[],
  records: JoinedRecord[],
): CharacterRankingItem[] {
  const stats = buildStageMinStats(records);
  const grouped = new Map<string, StageMinStat[]>();

  for (const stat of stats) {
    const bucket = grouped.get(stat.characterId) ?? [];
    bucket.push(stat);
    grouped.set(stat.characterId, bucket);
  }

  return characters
    .filter((character) => grouped.has(character.id))
    .map((character) => {
      const bucket = grouped.get(character.id)!;
      const total = bucket.reduce((sum, stat) => sum + stat.minGoldCost, 0);

      return {
        characterId: character.id,
        characterName: character.name,
        characterSlug: character.slug,
        averageMinGoldCost: roundToSingleDecimal(total / bucket.length),
        stagesCovered: bucket.length,
      };
    })
    .sort(
      (a, b) =>
        a.averageMinGoldCost - b.averageMinGoldCost ||
        b.stagesCovered - a.stagesCovered ||
        a.characterName.localeCompare(b.characterName),
    );
}

export function sortStages(stages: ArbiterStage[]) {
  return [...stages].sort(
    (a, b) => a.versionSortKey - b.versionSortKey || a.versionLabel.localeCompare(b.versionLabel),
  );
}

export function sortAnnouncements(announcements: Announcement[]) {
  return [...announcements].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function buildJoinedRecordMap(
  records: AdminRecordListItem[],
): Map<string, AdminRecordListItem> {
  return new Map(records.map((record) => [record.id, record]));
}
