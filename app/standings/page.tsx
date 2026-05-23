import { api } from "@/lib/api";
import { StandingsClient } from "./StandingsClient";

export const dynamic = "force-dynamic";
export const revalidate = 120;

export default async function StandingsPage() {
  const standings = await api.standings();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-bold text-2xl sm:text-3xl">Standings</h1>
        <p className="text-[rgb(var(--muted))] mt-1 text-sm">
          Group stage tables — top two qualify. Stats update live as matches finish.
        </p>
      </header>
      <StandingsClient standings={standings} />
    </div>
  );
}
