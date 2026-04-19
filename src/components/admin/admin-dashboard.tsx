"use client";

import { useMemo, useState, useTransition } from "react";
import { LogOut, Pencil, Pin, PinOff, RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
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

// 把任意时间点格式化为北京（UTC+8）时区下的 datetime-local 字符串
function toBeijingDateTimeLocal(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  // Intl 在某些环境把午夜输出为 "24"，需要兜底
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}`;
}

function toDateTimeLocal(input: string) {
  return toBeijingDateTimeLocal(new Date(input));
}

function nowInUTC8() {
  return toBeijingDateTimeLocal(new Date());
}

// 把"YYYY-MM-DDTHH:MM"字符串按北京时间（UTC+8）解释，返回 UTC ISO 字符串
function beijingLocalToISO(local: string): string {
  const match = local.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) {
    return new Date(local).toISOString();
  }
  const [, y, m, d, h, mm] = match;
  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(h) - 8, Number(mm))).toISOString();
}

type CharacterFormState = { name: string };
type StageFormState = { versionLabel: string; bossName: string };
type RecordFormState = { characterId: string; stageId: string; goldCost: string; videoUrl: string };
type AnnouncementFormState = {
  title: string;
  bodyText: string;
  publishedAt: string;
  isPinned: boolean;
};

const emptyCharacterForm: CharacterFormState = { name: "" };
const emptyStageForm: StageFormState = { versionLabel: "", bossName: "" };
const emptyRecordForm: RecordFormState = { characterId: "", stageId: "", goldCost: "", videoUrl: "" };

function makeEmptyAnnouncementForm(): AnnouncementFormState {
  return { title: "", bodyText: "", publishedAt: nowInUTC8(), isPinned: false };
}

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
    useState<AnnouncementFormState>(makeEmptyAnnouncementForm());

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
        publishedAt: beijingLocalToISO(announcementForm.publishedAt),
      }),
    });
    await refreshData();
    setAnnouncementForm(makeEmptyAnnouncementForm());
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
      isPinned: announcement.isPinned,
    });
  }

  async function togglePin(announcement: Announcement) {
    await requestJson(`/api/admin/announcements?id=${announcement.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: announcement.title,
        bodyText: announcement.bodyText,
        publishedAt: announcement.publishedAt,
        isPinned: !announcement.isPinned,
      }),
    });
    await refreshData();
    handleSuccess(announcement.isPinned ? "已取消置顶。" : "已置顶。");
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
                    <SearchableSelect
                      id="record-character-filter"
                      placeholder="全部角色"
                      value={recordCharacterFilter}
                      onChange={setRecordCharacterFilter}
                      options={data.characters.map((c) => ({ value: c.id, label: c.name }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="record-stage-filter">按期数筛选</Label>
                    <SearchableSelect
                      id="record-stage-filter"
                      placeholder="全部期数"
                      value={recordStageFilter}
                      onChange={setRecordStageFilter}
                      options={data.stages.map((s) => ({
                        value: s.id,
                        label: `Ver.${s.versionLabel} · ${s.bossName}`,
                      }))}
                    />
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
                  <SearchableSelect
                    id="record-character"
                    placeholder="请选择角色"
                    value={recordForm.characterId}
                    onChange={(val) =>
                      setRecordForm((current) => ({ ...current, characterId: val }))
                    }
                    options={data.characters.map((c) => ({ value: c.id, label: c.name }))}
                  />
                </div>
                <div>
                  <Label htmlFor="record-stage">王棋期数</Label>
                  <SearchableSelect
                    id="record-stage"
                    placeholder="请选择期数"
                    value={recordForm.stageId}
                    onChange={(val) =>
                      setRecordForm((current) => ({ ...current, stageId: val }))
                    }
                    options={data.stages.map((s) => ({
                      value: s.id,
                      label: `Ver.${s.versionLabel} · ${s.bossName}`,
                    }))}
                  />
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

        <TabsContent value="submissions">
          <Card>
            <div className="mb-4">
              <CardTitle className="mb-2">待审批投稿</CardTitle>
              <CardDescription>
                游客通过 /submit 页面提交的记录。审批通过后会迁入正式通关记录，拒绝则直接删除。
              </CardDescription>
            </div>
            {data.pendingRecords.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/55">
                暂无待审批投稿。
              </p>
            ) : (
              <div className="space-y-3">
                {data.pendingRecords.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-white">
                          {item.characterName} · Ver.{item.stageVersionLabel}
                        </p>
                        <p className="text-sm text-white/62">{item.stageBossName}</p>
                        <p className="font-mono text-xs text-cyan-200/75">
                          {item.goldCost} 金 · 提交于 {formatPublishedAt(item.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={item.videoUrl} target="_blank" rel="noreferrer">
                            查看视频
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            withPending(async () => {
                              await requestJson(`/api/admin/submissions?id=${item.id}`, {
                                method: "POST",
                              });
                              await refreshData();
                              handleSuccess("已审批通过。");
                            })
                          }
                          disabled={!mutationsEnabled || isPending}
                        >
                          通过
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            if (!window.confirm("确认拒绝并删除这条投稿？")) return;
                            withPending(async () => {
                              await requestJson(`/api/admin/submissions?id=${item.id}`, {
                                method: "DELETE",
                              });
                              await refreshData();
                              handleSuccess("已拒绝。");
                            });
                          }}
                          disabled={!mutationsEnabled || isPending}
                        >
                          <Trash2 className="size-4" />
                          拒绝
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
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
                        <p className="flex items-center gap-2 font-semibold text-white">
                          {announcement.isPinned ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-300/15 px-2 py-0.5 text-xs font-medium text-amber-100">
                              <Pin className="size-3" />置顶
                            </span>
                          ) : null}
                          {announcement.title}
                        </p>
                        <p className="font-mono text-xs text-cyan-200/75">
                          {formatPublishedAt(announcement.publishedAt)}
                        </p>
                        <p className="line-clamp-3 whitespace-pre-wrap text-sm text-white/68">
                          {announcement.bodyText}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => withPending(() => togglePin(announcement))}
                          disabled={!mutationsEnabled || isPending}
                        >
                          {announcement.isPinned ? (
                            <>
                              <PinOff className="size-4" />
                              取消置顶
                            </>
                          ) : (
                            <>
                              <Pin className="size-4" />
                              置顶
                            </>
                          )}
                        </Button>
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
                <label className="flex items-center gap-2 text-sm text-white/80" htmlFor="announcement-pinned">
                  <input
                    id="announcement-pinned"
                    type="checkbox"
                    className="size-4 accent-amber-400"
                    style={{ colorScheme: "dark" }}
                    checked={announcementForm.isPinned}
                    onChange={(event) =>
                      setAnnouncementForm((current) => ({
                        ...current,
                        isPinned: event.target.checked,
                      }))
                    }
                  />
                  <Pin className="size-4 text-amber-200" />
                  置顶此公告
                </label>
                <div className="flex gap-2">
                  <Button onClick={() => withPending(submitAnnouncement)} disabled={!mutationsEnabled || isPending}>
                    {editingAnnouncement ? "保存修改" : "发布公告"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingAnnouncement(null);
                      setAnnouncementForm(makeEmptyAnnouncementForm());
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
