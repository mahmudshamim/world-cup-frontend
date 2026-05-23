import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function flagUrl(value: string, size: 80 | 160 = 80) {
  if (!value) return `https://flagcdn.com/w${size}/un.png`;
  if (value.startsWith("http")) return value;
  return `https://flagcdn.com/w${size}/${value.toLowerCase()}.png`;
}

export function formatKickoff(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return { date, time, full: `${date} · ${time}` };
}
