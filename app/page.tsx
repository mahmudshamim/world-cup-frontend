import { CalendarClock } from "lucide-react";
import { LiveMatchHero } from "@/components/home/LiveMatchHero";
import { MatchCarousel } from "@/components/home/MatchCarousel";
import { FanBanter } from "@/components/home/FanBanter";
import { api } from "@/lib/api";

export const revalidate = 30;

export default async function HomePage() {
  const [live, allMatches] = await Promise.all([api.liveMatch(), api.matches()]);
  const upcoming = allMatches
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  const finished = allMatches
    .filter((m) => m.status === "finished")
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());

  return (
    <div className="space-y-10">
      {live ? (
        <LiveMatchHero match={live} />
      ) : (
        <div className="card p-8 text-center bg-pitch-gradient text-white">
          <CalendarClock className="w-10 h-10 mx-auto mb-3 text-gold-400" />
          <h2 className="font-display font-bold text-xl mb-1">Waiting for kick-off</h2>
          <p className="text-sm text-white/70">
            Match data is syncing. Live scores will appear here once a match starts.
          </p>
        </div>
      )}

      {finished.length > 0 ? (
        <MatchCarousel title="Recent Results" matches={finished.slice(0, 10)} />
      ) : (
        <EmptyCarousel title="Recent Results" message="No completed matches yet." />
      )}

      {upcoming.length > 0 ? (
        <MatchCarousel title="Upcoming Fixtures" matches={upcoming.slice(0, 10)} />
      ) : (
        <EmptyCarousel title="Upcoming Fixtures" message="No upcoming matches available." />
      )}

      <FanBanter />
    </div>
  );
}

function EmptyCarousel({ title, message }: { title: string; message: string }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display font-bold text-xl">{title}</h2>
      <div className="card p-8 text-center text-[rgb(var(--muted))] text-sm">{message}</div>
    </section>
  );
}
