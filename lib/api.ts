import type { Match, Standing, PlayerStat } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function get<T>(path: string, revalidate = 30): Promise<T[]> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: T[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export const api = {
  async liveMatch(): Promise<Match | null> {
    const list = await get<Match>("/api/matches/live", 15);
    return list[0] ?? null;
  },
  async matches(): Promise<Match[]> {
    return get<Match>("/api/matches", 60);
  },
  async standings(group?: string): Promise<Standing[]> {
    const q = group ? `?group=${group}` : "";
    return get<Standing>(`/api/standings${q}`, 300);
  },
  async topScorers(): Promise<PlayerStat[]> {
    return get<PlayerStat>("/api/stats/top-scorers", 600);
  },
};
