"use client";

import { useState } from "react";
import { MessageCircle, Send, Newspaper } from "lucide-react";
import type { ChatMessage, NewsItem } from "@/types";
import { flagUrl } from "@/lib/utils";

export function NewsBanter({ news, banter }: { news: NewsItem[]; banter: ChatMessage[] }) {
  const [msgs, setMsgs] = useState<ChatMessage[]>(banter);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs([
      { id: crypto.randomUUID(), user: "You", teamFlag: "ar", text, ts: new Date().toISOString() },
      ...msgs,
    ]);
    setText("");
  };

  return (
    <section className={news.length ? "grid gap-6 lg:grid-cols-3" : ""}>
      {news.length > 0 && (
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-pitch-600" />
          <h2 className="font-display font-bold text-xl">Trending News</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {news.map((n) => (
            <article key={n.id} className="card overflow-hidden group hover:shadow-glass transition">
              <div className="h-32 bg-pitch-gradient relative">
                <span className="absolute top-3 left-3 chip bg-white/90 text-pitch-900 text-[10px] font-bold">
                  {n.tag}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold leading-snug group-hover:text-pitch-600 transition">
                  {n.title}
                </h3>
                <p className="text-sm text-[rgb(var(--muted))] line-clamp-2">{n.excerpt}</p>
                <p className="text-xs text-[rgb(var(--muted))]">{n.source}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      )}

      <div className={"card p-4 flex flex-col h-[480px] " + (news.length ? "" : "max-w-md mx-auto w-full")}>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-5 h-5 text-royal-600" />
          <h2 className="font-display font-bold">Fan Banter</h2>
          <span className="chip bg-pitch-50 dark:bg-pitch-900/40 text-pitch-700 dark:text-pitch-100 ml-auto">
            {msgs.length} live
          </span>
        </div>
        <ul className="flex-1 overflow-y-auto space-y-3 pr-1">
          {msgs.map((m) => (
            <li key={m.id} className="flex items-start gap-2 animate-slide-up">
              <img src={flagUrl(m.teamFlag)} alt="" className="w-6 h-4 rounded-sm object-cover mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{m.user}</p>
                <p className="text-sm break-words">{m.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mt-3 flex gap-2"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Drop your take..."
            className="flex-1 rounded-xl border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pitch-600/40"
          />
          <button type="submit" className="btn-primary px-3 py-2" aria-label="Send">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
