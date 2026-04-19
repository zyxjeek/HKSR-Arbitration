import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatPublishedAt(input: string) {
  return format(new Date(input), "yyyy 年 M 月 d 日 HH:mm", { locale: zhCN });
}

export function formatStageLabel(versionLabel: string, bossName: string) {
  return `Ver.${versionLabel} · ${bossName}`;
}

export function formatAverageGold(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
