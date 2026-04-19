import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-\u4e00-\u9fa5]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function versionLabelToSortKey(versionLabel: string) {
  const parts = versionLabel
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .filter((part) => Number.isFinite(part));

  const [major = 0, minor = 0, patch = 0] = parts;

  return major * 10000 + minor * 100 + patch;
}

export function roundToSingleDecimal(value: number) {
  return Math.round(value * 10) / 10;
}
