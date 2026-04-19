# 异相仲裁王棋 0T 成绩统计站

一个面向《崩坏：星穹铁道》“异相仲裁王棋（普通）”的非官方粉丝统计网站，支持：

- 按王棋期数查看不同主C的 0T 最低金数条形图
- 按主C查看跨期最低金折线图
- 管理后台维护角色、王棋敌人、通关记录与公告
- Supabase Auth 单管理员登录
- Supabase Postgres 持久化数据，Vercel 免费部署

## 技术栈

- `Next.js 16` + `TypeScript` + App Router
- `Tailwind CSS v4`
- `ECharts`
- `Supabase`（Postgres + Auth）
- `Vitest` + `Testing Library`

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 复制环境变量模板

```bash
cp .env.example .env.local
```

3. 在 Supabase 中执行数据库脚本

- 打开 Supabase 项目
- 进入 SQL Editor
- 执行 [supabase/schema.sql](./supabase/schema.sql)

4. 配置环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

5. 启动开发环境

```bash
npm run dev
```

浏览器访问 `http://localhost:3000`。

## 管理员账号创建

1. 打开 Supabase Dashboard
2. 进入 `Authentication > Users`
3. 手动创建一个邮箱密码账号
4. 使用该账号登录 `/admin/login`

首版默认只使用单管理员账号，不额外设计多角色权限系统。

## 数据库结构

### 表

- `characters`
- `arbiter_stages`
- `clear_records`
- `announcements`

### 视图

- `stage_character_min_records`
- `character_stage_min_records`
- `character_avg_min_gold_rankings`

这些视图用于把“每期最低金数”和“角色平均最低金”统计逻辑固化在数据库层，前端直接消费聚合结果。

## API

### 公共接口

- `GET /api/home`
- `GET /api/stages/[version]`
- `GET /api/characters/[slug]`
- `GET /api/announcements`

### 后台接口

- `GET/POST/PUT/DELETE /api/admin/characters`
- `GET/POST/PUT/DELETE /api/admin/stages`
- `GET/POST/PUT/DELETE /api/admin/records`
- `GET/POST/PUT/DELETE /api/admin/announcements`
- `GET /api/admin/bootstrap`

## 部署到 Vercel

1. 将仓库推送到 GitHub
2. 在 Vercel 中导入仓库
3. 配置以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. 触发部署

推荐保持前端在 `Vercel` 免费层，数据库与认证在 `Supabase` 免费层。

## Demo 模式

如果没有配置 Supabase 环境变量，前台会自动展示仓库内置的演示数据，方便先看页面结构。

注意：

- Demo 模式下前台可浏览
- 管理后台不可真正写入数据
- 登录功能也不会启用

## 测试

```bash
npm run lint
npm run test
```

## 免责声明

本站为粉丝自发、非商业性质项目，与米哈游及《崩坏：星穹铁道》官方无关。游戏名称、角色名称及相关素材版权归原权利方所有。如权利方要求调整或删除内容，站点会尽快配合处理。
