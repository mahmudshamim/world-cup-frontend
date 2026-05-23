"use client";

import { useMemo, useState } from "react";
import { Calendar, MapPin, Radio, Users } from "lucide-react";
import type { Match } from "@/types";
import { flagUrl, cn, formatDateTime } from "@/lib/utils";
import { Countdown } from "@/components/match/Countdown";
import { Dropdown } from "@/components/ui/Dropdown";

const STAGES = [
  "All",
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarter-Finals",
  "Semi-Finals",
  "Final",
] as const;
type Stage = (typeof STAGES)[number];

const fmtChip = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
const dayKey = (iso: string) => iso.slice(0, 10);

function matchGroup(m: Match): string | null {
  // Prefer either team's group field (backend may set it); fall back to null.
  return m.home.group ?? m.away.group ?? null;
}

export function FixturesClient({ matches }: { matches: Match[] }) {
  const [day, setDay] = useState<string>("all");
  const [stage, setStage] = useState<Stage>("All");
  const [group, setGroup] = useState<string>("all");

  const days = useMemo(() => {
    const set = new Set(matches.map((m) => dayKey(m.kickoff)));
    return Array.from(set).sort();
  }, [matches]);

  const groups = useMemo(() => {
    const set = new Set<string>();
    matches.forEach((m) => {
      const g = matchGroup(m);
      if (g) set.add(g);
    });
    return Array.from(set).sort();
  }, [matches]);

  const stageMatches = (matchStage: string, sel: Stage) => {
    if (sel === "All") return true;
    if (sel === "Group Stage") return matchStage.startsWith("Group");
    return matchStage === sel;
  };

  const filtered = useMemo(
    () =>
      matches
        .filter((m) => day === "all" || dayKey(m.kickoff) === day)
        .filter((m) => stageMatches(m.stage, stage))
        .filter((m) => group === "all" || matchGroup(m) === group)
        .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()),
    [matches, day, stage, group]
  );

  const dayOptions = [
    { value: "all", label: "All Days" },
    ...days.map((d) => ({ value: d, label: fmtChip(d) })),
  ];
  const groupOptions = [
    { value: "all", label: "All Groups" },
    ...groups.map((g) => ({ value: g, label: `Group ${g}` })),
  ];

  return (
    <div className="space-y-5">
      <section className="card p-4 sm:p-5 bg-pitch-950 text-white border-white/5">
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <Dropdown
            label="Match Day"
            icon={Calendar}
            value={day}
            options={dayOptions}
            onChange={setDay}
          />
          <Dropdown
            label="Group"
            icon={Users}
            value={group}
            options={groupOptions}
            onChange={setGroup}
          />
        </div>
      </section>

      <section className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-pitch-950/80 border border-white/5 overflow-x-auto max-w-full">
          {STAGES.map((s) => {
            const active = stage === s;
            return (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all",
                  active ? "bg-white text-pitch-950 shadow" : "text-white/60 hover:text-white"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="text-xs sm:text-sm text-[rgb(var(--muted))]">
          Showing <span className="font-bold text-pitch-600">{filtered.length}</span> Match Results
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-[rgb(var(--muted))] col-span-full">
            No matches for this filter.
          </div>
        ) : (
          filtered.map((m) => <MatchCard key={m.id} match={m} />)
        )}
      </section>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const isDone = match.status === "finished";
  const isUp = match.status === "upcoming";
  const g = matchGroup(match);

  return (
    <article className="group card bg-pitch-950 text-white border-white/5 hover:border-pitch-500/40 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
            {match.stage}
          </p>
          {g && <p className="text-xs font-semibold text-white/80">Group {g}</p>}
        </div>
        {isLive ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-400/40 text-red-300 text-[10px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-live" />
            LIVE
          </span>
        ) : isDone ? (
          <span className="px-2 py-0.5 rounded-full bg-pitch-500/15 border border-pitch-400/40 text-pitch-300 text-[10px] font-bold tracking-wide">
            FT
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold tracking-wide">
            <Radio className="w-2.5 h-2.5" />
            UPCOMING
          </span>
        )}
      </div>

      <div className="px-4 py-3 grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <div className="flex flex-col items-center gap-1.5 min-w-0">
          <img
            src={flagUrl(match.home.flag, 80)}
            alt={match.home.name}
            className="w-10 h-7 rounded object-cover ring-1 ring-white/10"
          />
          <span className="font-bold text-sm text-center truncate w-full">{match.home.name}</span>
        </div>

        <div className="flex flex-col items-center min-w-[60px]">
          <div className="font-display font-black text-2xl tabular-nums flex items-baseline gap-1.5">
            <span>{match.homeScore ?? "-"}</span>
            <span className="text-white/30 text-lg">:</span>
            <span>{match.awayScore ?? "-"}</span>
          </div>
          <span className="text-[9px] font-bold tracking-wider text-white/50 mt-0.5">
            {fmtLabel(match.kickoff)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 min-w-0">
          <img
            src={flagUrl(match.away.flag, 80)}
            alt={match.away.name}
            className="w-10 h-7 rounded object-cover ring-1 ring-white/10"
          />
          <span className="font-bold text-sm text-center truncate w-full">{match.away.name}</span>
        </div>
      </div>

      {isUp && (() => {
        const dt = formatDateTime(match.kickoff);
        return (
          <div className="mx-4 mb-3 px-3 py-2 rounded-xl bg-pitch-500/10 border border-pitch-500/20 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-white/50 font-semibold leading-none">
                Kick-off
              </p>
              <p className="text-xs font-bold text-white tabular-nums leading-snug">
                {dt.date} · {dt.time}
              </p>
            </div>
            <Countdown targetIso={match.kickoff} />
          </div>
        );
      })()}
      {isLive && match.minute !== undefined && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-400/30 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-red-300/80 font-semibold">
            In progress
          </span>
          <span className="font-display font-bold text-sm text-red-300 tabular-nums">
            {match.minute}'
          </span>
        </div>
      )}

      <div className="mt-auto px-4 py-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-white/40">
        <MapPin className="w-3 h-3 shrink-0" />
        <span className="truncate">{match.venue}</span>
      </div>
    </article>
  );
}
