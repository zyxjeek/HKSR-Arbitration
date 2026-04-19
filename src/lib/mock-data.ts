import {
  type AdminBootstrapData,
  type Announcement,
  type ArbiterStage,
  type Character,
  type JoinedRecord,
} from "@/lib/types";
import { slugify, versionLabelToSortKey } from "@/lib/utils";

const characters: Character[] = [
  { id: "11111111-1111-4111-8111-111111111111", name: "飞霄", slug: slugify("飞霄"), createdAt: "2026-04-01T08:00:00.000Z" },
  { id: "22222222-2222-4222-8222-222222222222", name: "镜流", slug: slugify("镜流"), createdAt: "2026-04-01T08:00:00.000Z" },
  { id: "33333333-3333-4333-8333-333333333333", name: "黄泉", slug: slugify("黄泉"), createdAt: "2026-04-01T08:00:00.000Z" },
];

const stages: ArbiterStage[] = [
  {
    id: "aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    versionLabel: "3.0",
    versionSortKey: versionLabelToSortKey("3.0"),
    bossName: "金血狮鹫",
    createdAt: "2026-04-01T08:00:00.000Z",
  },
  {
    id: "aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
    versionLabel: "3.1",
    versionSortKey: versionLabelToSortKey("3.1"),
    bossName: "碎星魔方",
    createdAt: "2026-04-02T08:00:00.000Z",
  },
  {
    id: "aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3",
    versionLabel: "3.2",
    versionSortKey: versionLabelToSortKey("3.2"),
    bossName: "裁决机兵",
    createdAt: "2026-04-03T08:00:00.000Z",
  },
];

const announcements: Announcement[] = [
  {
    id: "bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1",
    title: "站点 Demo 数据已接入",
    bodyText:
      "当前仓库默认使用演示数据启动，方便先看页面结构。\n配置 Supabase 环境变量后，页面会自动切换到真实数据库。",
    publishedAt: "2026-04-10T12:00:00.000Z",
    createdAt: "2026-04-10T12:00:00.000Z",
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    id: "bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2",
    title: "统计口径说明",
    bodyText:
      '角色榜单采用”各期最低金数平均值”排序。',
    publishedAt: "2026-04-12T12:00:00.000Z",
    createdAt: "2026-04-12T12:00:00.000Z",
    updatedAt: "2026-04-12T12:00:00.000Z",
  },
];

const records: JoinedRecord[] = [
  {
    id: "ccccccc1-cccc-4ccc-8ccc-ccccccccccc1",
    characterId: characters[0].id,
    stageId: stages[0].id,
    goldCost: 3,
    videoUrl: "https://www.bilibili.com/video/BV1demo001",
    createdAt: "2026-04-05T12:00:00.000Z",
    characterName: characters[0].name,
    characterSlug: characters[0].slug,
    stageVersionLabel: stages[0].versionLabel,
    stageVersionSortKey: stages[0].versionSortKey,
    stageBossName: stages[0].bossName,
  },
  {
    id: "ccccccc2-cccc-4ccc-8ccc-ccccccccccc2",
    characterId: characters[0].id,
    stageId: stages[1].id,
    goldCost: 4,
    videoUrl: "https://www.bilibili.com/video/BV1demo002",
    createdAt: "2026-04-06T12:00:00.000Z",
    characterName: characters[0].name,
    characterSlug: characters[0].slug,
    stageVersionLabel: stages[1].versionLabel,
    stageVersionSortKey: stages[1].versionSortKey,
    stageBossName: stages[1].bossName,
  },
  {
    id: "ccccccc3-cccc-4ccc-8ccc-ccccccccccc3",
    characterId: characters[1].id,
    stageId: stages[0].id,
    goldCost: 2,
    videoUrl: "https://www.bilibili.com/video/BV1demo003",
    createdAt: "2026-04-05T13:00:00.000Z",
    characterName: characters[1].name,
    characterSlug: characters[1].slug,
    stageVersionLabel: stages[0].versionLabel,
    stageVersionSortKey: stages[0].versionSortKey,
    stageBossName: stages[0].bossName,
  },
  {
    id: "ccccccc4-cccc-4ccc-8ccc-ccccccccccc4",
    characterId: characters[1].id,
    stageId: stages[2].id,
    goldCost: 5,
    videoUrl: "https://www.bilibili.com/video/BV1demo004",
    createdAt: "2026-04-07T13:00:00.000Z",
    characterName: characters[1].name,
    characterSlug: characters[1].slug,
    stageVersionLabel: stages[2].versionLabel,
    stageVersionSortKey: stages[2].versionSortKey,
    stageBossName: stages[2].bossName,
  },
  {
    id: "ccccccc5-cccc-4ccc-8ccc-ccccccccccc5",
    characterId: characters[2].id,
    stageId: stages[1].id,
    goldCost: 3,
    videoUrl: "https://www.bilibili.com/video/BV1demo005",
    createdAt: "2026-04-06T14:00:00.000Z",
    characterName: characters[2].name,
    characterSlug: characters[2].slug,
    stageVersionLabel: stages[1].versionLabel,
    stageVersionSortKey: stages[1].versionSortKey,
    stageBossName: stages[1].bossName,
  },
  {
    id: "ccccccc6-cccc-4ccc-8ccc-ccccccccccc6",
    characterId: characters[2].id,
    stageId: stages[1].id,
    goldCost: 3,
    videoUrl: "https://www.bilibili.com/video/BV1demo006",
    createdAt: "2026-04-06T15:00:00.000Z",
    characterName: characters[2].name,
    characterSlug: characters[2].slug,
    stageVersionLabel: stages[1].versionLabel,
    stageVersionSortKey: stages[1].versionSortKey,
    stageBossName: stages[1].bossName,
  },
];

export const mockDb = {
  characters,
  stages,
  announcements,
  records,
};

export function getMockAdminBootstrap(): AdminBootstrapData {
  return {
    characters,
    stages,
    announcements,
    records,
    pendingRecords: [],
  };
}
