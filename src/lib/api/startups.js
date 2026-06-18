import { serverFetch } from "@/lib/core/server";

export function getStartups(params = {}) {
  const query = new URLSearchParams(params).toString();
  return serverFetch(`/api/startups${query ? `?${query}` : ""}`);
}

export function getStartup(id) {
  return serverFetch(`/api/startups/${id}`);
}

export function getMyStartup(founderEmail) {
  return serverFetch(`/api/my-startup?founder_email=${founderEmail}`);
}