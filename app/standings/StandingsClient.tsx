"use client";

import { useMemo, useState } from "react";
import { Info, Users } from "lucide-react";
import type { Standing } from "@/types";
import { flagUrl, cn } from "@/lib/utils";
import { Dropdown } from "@/components/ui/Dropdown";

export function StandingsClient({ standings }: { standings: Standing[] }) {
  const groups = useMemo(() => {
    const set = new Set<string>();
    standings.forEach((s) => {
      const g = s.group ?? s.team.group;
      if (g) set.add(g);
    });
    return Array.from(set).sort();
  }, [standings]);

  const [group, setGroup] = useState<string>("all");

  const filtered = useMemo(() => {
    if (group === "all") return standings;
    return standings.filter((s) => (s.group ?? s.team.group) === group);
  }, [standings, group]);

  const played = filtered.reduce((sum, s) => sum + s.mp, 0);
  const tableTitle =
    group === "all"
      ? played > 0 ? "Live Standings" : "Confirmed Teams"
      : `Group ${group}`;

  return (
    <div className="space-y-5">
      {played === 0 && (
        <div className="card p-4 flex items-start gap-3 bg-pitch-50 dark:bg-pitch-950/60 border-pitch-200 dark:border-pitch-800">
          <Info className="w-5 h-5 text-pitch-600 shrink-0 mt-0.5" />
          <p className="text-sm">
            <span className="font-semibold">Group stage hasn't started yet.</span>{" "}
            Showing all confirmed participating teams. Standings populate automatically as matches finish.
          </p>
        </div>
      )}

      <section className="card p-4 sm:p-5 bg-pitch-950 text-white border-white/5">
        {groups.length === 0 ? (
          <>
            <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-widest text-white/60 font-semibold">
              <Users className="w-3.5 h-3.5" /> Filter by Group
            </div>
            <p className="text-xs text-white/40">
              Group assignments will appear once the draw data is published. Showing all teams.
            </p>
          </>
        ) : (
          <div className="max-w-xs">
            <Dropdown
              label="Group"
              icon={Users}
              value={group}
              options={[
                { value: "all", label: "All Groups" },
                ...groups.map((g) => ({ value: g, label: `Group ${g}` })),
              ]}
              onChange={setGroup}
            />
          </div>
        )}
      </section>

      <div className="card overflow-hidden bg-pitch-950 text-white border-white/5">
        <div className="px-5 py-3 border-b border-white/5 font-semibold flex items-center justify-between">
          <span>{tableTitle}</span>
          <span className="text-xs text-white/50 font-normal">{filtered.length} teams</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-white/5 text-white/60">
              <tr>
                {["#", "Team", "MP", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
                  <th key={h} className="px-3 py-3 text-left font-semibold tracking-wide text-xs uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr
                  key={s.team.id}
                  className={cn(
                    "border-t border-white/5 hover:bg-white/5 transition",
                    idx < 2 && played > 0 && "bg-pitch-500/5 border-l-4 border-l-pitch-500"
                  )}
                >
                  <td className="px-3 py-3 font-semibold text-white/80">{idx + 1}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={flagUrl(s.team.flag)}
                        alt=""
                        className="w-7 h-5 rounded-sm object-cover ring-1 ring-white/10"
                      />
                      <span className="font-medium">{s.team.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{s.mp}</td>
                  <td className="px-3 py-3 tabular-nums">{s.w}</td>
                  <td className="px-3 py-3 tabular-nums">{s.d}</td>
                  <td className="px-3 py-3 tabular-nums">{s.l}</td>
                  <td className="px-3 py-3 tabular-nums">{s.gf}</td>
                  <td className="px-3 py-3 tabular-nums">{s.ga}</td>
                  <td className="px-3 py-3 tabular-nums font-medium">
                    {s.gd > 0 ? `+${s.gd}` : s.gd}
                  </td>
                  <td className="px-3 py-3 tabular-nums font-bold text-pitch-300">{s.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

