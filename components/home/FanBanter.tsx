"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Send,
  Users,
  Sparkles,
  Smile,
  ChevronDown,
} from "lucide-react";
import { teams } from "@/lib/mockData";
import { flagUrl, cn } from "@/lib/utils";
import { getSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types";

const MAX_LEN = 200;

function loadProfile() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("wc_chat_profile") ?? "null") as
      | { name: string; teamFlag: string }
      | null;
  } catch {
    return null;
  }
}
function saveProfile(p: { name: string; teamFlag: string }) {
  localStorage.setItem("wc_chat_profile", JSON.stringify(p));
}

export function FanBanter() {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [profile, setProfile] = useState<{ name: string; teamFlag: string } | null>(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  // Init profile from localStorage
  useEffect(() => {
    const p = loadProfile();
    if (p) setProfile(p);
    else setSetupOpen(true);
  }, []);

  // Socket
  useEffect(() => {
    const s = getSocket();
    setConnected(s.connected);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMsg = (m: ChatMessage) => {
      setMsgs((prev) => [...prev.slice(-99), m]);
    };
    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("banter:new", onMsg);
    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("banter:new", onMsg);
    };
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value) return;
    if (!profile) {
      setSetupOpen(true);
      return;
    }
    getSocket().emit("banter:send", {
      user: profile.name,
      teamFlag: profile.teamFlag,
      text: value,
    });
    setText("");
  };

  return (
    <section className="card overflow-hidden bg-pitch-950 text-white border-white/5 flex flex-col h-[560px] max-w-2xl mx-auto w-full">
      {/* Header */}
      <header className="px-5 py-4 border-b border-white/5 flex items-center gap-3 bg-gradient-to-r from-pitch-900 to-pitch-950">
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-royal-500/20 text-royal-400">
          <MessageCircle className="w-5 h-5" strokeWidth={2.4} />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-base flex items-center gap-2">
            Fan Banter
            <span
              className={cn(
                "inline-flex items-center gap-1 chip text-[10px] font-semibold border",
                connected
                  ? "bg-pitch-500/15 text-pitch-300 border-pitch-500/30"
                  : "bg-white/5 text-white/40 border-white/10"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  connected ? "bg-pitch-400 animate-pulse" : "bg-white/30"
                )}
              />
              {connected ? "LIVE" : "OFFLINE"}
            </span>
          </h2>
          <p className="text-xs text-white/50 flex items-center gap-1">
            <Users className="w-3 h-3" /> Open chat · Trash talk welcome
          </p>
        </div>
        {profile && (
          <button
            onClick={() => setSetupOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition text-xs font-semibold"
          >
            <img
              src={flagUrl(profile.teamFlag)}
              alt=""
              className="w-5 h-3.5 rounded-sm object-cover"
            />
            <span className="truncate max-w-[90px]">{profile.name}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        )}
      </header>

      {/* Messages */}
      <ul ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {msgs.length === 0 ? (
          <EmptyState />
        ) : (
          msgs.map((m) => (
            <Bubble key={m.id} m={m} mine={profile?.name === m.user} />
          ))
        )}
      </ul>

      {/* Composer */}
      <form
        onSubmit={send}
        className="px-3 py-3 border-t border-white/5 bg-pitch-950"
      >
        <div className="flex items-end gap-2">
          {profile ? (
            <img
              src={flagUrl(profile.teamFlag)}
              alt=""
              className="w-8 h-6 rounded object-cover ring-1 ring-white/10 shrink-0 mb-1"
            />
          ) : (
            <button
              type="button"
              onClick={() => setSetupOpen(true)}
              className="w-8 h-6 rounded grid place-items-center bg-white/5 border border-dashed border-white/20 text-white/40 hover:text-white shrink-0 mb-1"
              aria-label="Set profile"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={profile ? "Drop your take…" : "Pick a team to start chatting…"}
              className="w-full px-4 py-2.5 pr-14 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pitch-500/40 focus:border-pitch-500/40 transition"
            />
            {text.length > 0 && (
              <span
                className={cn(
                  "absolute right-12 top-1/2 -translate-y-1/2 text-[10px] tabular-nums",
                  text.length > MAX_LEN * 0.9 ? "text-red-400" : "text-white/30"
                )}
              >
                {text.length}/{MAX_LEN}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!text.trim() || !profile}
            className={cn(
              "grid place-items-center w-11 h-11 rounded-xl transition shrink-0",
              text.trim() && profile
                ? "bg-pitch-500 hover:bg-pitch-600 text-white shadow-lg shadow-pitch-500/30"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            )}
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-white/30 mt-1.5 px-1">
          Press Enter to send · Be civil — banter only, no abuse
        </p>
      </form>

      {/* Setup modal */}
      {setupOpen && (
        <SetupModal
          initial={profile}
          onClose={() => profile && setSetupOpen(false)}
          onSave={(p) => {
            saveProfile(p);
            setProfile(p);
            setSetupOpen(false);
          }}
        />
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4 animate-fade-in">
      <span className="grid place-items-center w-16 h-16 rounded-3xl bg-gradient-to-br from-royal-500/20 to-pitch-500/20 mb-4">
        <Sparkles className="w-7 h-7 text-gold-400" />
      </span>
      <h3 className="font-display font-bold text-lg">No takes yet</h3>
      <p className="text-sm text-white/50 mt-1 max-w-xs">
        Be the first to start the banter. Pick your team, drop a hot take, see who replies.
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5 justify-center">
        {["🔥", "⚽", "🏆", "🙌", "😂", "🇦🇷", "🇧🇷", "🇫🇷"].map((e, i) => (
          <span
            key={i}
            className="text-2xl opacity-40 hover:opacity-100 transition-all hover:scale-125 hover:-rotate-12 cursor-default"
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

function Bubble({ m, mine }: { m: ChatMessage; mine: boolean }) {
  const time = new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <li className={cn("flex gap-2 animate-slide-up", mine ? "flex-row-reverse" : "")}>
      <img
        src={flagUrl(m.teamFlag)}
        alt=""
        className="w-8 h-6 rounded object-cover ring-1 ring-white/10 mt-1 shrink-0"
      />
      <div className={cn("max-w-[78%] min-w-0", mine ? "items-end text-right" : "")}>
        <div
          className={cn(
            "flex items-baseline gap-2 mb-0.5 text-[11px]",
            mine ? "justify-end" : ""
          )}
        >
          <span className="font-semibold text-white/80">{mine ? "You" : m.user}</span>
          <span className="text-white/30 tabular-nums">{time}</span>
        </div>
        <div
          className={cn(
            "px-3.5 py-2 rounded-2xl text-sm leading-snug break-words",
            mine
              ? "bg-pitch-500 text-white rounded-tr-sm shadow-lg shadow-pitch-500/20"
              : "bg-white/5 text-white rounded-tl-sm border border-white/5"
          )}
        >
          {m.text}
        </div>
      </div>
    </li>
  );
}

function SetupModal({
  initial,
  onClose,
  onSave,
}: {
  initial: { name: string; teamFlag: string } | null;
  onClose: () => void;
  onSave: (p: { name: string; teamFlag: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [team, setTeam] = useState(initial?.teamFlag ?? "ar");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim().slice(0, 24) || "Anon";
    onSave({ name: n, teamFlag: team });
  };

  return (
    <div
      className="absolute inset-0 z-30 grid place-items-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="card bg-pitch-950 border-white/10 p-5 w-full max-w-sm space-y-4"
      >
        <header>
          <h3 className="font-display font-bold text-lg">Pick your colors</h3>
          <p className="text-xs text-white/50 mt-0.5">Set your handle + team to join the banter.</p>
        </header>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-1.5 block">
            Display Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="MessiFan10"
            autoFocus
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-pitch-500/40 focus:border-pitch-500/40 text-white"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-1.5 block">
            Repping Team
          </label>
          <div className="grid grid-cols-4 gap-2">
            {Object.values(teams).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTeam(t.flag)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl border transition",
                  team === t.flag
                    ? "border-pitch-500 bg-pitch-500/15 ring-2 ring-pitch-500/30"
                    : "border-white/10 hover:border-white/30 bg-white/5"
                )}
              >
                <img src={flagUrl(t.flag)} alt={t.name} className="w-8 h-5 rounded object-cover" />
                <span className="text-[10px] font-semibold">{t.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          {initial && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary flex-1">
            Join Chat
          </button>
        </div>
      </form>
    </div>
  );
}
