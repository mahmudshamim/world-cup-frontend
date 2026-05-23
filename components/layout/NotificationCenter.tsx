"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, BellOff, Check, Clock, Radio, Trophy } from "lucide-react";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";
import { flagUrl, cn } from "@/lib/utils";
import type { Match } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function NotificationCenter() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch(`${API}/api/matches`)
        .then((r) => (r.ok ? r.json() : { data: [] }))
        .then((j) => !cancelled && setMatches(j.data ?? []))
        .catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return <NotificationCenterUI matches={matches} />;
}

function NotificationCenterUI({ matches }: { matches: Match[] }) {
  const { items, unreadCount, isRead, markRead, markAllRead } = useNotifications(matches);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost p-2 relative"
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 grid place-items-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-1rem)] card p-0 animate-slide-up z-50 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-[rgb(var(--border))] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-pitch-600" />
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="chip bg-red-500/10 text-red-600 text-[10px] border border-red-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {items.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-pitch-600 hover:text-pitch-700 font-semibold inline-flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="w-8 h-8 mx-auto mb-2 text-[rgb(var(--muted))] opacity-40" />
              <p className="text-sm text-[rgb(var(--muted))]">
                No notifications yet.
              </p>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                You'll see kick-off reminders, live scores and full-time results here.
              </p>
            </div>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto divide-y divide-[rgb(var(--border))]">
              {items.map((n) => (
                <NotifRow
                  key={n.id}
                  n={n}
                  read={isRead(n.id)}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                  }}
                />
              ))}
            </ul>
          )}

          <div className="px-4 py-2 border-t border-[rgb(var(--border))] bg-pitch-50/40 dark:bg-pitch-950/40">
            <Link
              href="/fixtures"
              onClick={() => setOpen(false)}
              className="text-xs text-pitch-600 hover:text-pitch-700 font-semibold"
            >
              View all fixtures →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function NotifRow({
  n,
  read,
  onClick,
}: {
  n: AppNotification;
  read: boolean;
  onClick: () => void;
}) {
  const Icon =
    n.kind === "kickoff_soon"
      ? Clock
      : n.kind === "match_started" || n.kind === "score_update"
      ? Radio
      : Trophy;
  const iconClass =
    n.kind === "kickoff_soon"
      ? "text-pitch-600"
      : n.kind === "match_started" || n.kind === "score_update"
      ? "text-red-500"
      : "text-gold-500";

  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-pitch-50 dark:hover:bg-pitch-900/40 transition relative",
          !read && "bg-pitch-50/60 dark:bg-pitch-900/30"
        )}
      >
        {!read && (
          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-pitch-500" />
        )}
        <span className={cn("mt-0.5 grid place-items-center w-8 h-8 rounded-lg bg-white/5", iconClass)}>
          {n.flag ? (
            <img
              src={flagUrl(n.flag)}
              alt=""
              className="w-6 h-4 rounded-sm object-cover ring-1 ring-white/10"
            />
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm leading-snug", read ? "font-medium" : "font-bold")}>
            {n.title}
          </p>
          <p className="text-xs text-[rgb(var(--muted))] mt-0.5 truncate">{n.body}</p>
        </div>
      </button>
    </li>
  );
}
