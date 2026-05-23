"use client";

import { useCallback, useEffect, useState } from "react";
import type { Match } from "@/types";
import { getSocket } from "@/lib/socket";

export type NotificationKind = "kickoff_soon" | "match_started" | "match_finished" | "score_update";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  ts: string;
  matchId?: string;
  flag?: string;
}

const READ_KEY = "wc_notif_read";

function loadRead(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(READ_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}
function saveRead(set: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)));
}

function deriveFromFixtures(matches: Match[]): AppNotification[] {
  const now = Date.now();
  const out: AppNotification[] = [];

  for (const m of matches) {
    const t = new Date(m.kickoff).getTime();
    const diff = t - now;

    // Kick-off within next 24h → reminder
    if (m.status === "upcoming" && diff > 0 && diff < 24 * 60 * 60_000) {
      const hours = Math.round(diff / 3_600_000);
      out.push({
        id: `kickoff:${m.id}`,
        kind: "kickoff_soon",
        title: `${m.home.name} vs ${m.away.name}`,
        body: `Kicks off in ${hours}h · ${m.venue}`,
        ts: m.kickoff,
        matchId: m.id,
        flag: m.home.flag,
      });
    }

    if (m.status === "live") {
      out.push({
        id: `live:${m.id}`,
        kind: "match_started",
        title: `LIVE: ${m.home.name} ${m.homeScore ?? "-"} – ${m.awayScore ?? "-"} ${m.away.name}`,
        body: `${m.minute ?? 0}' · ${m.stage}`,
        ts: new Date().toISOString(),
        matchId: m.id,
        flag: m.home.flag,
      });
    }

    if (m.status === "finished") {
      const t = new Date(m.kickoff).getTime();
      // Only show recently finished (last 6h)
      if (now - t < 6 * 60 * 60_000) {
        out.push({
          id: `ft:${m.id}`,
          kind: "match_finished",
          title: `FT: ${m.home.name} ${m.homeScore ?? "-"} – ${m.awayScore ?? "-"} ${m.away.name}`,
          body: m.stage,
          ts: m.kickoff,
          matchId: m.id,
          flag: m.home.flag,
        });
      }
    }
  }

  return out.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
}

export function useNotifications(initialMatches: Match[] = []) {
  const [items, setItems] = useState<AppNotification[]>(() => deriveFromFixtures(initialMatches));
  const [read, setRead] = useState<Set<string>>(() => loadRead());

  useEffect(() => {
    setItems(deriveFromFixtures(initialMatches));
  }, [initialMatches]);

  // Live updates via socket
  useEffect(() => {
    const s = getSocket();
    const onMatchUpdate = (m: Match) => {
      if (m.status !== "live") return;
      const notif: AppNotification = {
        id: `score:${m.id}:${m.homeScore}-${m.awayScore}:${m.minute}`,
        kind: "score_update",
        title: `${m.home.name} ${m.homeScore ?? "-"} – ${m.awayScore ?? "-"} ${m.away.name}`,
        body: `${m.minute ?? 0}' · ${m.stage}`,
        ts: new Date().toISOString(),
        matchId: m.id,
        flag: m.home.flag,
      };
      setItems((prev) => {
        if (prev.some((p) => p.id === notif.id)) return prev;
        return [notif, ...prev].slice(0, 50);
      });
    };
    s.on("match:update", onMatchUpdate);
    return () => {
      s.off("match:update", onMatchUpdate);
    };
  }, []);

  const unreadCount = items.filter((n) => !read.has(n.id)).length;

  const markRead = useCallback(
    (id: string) => {
      const next = new Set(read);
      next.add(id);
      setRead(next);
      saveRead(next);
    },
    [read]
  );

  const markAllRead = useCallback(() => {
    const next = new Set(items.map((n) => n.id));
    setRead(next);
    saveRead(next);
  }, [items]);

  return { items, unreadCount, isRead: (id: string) => read.has(id), markRead, markAllRead };
}
