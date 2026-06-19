"use server";

import { internalFetch } from "@/lib/core/server";

export async function createPayment(data) {
  return internalFetch("/api/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
