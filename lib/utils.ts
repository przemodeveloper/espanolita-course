import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const pluralRules = new Intl.PluralRules("pl");

const punktForms: Record<string, string> = {
  one: "punkt",
  few: "punkty",
  many: "punktów",
  other: "punktów",
};

export function formatPoints(count: number) {
  const rule = pluralRules.select(count);
  return `${count} ${punktForms[rule]}`;
}
