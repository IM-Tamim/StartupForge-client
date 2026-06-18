"use server";

import { serverFetch } from "@/lib/core/server";

export async function createStartup(data) {
  return serverFetch("/api/startups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStartup(id, data) {
  return serverFetch(`/api/startups/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteStartup(id) {
  return serverFetch(`/api/startups/${id}`, {
    method: "DELETE",
  });
}

export async function approveStartup(id) {
  return serverFetch(`/api/admin/startups/${id}/approve`, {
    method: "PATCH",
  });
}

export async function deleteStartupAdmin(id) {
  return serverFetch(`/api/admin/startups/${id}`, {
    method: "DELETE",
  });
}
