export const siteConfig = {
  name: "异相仲裁王棋 0T 统计站",
  description:
    "面向《崩坏：星穹铁道》异相仲裁王棋（普通）的 0T 最低金数统计与视频索引站。",
  nav: [
    { href: "/", label: "首页" },
    { href: "/announcements", label: "公告合集" },
    { href: "/submit", label: "游客投稿" },
    { href: "/dispute", label: "记录指正" },
    { href: "/admin", label: "管理后台" },
  ],
};

export const disclaimerShort =
  "本站为粉丝自发、非商业性质项目，与米哈游及《崩坏：星穹铁道》官方无关。";


export const adminSectionLabels = {
  characters: "角色管理",
  stages: "王棋敌人",
  records: "通关记录",
  submissions: "游客投稿",
  disputes: "记录指正",
  announcements: "公告管理",
} as const;
