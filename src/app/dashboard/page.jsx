"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirectPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (isPending) return;

        if (!session) { router.push("/signin"); return; }

        const role = session.user.role;
        if (role === "founder")       router.push("/dashboard/founder");
        else if (role === "admin")    router.push("/dashboard/admin");
        else                          router.push("/dashboard/collaborator");
    }, [session, isPending, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );
}