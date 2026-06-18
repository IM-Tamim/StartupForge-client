"use server";

import { serverFetch } from "@/lib/core/server";

export async function applyToOpportunity(data) {
  return serverFetch("/api/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateApplicationStatus(id, status) {
  return serverFetch(`/api/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
