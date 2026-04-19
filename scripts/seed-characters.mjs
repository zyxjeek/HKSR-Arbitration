// One-time seed script: batch insert all HSR characters into Supabase
// Usage: node scripts/seed-characters.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env.local manually
const envPath = join(__dirname, "../.env.local");
const envVars = {};
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const url = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = envVars["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// All characters extracted from homdgcatwiki.hasban.cn/data/CH/Avatar.js
// Deduplicated by name, excluding 开拓者
const characterNames = [
  "Archer",
  "Saber",
  "万敌",
  "三月七",
  "不死途",
  "丹恒",
  "丹恒 · 腾荒",
  "丹恒 · 饮月",
  "乱破",
  "云璃",
  "佩拉",
  "停云",
  "克拉拉",
  "刃",
  "刻律德菈",
  "加拉赫",
  "卡芙卡",
  "卢卡",
  "大丽花",
  "大黑塔",
  "姬子",
  "娜塔莎",
  "寒鸦",
  "布洛妮娅",
  "希儿",
  "希露瓦",
  "彦卿",
  "忘归人",
  "托帕&账账",
  "昔涟",
  "星期日",
  "景元",
  "杰帕德",
  "桂乃芬",
  "桑博",
  "椒丘",
  "波提欧",
  "流萤",
  "海瑟音",
  "火花",
  "灵砂",
  "爻光",
  "玲可",
  "瓦尔特",
  "白厄",
  "白露",
  "真理医生",
  "知更鸟",
  "砂金",
  "符玄",
  "米沙",
  "素裳",
  "缇宝",
  "罗刹",
  "翡翠",
  "艾丝妲",
  "花火",
  "藿藿",
  "虎克",
  "貊泽",
  "赛飞儿",
  "遐蝶",
  "那刻夏",
  "银枝",
  "银狼",
  "镜流",
  "长夜月",
  "阮 · 梅",
  "阿兰",
  "阿格莱雅",
  "雪衣",
  "青雀",
  "风堇",
  "飞霄",
  "驭空",
  "黄泉",
  "黑塔",
  "黑天鹅",
];

const rows = characterNames.map((name) => ({ name, slug: slugify(name) }));

console.log(`Inserting ${rows.length} characters...`);

const { data, error } = await supabase
  .from("characters")
  .insert(rows)
  .select("name");

if (error) {
  console.error("Insert failed:", error.message);
  process.exit(1);
}

console.log(`Success! Inserted ${data.length} characters.`);
for (const c of data) {
  console.log(`  + ${c.name}`);
}
