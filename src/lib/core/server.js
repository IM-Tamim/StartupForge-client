const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function serverFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;

  let cookieHeader = "";
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  } catch {
    // Client-side or no headers available — credentials: "include" handles cookies
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export async function internalFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": process.env.INTERNAL_API_KEY || "",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Internal request failed with status ${res.status}`);
  }

  return data;
}
