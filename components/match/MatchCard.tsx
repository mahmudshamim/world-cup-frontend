import { Clock, MapPin } from "lucide-react";
import type { Match } from "@/types";
import { flagUrl, formatKickoff, formatDateTime, cn } from "@/lib/utils";
import { Countdown } from "./Countdown";

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const isLive = match.status === "live";
  const isDone = match.status === "finished";
  const isUp = match.status === "upcoming";

  return (
    <article
      className={cn(
        "card p-4 hover:shadow-glass hover:-translate-y-0.5 transition cursor-pointer group flex flex-col",
        compact ? "min-w-[260px]" : "w-full"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
          {match.stage}
        </span>
        {isLive ? (
          <span className="chip bg-red-500/10 text-red-600 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live" />
            LIVE {match.minute}'
          </span>
        ) : isDone ? (
          <span className="chip bg-[rgb(var(--muted))]/10 text-[rgb(var(--muted))]">FT</span>
        ) : (
          <span className="chip bg-pitch-50 dark:bg-pitch-900/40 text-pitch-700 dark:text-pitch-100">
            <Clock className="w-3 h-3" /> {formatKickoff(match.kickoff)}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <TeamRow team={match.home} score={match.homeScore} winner={isDone && (match.homeScore ?? 0) > (match.awayScore ?? 0)} />
        <TeamRow team={match.away} score={match.awayScore} winner={isDone && (match.awayScore ?? 0) > (match.homeScore ?? 0)} />
      </div>

      {isUp && (() => {
        const dt = formatDateTime(match.kickoff);
        return (
          <div className="mt-3 px-3 py-2 rounded-xl bg-pitch-500/10 border border-pitch-500/20 dark:bg-pitch-500/10 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-pitch-700 dark:text-pitch-300 font-semibold leading-none">
                Starts
              </p>
              <p className="text-xs font-bold text-pitch-900 dark:text-white tabular-nums leading-snug">
                {dt.date} · {dt.time}
              </p>
            </div>
            <Countdown targetIso={match.kickoff} />
          </div>
        );
      })()}

      <div className="mt-3 pt-3 border-t border-[rgb(var(--border))] flex items-center gap-1.5 text-xs text-[rgb(var(--muted))]">
        <MapPin className="w-3 h-3" /> {match.venue}
      </div>
    </article>
  );
}

function TeamRow({
  team,
  score,
  winner,
}: {
  team: { name: string; shortName: string; flag: string };
  score: number | null;
  winner: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", !winner && score !== null && "opacity-60")}>
      <div className="flex items-center gap-2 min-w-0">
        <img src={flagUrl(team.flag)} alt={team.name} className="w-6 h-4 rounded-sm object-cover" />
        <span className="font-medium truncate">{team.name}</span>
      </div>
      <span className="font-display font-bold tabular-nums text-lg">
        {score ?? "-"}
      </span>
    </div>
  );
}
