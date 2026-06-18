import { serverFetch } from "@/lib/core/server";

export function getOpportunities(params = {}) {
  const query = new URLSearchParams(params).toString();
  return serverFetch(`/api/opportunities${query ? `?${query}` : ""}`);
}

export function getOpportunity(id) {
  return serverFetch(`/api/opportunities/${id}`);
}