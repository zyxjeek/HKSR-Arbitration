"use client";

import { useMemo, useState, useTransition } from "react";
import { LogOut, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  AdminBootstrapData,
  AdminRecordListItem,
  Announcement,
  ArbiterStage,
  Character,
} from "@/lib/types";
import { adminSectionLabels } from "@/lib/constants";
import { formatPublishedAt } from "@/lib/format";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(body.error ?? "请求失败");
  }

  return body as T;
}

function toDateTimeLocal(input: string) {
  const date = new Date(input);
  const timezoneOffset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - timezoneOffset * 60_000);
  return local.toISOString().slice(0, 16);
}

type CharacterFormState = { name: string };
type StageFormState = { versionLabel: string; bossName: string };
type RecordFormState = { characterId: string; stageId: string; goldCost: string; videoUrl: string };
type AnnouncementFormState = { title: string; bodyText: string; publishedAt: string };

const emptyCharacterForm: CharacterFormState = { name: "" };
const emptyStageForm: StageFormState = { versionLabel: "", bossName: "" };
const emptyRecordForm: RecordFormState = { characterId: "", stageId: "", goldCost: "", videoUrl: "" };
const emptyAnnouncementForm: AnnouncementFormState = {
  title: "",
  bodyText: "",
  publishedAt: new Date().toISOString().slice(0, 16),
};

export function AdminDashboard({
  initialData,
  mutationsEnabled,
}: {
  initialData: AdminBootstrapData;
  mutationsEnabled: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [editingStage, setEditingStage] = useState<ArbiterStage | null>(null);
  const [editingRecord, setEditingRecord] = useState<AdminRecordListItem | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [characterForm, setCharacterForm] = useState<CharacterFormState>(emptyCharacterForm);
  const [stageForm, setStageForm] = useState<StageFormState>(emptyStageForm);
  const [recordForm, setRecordForm] = useState<RecordFormState>(emptyRecordForm);
  const [announcementForm, setAnnouncementForm] =
    useState<AnnouncementFormState>(emptyAnnouncementForm);

  const [recordCharacterFilter, setRecordCharacterFilter] = useState("");
  const [recordStageFilter, setRecordStageFilter] = useState("");

  const filteredRecords = useMemo(
    () =>
      data.records.filter((record) => {
        const matchesCharacter =
          !recordCharacterFilter || record.characterId === recordCharacterFilter;
        const matchesStage = !recordStageFilter || record.stageId === recordStageFilter;
        return matchesCharacter && matchesStage;
      }),
    [data.records, recordCharacterFilter, recordStageFilter],
  );

  async function refreshData() {
    const payload = await requestJson<AdminBootstrapData>("/api/admin/bootstrap");
    setData(payload);
  }

  function handleFailure(message: string) {
    setFeedback(null);
    setError(message);
  }

  function handleSuccess(message: string) {
    setError(null);
    setFeedback(message);
  }

  function withPending(work: () => Promise<void>) {
    startTransition(async () => {
      try {
        await work();
      } catch (cause) {
        handleFailure(cause instanceof Error ? cause.message : "操作失败");
      }
    });
  }

  async function submitCharacter() {
    const method = editingCharacter ? "PUT" : "POST";
    const query = editingCharacter ? `?id=${editingCharacter.id}` : "";
    await requestJson(`/api/admin/characters${query}`, {
      method,
      body: JSON.stringify(characterForm),
    });
    await refreshData();
    setCharacterForm(emptyCharacterForm);
    setEditingCharacter(null);
    handleSuccess(editingCharacter ? "角色已更新。" : "角色已新增。");
  }

  async function submitStage() {
    const method = editingStage ? "PUT" : "POST";
    const query = editingStage ? `?id=${editingStage.id}` : "";
    await requestJson(`/api/admin/stages${query}`, {
      method,
      body: JSON.stringify(stageForm),
    });
    await refreshData();
    setStageForm(emptyStageForm);
    setEditingStage(null);
    handleSuccess(editingStage ? "王棋期数已更新。" : "王棋期数已新增。");
  }

  async function submitRecord() {
    const method = editingRecord ? "PUT" : "POST";
    const query = editingRecord ? `?id=${editingRecord.id}` : "";
    await requestJson(`/api/admin/records${query}`, {
      method,
      body: JSON.stringify({
        ...recordForm,
        goldCost: Number(recordForm.goldCost),
      }),
    });
    await refreshData();
    setRecordForm(emptyRecordForm);
    setEditingRecord(null);
    handleSuccess(editingRecord ? "通关记录已更新。" : "通关记录已新增。");
  }

  async function submitAnnouncement() {
    const method = editingAnnouncement ? "PUT" : "POST";
    const query = editingAnnouncement ? `?id=${editingAnnouncement.id}` : "";
    await requestJson(`/api/admin/announcements${query}`, {
      method,
      body: JSON.stringify({
        ...announcementForm,
        publishedAt: new Date(announcementForm.publishedAt).toISOString(),
      }),
    });
    await refreshData();
    setAnnouncementForm(emptyAnnouncementForm);
    setEditingAnnouncement(null);
    handleSuccess(editingAnnouncement ? "公告已更新。" : "公告已新增。");
  }

  function removeResource(path: string, id: string, successMessage: string) {
    if (!window.confirm("确认删除这条内容吗？")) {
      return;
    }

    withPending(async () => {
      await requestJson(`${path}?id=${id}`, { method: "DELETE" });
      await refreshData();
      handleSuccess(successMessage);
    });
  }

  function beginCharacterEdit(character: Character) {
    setEditingCharacter(character);
    setCharacterForm({ name: character.name });
  }

  function beginStageEdit(stage: ArbiterStage) {
    setEditingStage(stage);
    setStageForm({ versionLabel: stage.versionLabel, bossName: stage.bossName });
  }

  function beginRecordEdit(record: AdminRecordListItem) {
    setEditingRecord(record);
    setRecordForm({
      characterId: record.characterId,
      stageId: record.stageId,
      goldCost: String(record.goldCost),
      videoUrl: record.videoUrl,
    });
  }

  function beginAnnouncementEdit(announcement: Announcement) {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      bodyText: announcement.bodyText,
      publishedAt: toDateTimeLocal(announcement.publishedAt),
    });
  }

  async function handleLogout() {
    const supabase = getBrowserSupabaseClient();

    if (!supabase) {
      handleFailure("Supabase 客户端初始化失败，无法登出。");
      return;
    }

    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">管理员工作台</CardTitle>
            <CardDescription>
              维护角色、王棋期数、0T 记录和公告内容。提交后会直接反映到前台页面。
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => withPending(refreshData)} disabled={isPending}>
              <RefreshCcw className="size-4" />
              刷新数据
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="size-4" />
              退出登录
            </Button>
          </div>
        </div>
        {!mutationsEnabled ? (
          <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
            当前未配置服务端数据库密钥，后台可预览但无法执行新增、编辑、删除。
          </div>
        ) : null}
        {feedback ? (
          <div className="mt-4 rounded-2xl border border-cyan-300/16 bg-cyan-300/10 p-4 text-sm text-cyan-50">
            {feedback}
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </Card>

      <Tabs defaultValue="characters" className="space-y-6">
        <TabsList>
          {Object.entries(adminSectionLabels).map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="characters">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Card>
              <CardTitle className="mb-4">已收录角色</CardTitle>
              <div className="space-y-3">
                {data.characters.map((character) => (
                  <div
                    key={character.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">{character.name}</p>
                      <p className="font-mono text-xs text-cyan-200/75">{character.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => beginCharacterEdit(character)}>
                        <Pencil className="size-4" />
                        编辑
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeResource("/api/admin/characters", character.id, "角色已删除。")}
                        disabled={!mutationsEnabled || isPending}
                      >
                        <Trash2 className="size-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle>{editingCharacter ? "编辑角色" : "新增角色"}</CardTitle>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="character-name">角色名</Label>
                  <Input
                    id="character-name"
                    value={characterForm.name}
                    onChange={(event) =>
                      setCharacterForm((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => withPending(submitCharacter)} disabled={!mutationsEnabled || isPending}>
                    {editingCharacter ? "保存修改" : "新增角色"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingCharacter(null);
                      setCharacterForm(emptyCharacterForm);
                    }}
                  >
                    重置
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stages">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Card>
              <CardTitle className="mb-4">王棋敌人列表</CardTitle>
              <div className="space-y-3">
                {data.stages.map((stage) => (
                  <div
                    key={stage.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">Ver.{stage.versionLabel}</p>
                      <p className="text-sm text-white/62">{stage.bossName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => beginStageEdit(stage)}>
                        <Pencil className="size-4" />
                        编辑
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeResource("/api/admin/stages", stage.id, "王棋期数已删除。")}
                        disabled={!mutationsEnabled || isPending}
                      >
                        <Trash2 className="size-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle>{editingStage ? "编辑王棋期数" : "新增王棋期数"}</CardTitle>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="stage-version">版本号</Label>
                  <Input
                    id="stage-version"
                    placeholder="例如 3.2"
                    value={stageForm.versionLabel}
                    onChange={(event) =>
                      setStageForm((current) => ({
                        ...current,
                        versionLabel: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="stage-boss">怪物名</Label>
                  <Input
                    id="stage-boss"
                    value={stageForm.bossName}
                    onChange={(event) =>
                      setStageForm((current) => ({ ...current, bossName: event.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => withPending(submitStage)} disabled={!mutationsEnabled || isPending}>
                    {editingStage ? "保存修改" : "新增王棋期数"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingStage(null);
                      setStageForm(emptyStageForm);
                    }}
                  >
                    重置
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <Card>
              <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <CardTitle className="mb-2">通关记录列表</CardTitle>
                  <CardDescription>可按角色和期数筛选，方便快速纠错。</CardDescription>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="record-character-filter">按角色筛选</Label>
                    <select
                      id="record-character-filter"
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                      value={recordCharacterFilter}
                      onChange={(event) => setRecordCharacterFilter(event.target.value)}
                    >
                      <option value="">全部角色</option>
                      {data.characters.map((character) => (
                        <option key={character.id} value={character.id}>
                          {character.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="record-stage-filter">按期数筛选</Label>
                    <select
                      id="record-stage-filter"
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                      value={recordStageFilter}
                      onChange={(event) => setRecordStageFilter(event.target.value)}
                    >
                      <option value="">全部期数</option>
                      {data.stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          Ver.{stage.versionLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-white">
                          {record.characterName} · Ver.{record.stageVersionLabel}
                        </p>
                        <p className="text-sm text-white/62">{record.stageBossName}</p>
                        <p className="font-mono text-xs text-cyan-200/75">{record.goldCost} 金</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={record.videoUrl} target="_blank" rel="noreferrer">
                            视频链接
                          </a>
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => beginRecordEdit(record)}>
                          <Pencil className="size-4" />
                          编辑
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeResource("/api/admin/records", record.id, "通关记录已删除。")}
                          disabled={!mutationsEnabled || isPending}
                        >
                          <Trash2 className="size-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle>{editingRecord ? "编辑通关记录" : "新增通关记录"}</CardTitle>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="record-character">主C</Label>
                  <select
                    id="record-character"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                    value={recordForm.characterId}
                    onChange={(event) =>
                      setRecordForm((current) => ({ ...current, characterId: event.target.value }))
                    }
                  >
                    <option value="">请选择角色</option>
                    {data.characters.map((character) => (
                      <option key={character.id} value={character.id}>
                        {character.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="record-stage">王棋期数</Label>
                  <select
                    id="record-stage"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                    value={recordForm.stageId}
                    onChange={(event) =>
                      setRecordForm((current) => ({ ...current, stageId: event.target.value }))
                    }
                  >
                    <option value="">请选择期数</option>
                    {data.stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        Ver.{stage.versionLabel} · {stage.bossName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="record-gold">金数</Label>
                  <Input
                    id="record-gold"
                    type="number"
                    min={0}
                    value={recordForm.goldCost}
                    onChange={(event) =>
                      setRecordForm((current) => ({ ...current, goldCost: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="record-video">视频链接</Label>
                  <Input
                    id="record-video"
                    type="url"
                    value={recordForm.videoUrl}
                    onChange={(event) =>
                      setRecordForm((current) => ({ ...current, videoUrl: event.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => withPending(submitRecord)} disabled={!mutationsEnabled || isPending}>
                    {editingRecord ? "保存修改" : "新增记录"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingRecord(null);
                      setRecordForm(emptyRecordForm);
                    }}
                  >
                    重置
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <Card>
              <CardTitle className="mb-4">公告列表</CardTitle>
              <div className="space-y-3">
                {data.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <p className="font-semibold text-white">{announcement.title}</p>
                        <p className="font-mono text-xs text-cyan-200/75">
                          {formatPublishedAt(announcement.publishedAt)}
                        </p>
                        <p className="line-clamp-3 whitespace-pre-wrap text-sm text-white/68">
                          {announcement.bodyText}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => beginAnnouncementEdit(announcement)}
                        >
                          <Pencil className="size-4" />
                          编辑
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            removeResource("/api/admin/announcements", announcement.id, "公告已删除。")
                          }
                          disabled={!mutationsEnabled || isPending}
                        >
                          <Trash2 className="size-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle>{editingAnnouncement ? "编辑公告" : "发布公告"}</CardTitle>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="announcement-title">标题</Label>
                  <Input
                    id="announcement-title"
                    value={announcementForm.title}
                    onChange={(event) =>
                      setAnnouncementForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="announcement-published-at">发布时间</Label>
                  <Input
                    id="announcement-published-at"
                    type="datetime-local"
                    value={announcementForm.publishedAt}
                    onChange={(event) =>
                      setAnnouncementForm((current) => ({
                        ...current,
                        publishedAt: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="announcement-body">正文</Label>
                  <Textarea
                    id="announcement-body"
                    value={announcementForm.bodyText}
                    onChange={(event) =>
                      setAnnouncementForm((current) => ({
                        ...current,
                        bodyText: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => withPending(submitAnnouncement)} disabled={!mutationsEnabled || isPending}>
                    {editingAnnouncement ? "保存修改" : "发布公告"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingAnnouncement(null);
                      setAnnouncementForm(emptyAnnouncementForm);
                    }}
                  >
                    重置
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
