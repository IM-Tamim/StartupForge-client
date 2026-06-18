"use server";

import { serverFetch } from "@/lib/core/server";

export async function updateUserBlockStatus(id, isBlocked) {
  return serverFetch(`/api/users/${id}/block`, {
    method: "PATCH",
    body: JSON.stringify({ isBlocked }),
  });
}