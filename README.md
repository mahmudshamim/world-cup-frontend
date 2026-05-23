# WorldCup26 — Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS. Renders off mock data; swap `lib/api.ts` calls in for the Node backend when ready.

## Run

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  layout.tsx           # Navbar + Footer + theme bootstrap
  page.tsx             # Home dashboard
  fixtures/page.tsx
  standings/page.tsx
  stats/page.tsx
  predictor/page.tsx
  globals.css

components/
  layout/Navbar.tsx    # glassmorphism, fav-team dropdown, theme, notif
  layout/Footer.tsx
  home/LiveMatchHero.tsx
  home/MatchCarousel.tsx
  home/NewsBanter.tsx
  match/MatchCard.tsx

lib/
  api.ts               # fetch wrapper -> NEXT_PUBLIC_API_URL
  mockData.ts          # teams, matches, standings, stats, news
  utils.ts             # cn(), flagUrl(), formatKickoff()

types/index.ts         # Match, Team, Standing, PlayerStat, etc.
```

## Theme

- Light/dark via `class="dark"` on `<html>`; persisted to `localStorage.theme`.
- Tailwind tokens: `pitch` (emerald), `royal` (blue), `gold`. `bg-pitch-gradient`, `bg-gold-shine`.
- Animations: `animate-pulse-live`, `animate-slide-up`, `animate-fade-in`.

## Wiring backend

Replace mock imports in pages with `api()` calls:

```ts
import { api } from "@/lib/api";
const live = await api<Match>("/api/matches/live");
```

Backend lives in `../backend` (separate Express service).
