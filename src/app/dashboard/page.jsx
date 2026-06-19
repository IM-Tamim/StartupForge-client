"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardRedirect() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending || !session) return;
    const role = session.user.role;
    if (role === "admin")        router.replace("/dashboard/admin");
    else if (role === "founder") router.replace("/dashboard/founder");
    else                         router.replace("/dashboard/collaborator");
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-secondary" />
    </div>
  );
}