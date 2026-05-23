import {
  Trophy,
  CalendarDays,
  Table2,
  Medal,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home Dashboard", short: "Home", icon: Trophy },
  { href: "/fixtures", label: "Fixtures", short: "Fixtures", icon: CalendarDays },
  { href: "/standings", label: "Standings", short: "Table", icon: Table2 },
  { href: "/stats", label: "Player Stats", short: "Stats", icon: Medal },
  { href: "/predictor", label: "Predictor Zone", short: "Predict", icon: Gamepad2 },
];
