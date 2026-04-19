import { describe, expect, it } from "vitest";
import { mockDb } from "@/lib/mock-data";
import { buildCharacterRankings, buildStageMinStats } from "@/lib/stats";
import { versionLabelToSortKey } from "@/lib/utils";

describe("versionLabelToSortKey", () => {
  it("orders versions correctly", () => {
    expect(versionLabelToSortKey("2.7")).toBeLessThan(versionLabelToSortKey("3.0"));
    expect(versionLabelToSortKey("3.0")).toBeLessThan(versionLabelToSortKey("3.1"));
    expect(versionLabelToSortKey("3.1")).toBeLessThan(versionLabelToSortKey("3.1.1"));
  });
});

describe("buildStageMinStats", () => {
  it("keeps only minimum gold per character and stage", () => {
    const stage = mockDb.stages[1];
    const stats = buildStageMinStats(
      mockDb.records.filter((record) => record.stageId === stage.id),
    );

    const huangquan = stats.find((item) => item.characterName === "黄泉");

    expect(huangquan?.minGoldCost).toBe(3);
    expect(huangquan?.records).toHaveLength(2);
  });
});

describe("buildCharacterRankings", () => {
  it("uses per-stage minimum gold values for averages", () => {
    const rankings = buildCharacterRankings(mockDb.characters, mockDb.records);
    const jingliu = rankings.find((item) => item.characterName === "镜流");

    expect(jingliu?.averageMinGoldCost).toBe(3.5);
    expect(jingliu?.stagesCovered).toBe(2);
  });
});
