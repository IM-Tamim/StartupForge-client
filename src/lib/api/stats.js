const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getPublicStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  if (!res.ok) return { startups: 0, opportunities: 0, teamsFormed: 0 };
  return res.json();
}
