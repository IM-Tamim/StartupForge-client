import { serverFetch } from "@/lib/core/server";

export function getPayments() {
    return serverFetch("/api/payments");
}