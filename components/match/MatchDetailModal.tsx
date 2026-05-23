"use client";

import { useEffect } from "react";
import { X, MapPin, Trophy, Users, Radio, Calendar, Timer } from "lucide-react";
import type { Match } from "@/types";
import { flagUrl, formatDateTime, cn } from "@/lib/utils";
import { Countdown } from "./Countdown";

export function MatchDetailModal({
  match,
  onClose,
}: {
  match: Match | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!match) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [match, onClose]);

  if (!match) return null;

  const isLive = match.status === "live";
  const isDone = match.status === "finished";
  const isUp = match.status === "upcoming";
  const g = match.home.group ?? match.away.group;
  const dt = formatDateTime(match.kickoff);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto card bg-pitch-950 text-white border-white/10 animate-slide-up"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner */}
        <header className="px-6 pt-6 pb-4 bg-pitch-gradient">
          <div className="flex items-center gap-2 mb-4">
            <span className="chip bg-gold-500/20 text-gold-400 border border-gold-400/40 text-[10px]">
              <Trophy className="w-3 h-3" /> {match.stage}
            </span>
            {g && (
              <span className="chip bg-white/10 text-white/80 text-[10px]">
                <Users className="w-3 h-3" /> Group {g}
              </span>
            )}
            {isLive && (
              <span className="chip bg-red-500/20 text-red-300 border border-red-400/40 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-live" /> LIVE
              </span>
            )}
            {isDone && (
              <span className="chip bg-pitch-500/20 text-pitch-300 border border-pitch-400/40 text-[10px]">
                FULL-TIME
              </span>
            )}
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <TeamBlock name={match.home.name} flag={match.home.flag} align="right" />
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="font-display font-black text-4xl sm:text-5xl tabular-nums tracking-tighter flex items-baseline gap-2">
                <span>{match.homeScore ?? "-"}</span>
                <span className="text-white/30 text-3xl">:</span>
                <span>{match.awayScore ?? "-"}</span>
              </div>
              {isLive && match.minute !== undefined && (
                <span className="mt-1 chip bg-red-500/15 border border-red-400/40 text-red-300 text-[11px] font-bold tabular-nums">
                  {match.minute}'
                </span>
              )}
            </div>
            <TeamBlock name={match.away.name} flag={match.away.flag} align="left" />
          </div>
        </header>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Info icon={Calendar} label="Date & Time" value={`${dt.date} · ${dt.time}`} />
            <Info icon={MapPin} label="Venue" value={match.venue} />
          </div>

          {isUp && (
            <div className="px-4 py-3 rounded-xl bg-pitch-500/10 border border-pitch-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/70 text-sm font-semibold">
                <Timer className="w-4 h-4" /> Kick-off in
              </div>
              <Countdown targetIso={match.kickoff} />
            </div>
          )}

          {match.stats && (
            <section>
              <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
                <Radio className="w-4 h-4 text-pitch-400" /> Match Stats
              </h3>
              <div className="space-y-2.5">
                <StatBar label="Possession" home={match.stats.possession[0]} away={match.stats.possession[1]} unit="%" />
                <StatBar label="Shots" home={match.stats.shots[0]} away={match.stats.shots[1]} />
                <StatBar label="Shots on Target" home={match.stats.shotsOnTarget[0]} away={match.stats.shotsOnTarget[1]} />
                <StatBar label="Corners" home={match.stats.corners[0]} away={match.stats.corners[1]} />
                <StatBar label="Fouls" home={match.stats.fouls[0]} away={match.stats.fouls[1]} />
              </div>
            </section>
          )}

          {match.events && match.events.length > 0 && (
            <section>
              <h3 className="font-display font-bold text-sm mb-3">Key Events</h3>
              <ul className="space-y-1.5">
                {match.events
                  .sort((a, b) => a.minute - b.minute)
                  .map((e, i) => {
                    const isHome = e.teamId === match.home.id;
                    return (
                      <li
                        key={i}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5",
                          isHome ? "" : "flex-row-reverse text-right"
                        )}
                      >
                        <span className="font-display font-bold tabular-nums text-sm text-white/60 w-8">
                          {e.minute}'
                        </span>
                        <span className="text-lg">
                          {e.type === "goal" ? "⚽" : e.type === "red" ? "🟥" : e.type === "yellow" ? "🟨" : "↔"}
                        </span>
                        <span className="flex-1 text-sm font-medium">{e.player}</span>
                      </li>
                    );
                  })}
              </ul>
            </section>
          )}

          {!match.stats && !match.events?.length && (
            <p className="text-center text-sm text-white/40 py-6">
              Detailed stats and lineups appear here once the match is in progress.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamBlock({ name, flag, align }: { name: string; flag: string; align: "left" | "right" }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 sm:flex-row sm:gap-3",
        align === "right" ? "sm:flex-row-reverse sm:text-right" : "sm:text-left"
      )}
    >
      <img
        src={flagUrl(flag, 160)}
        alt={name}
        className="w-14 h-10 sm:w-16 sm:h-11 rounded-lg object-cover ring-2 ring-white/20 shadow-lg"
      />
      <p className="font-display font-bold text-base sm:text-lg leading-tight">{name}</p>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="card bg-white/5 border-white/10 p-3">
      <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className="text-sm font-semibold mt-1">{value}</p>
    </div>
  );
}

function StatBar({ label, home, away, unit = "" }: { label: string; home: number; away: number; unit?: string }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold mb-1">
        <span className="tabular-nums">{home}{unit}</span>
        <span className="text-white/60 uppercase tracking-wider text-[10px]">{label}</span>
        <span className="tabular-nums">{away}{unit}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/5">
        <div className="bg-pitch-500" style={{ width: `${homePct}%` }} />
        <div className="bg-royal-500" style={{ width: `${100 - homePct}%` }} />
      </div>
    </div>
  );
}
