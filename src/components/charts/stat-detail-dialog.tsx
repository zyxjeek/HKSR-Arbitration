"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CharacterTimelinePoint, StageMinStat } from "@/lib/types";

interface StatDetailDialogProps {
  item: StageMinStat | CharacterTimelinePoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatDetailDialog({
  item,
  open,
  onOpenChange,
}: StatDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {item ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-white">
                {item.characterName} · Ver.{item.versionLabel}
              </DialogTitle>
              <DialogDescription className="text-sm text-white/60">
                敌人：{item.bossName} · 最低金数：{item.minGoldCost}
              </DialogDescription>
            </div>
            <div className="space-y-3">
              {item.records.map((record, index) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-3 flex items-center justify-between text-sm text-white/70">
                    <span>记录 #{index + 1}</span>
                    <span className="font-mono">{record.goldCost} 金</span>
                  </div>
                  <Button asChild size="sm">
                    <a href={record.videoUrl} target="_blank" rel="noreferrer">
                      查看视频链接
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
