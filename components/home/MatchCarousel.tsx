"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Match } from "@/types";
import { MatchCard } from "@/components/match/MatchCard";

export function MatchCarousel({ title, matches }: { title: string; matches: Match[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl">{title}</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)} className="btn-ghost p-2" aria-label="Scroll left">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)} className="btn-ghost p-2" aria-label="Scroll right">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 scroll-smooth"
      >
        {matches.map((m) => (
          <div key={m.id} className="snap-start">
            <MatchCard match={m} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
