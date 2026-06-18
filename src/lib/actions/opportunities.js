"use server";

import { serverFetch } from "@/lib/core/server";

export async function createOpportunity(data) {
  return serverFetch("/api/opportunities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOpportunity(id, data) {
  return serverFetch(`/api/opportunities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOpportunity(id) {
  return serverFetch(`/api/opportunities/${id}`, {
    method: "DELETE",
  });
}