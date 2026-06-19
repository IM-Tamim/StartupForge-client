export async function getPublicStats() {
  const res = await fetch("/api/stats");
  if (!res.ok) return { startups: 0, opportunities: 0, teamsFormed: 0 };
  return res.json();
}