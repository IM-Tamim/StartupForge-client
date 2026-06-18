const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
 
export async function serverFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
 
  const data = await res.json().catch(() => ({}));
 
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
 
  return data;
}