import { api } from "@/lib/api";
import { FixturesClient } from "./FixturesClient";

export const revalidate = 60;

export default async function FixturesPage() {
  const matches = await api.matches();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-bold text-2xl sm:text-3xl">Fixtures & Results</h1>
        <p className="text-[rgb(var(--muted))] mt-1 text-sm">
          Browse all matches by date and stage.
        </p>
      </header>
      <FixturesClient matches={matches} />
    </div>
  );
}
