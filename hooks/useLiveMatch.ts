"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/types";
import { getSocket } from "@/lib/socket";

export function useLiveMatch(initial: Match): Match {
  const [match, setMatch] = useState(initial);

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

  return match;
}
