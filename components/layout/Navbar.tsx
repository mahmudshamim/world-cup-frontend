"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Trophy, Moon, Sun, ChevronDown } from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { teams } from "@/lib/mockData";
import { flagUrl, cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";

export function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [fav, setFav] = useState<string>("arg");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const f = localStorage.getItem("fav");
    if (f && teams[f]) setFav(f);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const pickFav = (id: string) => {
    setFav(id);
    localStorage.setItem("fav", id);
    setFavOpen(false);
  };

  const favTeam = teams[fav];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-3">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gold-shine shadow-card group-hover:rotate-6 transition">
            <Trophy className="w-5 h-5 text-pitch-950" strokeWidth={2.4} />
          </span>
          <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">
            WorldCup<span className="text-pitch-600">26</span>
          </span>
        </Link>

        {/* Desktop pill nav */}
        <ul className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-200/60 dark:bg-pitch-950/60 border border-white/10 backdrop-blur">
          {NAV_ITEMS.map((n) => {
            const active = isActive(n.href);
            const Icon = n.icon;
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    active
                      ? "bg-pitch-950 text-white shadow-lg shadow-pitch-950/30"
                      : "text-slate-500 dark:text-slate-400 hover:text-pitch-950 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5"
                  )}
                >
                  <Icon
                    className={cn("w-4 h-4 transition", active && "text-pitch-500")}
                    strokeWidth={2.2}
                  />
                  <span>{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative">
            <button
              onClick={() => setFavOpen((v) => !v)}
              className="btn-ghost px-2 py-1.5 text-sm"
              aria-label="Favorite team"
            >
              <img
                src={flagUrl(favTeam.flag)}
                alt={favTeam.name}
                className="w-5 h-3.5 rounded-sm object-cover"
              />
              <span className="hidden lg:inline">{favTeam.shortName}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {favOpen && (
              <div className="absolute right-0 mt-2 w-56 card p-1 animate-slide-up z-50">
                <p className="px-3 py-1.5 text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wide">
                  Favorite Team
                </p>
                {Object.values(teams).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => pickFav(t.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-pitch-50 dark:hover:bg-pitch-900/40 transition",
                      t.id === fav && "bg-pitch-50 dark:bg-pitch-900/40"
                    )}
                  >
                    <img
                      src={flagUrl(t.flag)}
                      alt=""
                      className="w-5 h-3.5 rounded-sm object-cover"
                    />
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <NotificationCenter />

          <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Theme">
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
