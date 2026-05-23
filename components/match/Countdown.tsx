"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function diff(target: number) {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, s: sec };
}

export function Countdown({ targetIso }: { targetIso: string }) {
  const target = new Date(targetIso).getTime();
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!t) return null;

  const parts: { v: number; unit: string }[] =
    t.d > 0
      ? [
          { v: t.d, unit: "d" },
          { v: t.h, unit: "h" },
          { v: t.m, unit: "m" },
        ]
      : [
          { v: t.h, unit: "h" },
          { v: t.m, unit: "m" },
          { v: t.s, unit: "s" },
        ];

  return (
    <div className="flex items-center gap-1.5 text-pitch-300">
      <Timer className="w-3 h-3 shrink-0" />
      <div className="flex items-baseline gap-0.5 tabular-nums font-bold text-xs">
        {parts.map((p, i) => (
          <span key={p.unit} className="flex items-baseline">
            <span>{String(p.v).padStart(2, "0")}</span>
            <span className="text-pitch-300/60 text-[10px] ml-0.5">{p.unit}</span>
            {i < parts.length - 1 && <span className="mx-0.5 text-pitch-300/40">:</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
