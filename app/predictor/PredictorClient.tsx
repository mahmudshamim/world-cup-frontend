"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trophy, Check, Loader2 } from "lucide-react";
import type { Match } from "@/types";
import { flagUrl, formatKickoff, formatDateTime, cn } from "@/lib/utils";
import { Countdown } from "@/components/match/Countdown";

interface LeaderRow {
  user_id: string;
  points: number;
  badges?: string[];
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function getUserId() {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem("wc_user_id");
  if (!id) {
    id = "u_" + crypto.randomUUID().slice(0, 8);
    localStorage.setItem("wc_user_id", id);
  }
  return id;
}

export function PredictorClient({ upcoming }: { upcoming: Match[] }) {
  const [picks, setPicks] = useState<Record<string, [number, number]>>({});
  const [saved, setSaved] = useState<Record<string, "saving" | "ok" | "err">>({});
  const [leaderboard, setLeaderboard] = useState<LeaderRow[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(getUserId());
    fetch(`${API}/api/predictions/leaderboard`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => setLeaderboard(j.data ?? []))
      .catch(() => setLeaderboard([]));
  }, []);

  const setPick = (id: string, idx: 0 | 1, val: number) => {
    const cur = picks[id] ?? [0, 0];
    cur[idx] = val;
    setPicks({ ...picks, [id]: [...cur] as [number, number] });
  };

  const submit = async (matchId: string) => {
    const p = picks[matchId] ?? [0, 0];
    setSaved((s) => ({ ...s, [matchId]: "saving" }));
    try {
      const res = await fetch(`${API}/api/predictions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          userId,
          homeScore: p[0],
          awayScore: p[1],
        }),
      });
      setSaved((s) => ({ ...s, [matchId]: res.ok ? "ok" : "err" }));
    } catch {
      setSaved((s) => ({ ...s, [matchId]: "err" }));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2 space-y-4">
        <header>
          <h1 className="font-display font-bold text-2xl sm:text-3xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-gold-500" /> Predictor Zone
          </h1>
          <p className="text-[rgb(var(--muted))] mt-1 text-sm">
            Pick scores. Earn badges. Climb the board.
          </p>
        </header>

        {upcoming.length === 0 ? (
          <div className="card p-8 text-center text-[rgb(var(--muted))]">
            No upcoming matches available for predictions.
          </div>
        ) : (
          upcoming.slice(0, 10).map((m) => {
            const p = picks[m.id] ?? [0, 0];
            const state = saved[m.id];
            return (
              <article key={m.id} className="card p-4 sm:p-5 bg-pitch-950 text-white border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    {m.stage}
                  </span>
                  <span className="text-xs text-white/60">{formatKickoff(m.kickoff)}</span>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 justify-end min-w-0">
                    <span className="font-semibold text-right truncate text-sm sm:text-base">
                      {m.home.shortName}
                    </span>
                    <img
                      src={flagUrl(m.home.flag)}
                      alt=""
                      className="w-8 h-5 rounded-sm object-cover ring-1 ring-white/10 shrink-0"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <ScoreInput value={p[0]} onChange={(v) => setPick(m.id, 0, v)} />
                    <span className="text-white/40 text-xs">vs</span>
                    <ScoreInput value={p[1]} onChange={(v) => setPick(m.id, 1, v)} />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <img
                      src={flagUrl(m.away.flag)}
                      alt=""
                      className="w-8 h-5 rounded-sm object-cover ring-1 ring-white/10 shrink-0"
                    />
                    <span className="font-semibold truncate text-sm sm:text-base">
                      {m.away.shortName}
                    </span>
                  </div>
                </div>

                {(() => {
                  const dt = formatDateTime(m.kickoff);
                  return (
                    <div className="mt-3 px-3 py-2 rounded-xl bg-pitch-500/10 border border-pitch-500/20 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-wider text-white/50 font-semibold leading-none">
                          Kick-off
                        </p>
                        <p className="text-xs font-bold text-white tabular-nums leading-snug">
                          {dt.date} · {dt.time}
                        </p>
                      </div>
                      <Countdown targetIso={m.kickoff} />
                    </div>
                  );
                })()}

                <button
                  onClick={() => submit(m.id)}
                  disabled={state === "saving"}
                  className={cn(
                    "btn-primary mt-4 w-full flex items-center justify-center gap-2",
                    state === "ok" && "!bg-pitch-700"
                  )}
                >
                  {state === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
                  {state === "ok" && <Check className="w-4 h-4" />}
                  {state === "ok"
                    ? "Prediction Saved"
                    : state === "saving"
                    ? "Saving…"
                    : state === "err"
                    ? "Failed — Retry"
                    : "Submit Prediction"}
                </button>
              </article>
            );
          })
        )}
      </section>

      <aside className="card p-5 h-fit lg:sticky lg:top-20 bg-pitch-950 text-white border-white/5">
        <h2 className="font-display font-bold text-xl mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold-400" /> Leaderboard
        </h2>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-white/50">
            No predictions submitted yet. Be the first — pick a match and submit.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {leaderboard.map((l, i) => {
              const isMe = l.user_id === userId;
              return (
                <li
                  key={l.user_id}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                    isMe ? "bg-pitch-500/15 ring-1 ring-pitch-500/30" : "hover:bg-white/5"
                  )}
                >
                  <span className="font-display font-bold w-6 text-white/70">{i + 1}</span>
                  <span className="text-xl">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "⚡"}
                  </span>
                  <span className="flex-1 font-medium truncate">
                    {isMe ? "You" : l.user_id}
                  </span>
                  <span className="font-bold tabular-nums text-pitch-300">{l.points}</span>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
}

function ScoreInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      min={0}
      max={20}
      value={value}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-white/10 bg-white/5 text-center font-display font-bold text-xl sm:text-2xl tabular-nums focus:outline-none focus:ring-2 focus:ring-pitch-500/40 text-white"
    />
  );
}
