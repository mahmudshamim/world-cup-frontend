"use client";

import { useEffect, useState } from "react";
import {
  Radio,
  MapPin,
  Goal,
  Square,
  ChevronRight,
} from "lucide-react";
import type { Match } from "@/types";
import { flagUrl, cn, formatDateTime } from "@/lib/utils";
import { useLiveMatch } from "@/hooks/useLiveMatch";
import { Countdown } from "@/components/match/Countdown";

interface Props {
  match: Match;
}

export function LiveMatchHero({ match: initial }: Props) {
  const match = useLiveMatch(initial);
  const [minute, setMinute] = useState(match.minute ?? 0);

  useEffect(() => {
    setMinute(match.minute ?? 0);
    if (match.status !== "live") return;
    const t = setInterval(() => setMinute((m) => (m < 90 ? m + 1 : m)), 60_000);
    return () => clearInterval(t);
  }, [match.status, match.minute]);

  const isLive = match.status === "live";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-pitch-gradient text-white shadow-glass">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#facc15_0%,transparent_40%),radial-gradient(circle_at_70%_80%,#3b82f6_0%,transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="chip bg-red-500/20 text-red-200 border border-red-400/40">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-live" />
                <Radio className="w-3 h-3" /> LIVE
              </span>
            ) : (
              <span className="chip bg-white/10 text-white/80">
                {match.status.toUpperCase()}
              </span>
            )}
            <span className="chip bg-gold-500/20 text-gold-400 border border-gold-400/40">
              {match.stage}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <MapPin className="w-3.5 h-3.5" /> {match.venue}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 sm:gap-8 items-center">
          <TeamSide
            name={match.home.name}
            short={match.home.shortName}
            flag={match.home.flag}
            align="right"
          />

          <div className="flex flex-col items-center gap-2">
            <div className="font-display font-black text-5xl sm:text-7xl tabular-nums tracking-tighter flex items-center gap-2 sm:gap-4">
              <span>{match.homeScore ?? "-"}</span>
              <span className="text-white/30 text-3xl sm:text-5xl">:</span>
              <span>{match.awayScore ?? "-"}</span>
            </div>
            <span className="chip bg-white/10 text-xs">
              {isLive ? `${minute}'` : new Date(match.kickoff).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {match.status === "upcoming" && (() => {
              const dt = formatDateTime(match.kickoff);
              return (
                <div className="mt-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm space-y-1.5">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/60 font-semibold leading-none">
                      Kick-off
                    </p>
                    <p className="text-sm font-bold text-white tabular-nums mt-0.5">
                      {dt.date} · {dt.time}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Countdown targetIso={match.kickoff} />
                  </div>
                </div>
              );
            })()}
          </div>

          <TeamSide
            name={match.away.name}
            short={match.away.shortName}
            flag={match.away.flag}
            align="left"
          />
        </div>

        {match.events && match.events.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/90">Key Events</h3>
              <button className="text-xs text-gold-400 hover:text-gold-500 flex items-center gap-1">
                Full timeline <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {match.events.map((e, i) => {
                const isHome = e.teamId === match.home.id;
                const Icon = e.type === "goal" ? Goal : Square;
                const color =
                  e.type === "goal"
                    ? "text-pitch-100 bg-pitch-600/30 border-pitch-400/40"
                    : e.type === "red"
                    ? "text-red-200 bg-red-500/20 border-red-400/40"
                    : "text-yellow-200 bg-yellow-500/20 border-yellow-400/40";
                return (
                  <li
                    key={i}
                    className={cn(
                      "chip border text-xs gap-1.5",
                      color,
                      isHome ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-semibold">{e.minute}'</span>
                    <span>{e.player}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function TeamSide({
  name,
  short,
  flag,
  align,
}: {
  name: string;
  short: string;
  flag: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center sm:flex-row gap-3 sm:gap-4",
        align === "right" ? "sm:flex-row-reverse sm:text-right" : "sm:text-left"
      )}
    >
      <img
        src={flagUrl(flag, 160)}
        alt={name}
        className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg object-cover ring-2 ring-white/20 shadow-lg"
      />
      <div>
        <p className="font-display font-bold text-lg sm:text-2xl leading-tight">
          {short}
        </p>
        <p className="text-xs text-white/60 hidden sm:block">{name}</p>
      </div>
    </div>
  );
}
