"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface FormState {
  characterId: string;
  stageId: string;
  goldCost: string;
  videoUrl: string;
}

const emptyForm: FormState = { characterId: "", stageId: "", goldCost: "", videoUrl: "" };

export function SubmissionForm({
  characters,
  stages,
}: {
  characters: { id: string; name: string }[];
  stages: { id: string; versionLabel: string; bossName: string }[];
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setFeedback(null);

    const gold = Number(form.goldCost);
    if (!form.characterId || !form.stageId) {
      setError("请选择主C和王棋期数。");
      return;
    }
    if (!Number.isInteger(gold) || gold < 0 || gold > 20) {
      setError("金数必须是 0 到 20 之间的整数。");
      return;
    }
    if (!/^https?:\/\//.test(form.videoUrl)) {
      setError("请填写合法的视频链接（http/https 开头）。");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, goldCost: gold }),
        });
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) {
          throw new Error(body.error ?? "提交失败");
        }
        setFeedback("投稿成功，管理员将尽快审核。感谢你的贡献！");
        setForm(emptyForm);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "提交失败。");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="submit-character">主C</Label>
        <SearchableSelect
          id="submit-character"
          placeholder="请选择角色"
          value={form.characterId}
          onChange={(val) => setForm((c) => ({ ...c, characterId: val }))}
          options={characters.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      <div>
        <Label htmlFor="submit-stage">王棋期数</Label>
        <SearchableSelect
          id="submit-stage"
          placeholder="请选择期数"
          value={form.stageId}
          onChange={(val) => setForm((c) => ({ ...c, stageId: val }))}
          options={stages.map((s) => ({
            value: s.id,
            label: `Ver.${s.versionLabel} · ${s.bossName}`,
          }))}
        />
      </div>

      <div>
        <Label htmlFor="submit-gold">金数（上限 20 金）</Label>
        <Input
          id="submit-gold"
          type="number"
          min={0}
          max={20}
          value={form.goldCost}
          onChange={(e) => setForm((c) => ({ ...c, goldCost: e.target.value }))}
        />
        <p className="mt-1 text-xs text-white/55">
          游客投稿的队伍金数不能超过 20 金。
        </p>
      </div>

      <div>
        <Label htmlFor="submit-video">视频链接</Label>
        <Input
          id="submit-video"
          type="url"
          placeholder="https://..."
          value={form.videoUrl}
          onChange={(e) => setForm((c) => ({ ...c, videoUrl: e.target.value }))}
        />
      </div>

      {feedback && (
        <div className="rounded-2xl border border-cyan-300/16 bg-cyan-300/10 p-3 text-sm text-cyan-50">
          {feedback}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={submit} disabled={isPending}>
          {isPending ? "提交中…" : "提交投稿"}
        </Button>
        <Button variant="ghost" onClick={() => setForm(emptyForm)} disabled={isPending}>
          重置
        </Button>
      </div>
    </div>
  );
}
