export interface Character {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface ArbiterStage {
  id: string;
  versionLabel: string;
  versionSortKey: number;
  bossName: string;
  createdAt: string;
}

export interface ClearRecord {
  id: string;
  characterId: string;
  stageId: string;
  goldCost: number;
  videoUrl: string;
  createdAt: string;
}

export interface JoinedRecord extends ClearRecord {
  characterName: string;
  characterSlug: string;
  stageVersionLabel: string;
  stageVersionSortKey: number;
  stageBossName: string;
}

export interface Announcement {
  id: string;
  title: string;
  bodyText: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}


export interface StageMinStat {
  characterId: string;
  characterName: string;
  characterSlug: string;
  stageId: string;
  versionLabel: string;
  versionSortKey: number;
  bossName: string;
  minGoldCost: number;
  videoUrl: string;
}

export interface CharacterTimelinePoint {
  characterId: string;
  characterName: string;
  characterSlug: string;
  stageId: string;
  versionLabel: string;
  versionSortKey: number;
  bossName: string;
  minGoldCost: number;
  videoUrl: string;
}

export interface CharacterRankingItem {
  characterId: string;
  characterName: string;
  characterSlug: string;
  averageMinGoldCost: number;
  stagesCovered: number;
}

export interface HomeData {
  stages: ArbiterStage[];
  rankings: CharacterRankingItem[];
  latestAnnouncements: Announcement[];
}

export interface StageDetailData {
  stage: ArbiterStage;
  stats: StageMinStat[];
}

export interface CharacterDetailData {
  character: Character;
  timeline: CharacterTimelinePoint[];
}

export type AdminRecordListItem = JoinedRecord;

export interface AdminBootstrapData {
  characters: Character[];
  stages: ArbiterStage[];
  records: AdminRecordListItem[];
  announcements: Announcement[];
}
