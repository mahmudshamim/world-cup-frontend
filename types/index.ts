export type MatchStatus = "live" | "upcoming" | "finished" | "halftime";
export type Stage =
  | "Group Stage"
  | "Round of 16"
  | "Quarter-Finals"
  | "Semi-Finals"
  | "Final";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string; // ISO code -> flagcdn url
  group?: string; // "A".."L" — 2026 has 12 groups
  color?: string;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub" | "var";
  player: string;
  teamId: string;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
}

export interface Match {
  id: string;
  home: Team;
  away: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  minute?: number;
  kickoff: string; // ISO
  venue: string;
  stage: Stage;
  events?: MatchEvent[];
  stats?: MatchStats;
}

export interface Standing {
  pos: number;
  team: Team;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  group?: string;
}

export interface PlayerStat {
  id: string;
  name: string;
  photo: string;
  team: Team;
  value: number;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  source: string;
  publishedAt: string;
  tag: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  teamFlag: string;
  text: string;
  ts: string;
}
