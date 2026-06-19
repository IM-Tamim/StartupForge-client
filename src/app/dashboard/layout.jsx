"use client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ROLE_SEGMENT = {
  founder:      "founder",
  collaborator: "collaborator",
  admin:        "admin",
};

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router  = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (session.user.isBlocked) {
      authClient.signOut().then(() => {
        fetch("/api/auth/clear-token", { method: "POST" }).catch(() => {});
        toast.error("Your account has been blocked.");
        router.replace("/signin");
      });
      return;
    }

    const role    = session.user.role;     
    const segment = pathname.split("/")[2];        

    if (segment && ROLE_SEGMENT[role] && segment !== ROLE_SEGMENT[role]) {
      router.replace(`/dashboard/${ROLE_SEGMENT[role]}`);
    }
  }, [session, isPending, pathname, router]);

  if (isPending) return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg text-secondary" />
    </div>
  );

  if (!session) return null;

  const role    = session.user.role;
  const segment = pathname.split("/")[2];
  if (segment && ROLE_SEGMENT[role] && segment !== ROLE_SEGMENT[role]) return null;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={session.user} />
      <main className="flex-1 overflow-auto bg-base-200">
        <div className="pt-16 lg:pt-0 p-6 lg:p-8 max-w-5xl mx-auto my-10">
          {children}
        </div>
      </main>
    </div>
  );
}