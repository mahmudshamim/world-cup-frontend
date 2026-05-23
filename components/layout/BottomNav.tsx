"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-white/20 dark:border-white/5 pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom navigation"
    >
      <ul className="grid grid-cols-5">
        {NAV_ITEMS.map((n) => {
          const active = isActive(n.href);
          const Icon = n.icon;
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition",
                  active
                    ? "text-pitch-600 dark:text-pitch-500"
                    : "text-slate-500 dark:text-slate-400 active:text-pitch-600"
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-pitch-600 dark:bg-pitch-500" />
                )}
                <span
                  className={cn(
                    "grid place-items-center w-10 h-10 rounded-2xl transition-all",
                    active
                      ? "bg-pitch-600/10 dark:bg-pitch-500/15 scale-105"
                      : "scale-100"
                  )}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={active ? 2.6 : 2}
                    fill={active ? "currentColor" : "none"}
                    fillOpacity={active ? 0.15 : 0}
                  />
                </span>
                <span className="leading-none">{n.short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
