import { z } from "zod";

export const characterInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "角色名不能为空")
    .max(40, "角色名不能超过 40 个字符"),
});

export const stageInputSchema = z.object({
  versionLabel: z
    .string()
    .trim()
    .regex(/^\d+(?:\.\d+){0,2}$/, "版本号格式应类似 3.2 或 3.2.1"),
  bossName: z
    .string()
    .trim()
    .min(1, "怪物名不能为空")
    .max(80, "怪物名不能超过 80 个字符"),
});

export const clearRecordInputSchema = z.object({
  characterId: z.uuid("请选择有效的主C"),
  stageId: z.uuid("请选择有效的王棋期数"),
  goldCost: z.coerce
    .number()
    .int("金数必须为整数")
    .min(0, "金数不能小于 0")
    .max(99, "金数不能大于 99"),
  videoUrl: z.url("请输入合法的视频链接"),
});

export const guestSubmissionSchema = z.object({
  characterId: z.uuid("请选择有效的主C"),
  stageId: z.uuid("请选择有效的王棋期数"),
  goldCost: z.coerce
    .number()
    .int("金数必须为整数")
    .min(0, "金数不能小于 0")
    .max(20, "游客投稿的金数不能超过 20"),
  videoUrl: z.url("请输入合法的视频链接"),
});

export const announcementInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "公告标题不能为空")
    .max(120, "公告标题不能超过 120 个字符"),
  bodyText: z
    .string()
    .trim()
    .min(1, "公告正文不能为空")
    .max(5000, "公告正文不能超过 5000 个字符"),
  publishedAt: z
    .string()
    .trim()
    .min(1, "请设置发布时间")
    .refine((value) => !Number.isNaN(Date.parse(value)), "发布时间格式无效"),
});

export const idSchema = z.object({
  id: z.uuid("ID 格式无效"),
});
