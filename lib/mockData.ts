import type {
  Match,
  Standing,
  Team,
  PlayerStat,
  NewsItem,
  ChatMessage,
} from "@/types";

export const teams: Record<string, Team> = {
  arg: { id: "arg", name: "Argentina", shortName: "ARG", flag: "ar", group: "A", color: "#75AADB" },
  bra: { id: "bra", name: "Brazil", shortName: "BRA", flag: "br", group: "B", color: "#FFDF00" },
  fra: { id: "fra", name: "France", shortName: "FRA", flag: "fr", group: "A", color: "#0055A4" },
  ger: { id: "ger", name: "Germany", shortName: "GER", flag: "de", group: "C", color: "#000000" },
  esp: { id: "esp", name: "Spain", shortName: "ESP", flag: "es", group: "B", color: "#AA151B" },
  eng: { id: "eng", name: "England", shortName: "ENG", flag: "gb-eng", group: "C", color: "#FFFFFF" },
  por: { id: "por", name: "Portugal", shortName: "POR", flag: "pt", group: "D", color: "#006600" },
  ned: { id: "ned", name: "Netherlands", shortName: "NED", flag: "nl", group: "D", color: "#FF6600" },
};

const now = new Date();
const iso = (mins: number) => new Date(now.getTime() + mins * 60_000).toISOString();

export const liveMatch: Match = {
  id: "m-live",
  home: teams.arg,
  away: teams.fra,
  homeScore: 2,
  awayScore: 1,
  status: "live",
  minute: 67,
  kickoff: iso(-67),
  venue: "Lusail Stadium",
  stage: "Final",
  events: [
    { minute: 23, type: "goal", player: "Messi", teamId: "arg" },
    { minute: 36, type: "yellow", player: "Mbappé", teamId: "fra" },
    { minute: 41, type: "goal", player: "Di María", teamId: "arg" },
    { minute: 58, type: "goal", player: "Mbappé", teamId: "fra" },
  ],
  stats: {
    possession: [54, 46],
    shots: [12, 9],
    shotsOnTarget: [6, 4],
    corners: [5, 3],
    fouls: [8, 11],
  },
};

export const matches: Match[] = [
  liveMatch,
  {
    id: "m1",
    home: teams.bra,
    away: teams.esp,
    homeScore: 3,
    awayScore: 2,
    status: "finished",
    kickoff: iso(-60 * 24),
    venue: "Maracanã",
    stage: "Semi-Finals",
  },
  {
    id: "m2",
    home: teams.ger,
    away: teams.eng,
    homeScore: 1,
    awayScore: 1,
    status: "finished",
    kickoff: iso(-60 * 26),
    venue: "Allianz Arena",
    stage: "Quarter-Finals",
  },
  {
    id: "m3",
    home: teams.por,
    away: teams.ned,
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    kickoff: iso(60 * 5),
    venue: "Estádio do Dragão",
    stage: "Quarter-Finals",
  },
  {
    id: "m4",
    home: teams.esp,
    away: teams.eng,
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    kickoff: iso(60 * 28),
    venue: "Santiago Bernabéu",
    stage: "Semi-Finals",
  },
];

export const standingsGroupA: Standing[] = [
  { pos: 1, team: teams.arg, mp: 3, w: 3, d: 0, l: 0, gf: 7, ga: 1, gd: 6, pts: 9 },
  { pos: 2, team: teams.fra, mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6 },
  { pos: 3, team: teams.por, mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 4, gd: -1, pts: 3 },
  { pos: 4, team: teams.ned, mp: 3, w: 0, d: 0, l: 3, gf: 1, ga: 8, gd: -7, pts: 0 },
];

export const topScorers: PlayerStat[] = [
  { id: "p1", name: "Lionel Messi", photo: "/players/messi.png", team: teams.arg, value: 8 },
  { id: "p2", name: "Kylian Mbappé", photo: "/players/mbappe.png", team: teams.fra, value: 7 },
  { id: "p3", name: "Vinícius Jr.", photo: "/players/vini.png", team: teams.bra, value: 5 },
  { id: "p4", name: "Harry Kane", photo: "/players/kane.png", team: teams.eng, value: 5 },
];

export const news: NewsItem[] = [
  {
    id: "n1",
    title: "Messi seals magical night with World Cup brace",
    excerpt: "Argentina captain inspires a comeback against France in a Lusail thriller.",
    image: "/news/messi.jpg",
    source: "FIFA",
    publishedAt: iso(-30),
    tag: "Match Report",
  },
  {
    id: "n2",
    title: "Brazil unveil new tactical setup for Spain showdown",
    excerpt: "A bold 3-4-3 formation hints at attacking intent from the Seleção.",
    image: "/news/brazil.jpg",
    source: "ESPN",
    publishedAt: iso(-120),
    tag: "Tactics",
  },
  {
    id: "n3",
    title: "Golden Boot race tightens as Mbappé closes gap",
    excerpt: "Two strikes in the semis keep the French forward in contention.",
    image: "/news/mbappe.jpg",
    source: "The Athletic",
    publishedAt: iso(-200),
    tag: "Stats",
  },
];

export const banter: ChatMessage[] = [
  { id: "c1", user: "MessiFan10", teamFlag: "ar", text: "VAMOS ARGENTINA!! 🏆", ts: iso(-1) },
  { id: "c2", user: "LesBleus", teamFlag: "fr", text: "Allez Kylian, we believe!", ts: iso(-2) },
  { id: "c3", user: "Selecao5", teamFlag: "br", text: "Brazil next champions, mark my words", ts: iso(-3) },
  { id: "c4", user: "ThreeLions", teamFlag: "gb-eng", text: "It's coming home 🦁", ts: iso(-4) },
];
