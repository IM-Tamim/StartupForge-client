import { serverFetch } from "@/lib/core/server";

export function getUsers() {
  return serverFetch("/api/users");
}