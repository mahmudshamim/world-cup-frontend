import Link from "next/link";
import { Trophy, Twitter, Instagram, Youtube, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="hidden md:block mt-12 border-t border-[rgb(var(--border))] bg-pitch-50/50 dark:bg-pitch-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gold-shine">
              <Trophy className="w-5 h-5 text-pitch-950" />
            </span>
            <span className="font-display font-bold text-lg">WorldCup26</span>
          </Link>
          <p className="mt-3 text-sm text-[rgb(var(--muted))]">
            Live scores, fixtures, stats and fan banter for the world's biggest tournament.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
            <li><Link href="/fixtures" className="hover:text-pitch-600">Fixtures</Link></li>
            <li><Link href="/standings" className="hover:text-pitch-600">Standings</Link></li>
            <li><Link href="/stats" className="hover:text-pitch-600">Top Performers</Link></li>
            <li><Link href="/predictor" className="hover:text-pitch-600">Predictor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">About</h4>
          <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
            <li><a className="hover:text-pitch-600" href="#">Data Sources</a></li>
            <li><a className="hover:text-pitch-600" href="#">API Docs</a></li>
            <li><a className="hover:text-pitch-600" href="#">Privacy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Follow</h4>
          <div className="flex gap-2">
            {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid place-items-center w-9 h-9 rounded-lg border hover:bg-pitch-600 hover:text-white hover:border-pitch-600 transition"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[rgb(var(--border))] py-4 text-center text-xs text-[rgb(var(--muted))]">
        © 2026 WorldCup26. Not affiliated with FIFA.
      </div>
    </footer>
  );
}
