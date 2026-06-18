"use server";

import { serverFetch } from "@/lib/core/server";

export async function createPayment(data) {
    return serverFetch("/api/payments", {
        method: "POST",
        body: JSON.stringify(data),
    });
}