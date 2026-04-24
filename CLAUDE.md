# 项目规范

## 语言要求

无论是回复输出还是内部思考过程，始终使用中文。

---

## 项目概述

**异相仲裁王棋 0T 成绩统计站** — 面向《崩坏：星穹铁道》"异相仲裁王棋（普通）"玩法的非官方粉丝统计网站。

核心功能：
- 按王棋期数查看不同主C的 0T 最低金数条形图
- 按主C查看跨期最低金折线图
- 管理后台维护角色、王棋敌人、通关记录与公告
- 玩家自助投稿入口（`/submit`）
- Demo 模式：无 Supabase 环境变量时自动展示内置演示数据

## 技术栈

| 层次 | 技术 |
|------|------|
| 框架 | Next.js 16 + TypeScript，App Router |
| 样式 | Tailwind CSS v4 |
| 图表 | ECharts 6 + echarts-for-react |
| 后端/DB | Supabase（Postgres + Auth） |
| 表单 | react-hook-form + zod |
| UI 组件 | Radix UI 原语 + 自定义封装（`src/components/ui/`） |
| 测试 | Vitest + Testing Library |
| 部署 | Vercel（前端）+ Supabase 免费层（DB） |

## 目录结构

```
src/
  app/                  # Next.js App Router 页面与 API
    (public pages)      # about / announcements / characters/[slug] / stages/[version] / submit
    admin/              # 后台管理页面（login + dashboard）
    api/                # Route Handlers
      admin/            # 需鉴权：characters / stages / records / announcements / submissions / bootstrap
      (public)          # home / stages/[version] / characters/[slug] / announcements / submissions
  components/
    admin/              # 后台专用组件
    charts/             # ECharts 图表组件
    site/               # 通用站点组件（header / footer / 公告列表等）
    ui/                 # 基础 UI 原语
  lib/
    types.ts            # 全局类型定义
    data-service.ts     # 公共数据读取（Supabase 查询）
    admin-service.ts    # 后台写操作
    supabase-*.ts       # browser / server / service client 三类 Supabase 客户端
    mock-data.ts        # Demo 模式数据
    validators.ts       # zod schema
    stats.ts            # 统计辅助函数
data/                   # 仓库内置演示数据（JSON）
supabase/
  schema.sql            # 数据库建表 + 视图脚本
```

## 数据库核心表 / 视图

**表**：`characters`、`arbiter_stages`、`clear_records`、`announcements`

**视图**（聚合层，前端直接消费）：
- `stage_character_min_records` — 每期各角色最低金
- `character_stage_min_records` — 各角色各期最低金
- `character_avg_min_gold_rankings` — 角色平均最低金排行

## 认证

单管理员模式，Supabase Auth 邮箱密码登录，入口 `/admin/login`。无多角色权限系统。

## 本地启动

```bash
npm install
cp .env.example .env.local  # 填写 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / SERVICE_ROLE_KEY
npm run dev                  # http://localhost:3000
```

测试：`npm run lint && npm run test`
