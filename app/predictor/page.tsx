import { api } from "@/lib/api";
import { PredictorClient } from "./PredictorClient";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function PredictorPage() {
  const all = await api.matches();
  const upcoming = all
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  return <PredictorClient upcoming={upcoming} />;
}
