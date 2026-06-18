import { serverFetch } from "@/lib/core/server";

export function getApplications(params = {}) {
  const query = new URLSearchParams(params).toString();
  return serverFetch(`/api/applications${query ? `?${query}` : ""}`);
}

export function getApplication(id) {
  return serverFetch(`/api/applications/${id}`);
}
