"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/types";
import { getSocket } from "@/lib/socket";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function useLiveMatch(initial: Match): Match {
  const [match, setMatch] = useState(initial);

  useEffect(() => {
    setMatch(initial);
  }, [initial.id]);

  // Socket push (local dev). Silently no-ops on serverless.
  useEffect(() => {
    const s = getSocket();
    s.emit("subscribe:match", initial.id);
    const onUpdate = (m: Match) => { if (m.id === initial.id) setMatch(m); };
    s.on("match:update", onUpdate);
    return () => {
      s.emit("unsubscribe:match", initial.id);
      s.off("match:update", onUpdate);
    };
  }, [initial.id]);

  // Polling fallback for serverless deployments without WebSocket.
  // Only polls when match is live or within 2h of kickoff.
  useEffect(() => {
    const start = new Date(match.kickoff).getTime();
    const now = Date.now();
    const window2h = 2 * 60 * 60_000;
    const window3hAfter = 3 * 60 * 60_000;
    const isLiveOrSoon =
      match.status === "live" ||
      (start - now < window2h && start - now > -window3hAfter);
    if (!isLiveOrSoon) return;

    const interval = match.status === "live" ? 30_000 : 60_000;
    const tick = async () => {
      try {
        const res = await fetch(`${API}/api/matches/${match.id}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json?.data) setMatch(json.data);
      } catch {}
    };
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [match.id, match.status, match.kickoff]);

  return match;
}
