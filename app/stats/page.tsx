import { Trophy } from "lucide-react";
import { api } from "@/lib/api";
import { flagUrl } from "@/lib/utils";

export const revalidate = 600;

export default async function StatsPage() {
  const scorers = await api.topScorers();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-bold text-3xl">Top Performers</h1>
        <p className="text-[rgb(var(--muted))] mt-1">Golden Boot, Golden Glove and more.</p>
      </header>

      <section>
        <h2 className="font-display font-bold text-xl mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold-500" /> Golden Boot
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scorers.map((p, i) => (
            <article key={p.id} className="card p-5 hover:shadow-glass transition group">
              <div className="flex items-start justify-between">
                <span className="font-display font-black text-4xl text-pitch-600/20 group-hover:text-pitch-600/40 transition">
                  #{i + 1}
                </span>
                <img src={flagUrl(p.team.flag)} alt={p.team.name} className="w-8 h-5 rounded-sm object-cover" />
              </div>
              <p className="mt-4 font-semibold">{p.name}</p>
              <p className="text-xs text-[rgb(var(--muted))]">{p.team.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display font-bold text-3xl tabular-nums">{p.value}</span>
                <span className="text-xs text-[rgb(var(--muted))]">goals</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
