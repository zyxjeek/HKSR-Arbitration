"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface FormState {
  characterId: string;
  stageId: string;
  reason: string;
}

const emptyForm: FormState = { characterId: "", stageId: "", reason: "" };

export function DisputeForm({
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

    if (!form.characterId || !form.stageId) {
      setError("请选择主C和王棋期数。");
      return;
    }
    const reason = form.reason.trim();
    if (!reason) {
      setError("请填写指正原因。");
      return;
    }
    if (reason.length > 500) {
      setError("指正原因不能超过 500 字。");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/disputes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, reason }),
        });
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) {
          throw new Error(body.error ?? "提交失败");
        }
        setFeedback("指正已提交，管理员会尽快核实。感谢你的反馈！");
        setForm(emptyForm);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "提交失败。");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="dispute-character">主C</Label>
        <SearchableSelect
          id="dispute-character"
          placeholder="请选择角色"
          value={form.characterId}
          onChange={(val) => setForm((c) => ({ ...c, characterId: val }))}
          options={characters.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      <div>
        <Label htmlFor="dispute-stage">王棋期数</Label>
        <SearchableSelect
          id="dispute-stage"
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
        <Label htmlFor="dispute-reason">指正原因</Label>
        <Textarea
          id="dispute-reason"
          placeholder="请描述你发现的问题，例如：视频实际金数与展示不符、视频链接失效、角色搭配有争议等。"
          value={form.reason}
          onChange={(e) => setForm((c) => ({ ...c, reason: e.target.value }))}
        />
        <p className="mt-1 text-xs text-white/55">
          不超过 500 字。如涉及视频链接问题，请一并贴上你看到的地址。
        </p>
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
          {isPending ? "提交中…" : "提交指正"}
        </Button>
        <Button variant="ghost" onClick={() => setForm(emptyForm)} disabled={isPending}>
          重置
        </Button>
      </div>
    </div>
  );
}
