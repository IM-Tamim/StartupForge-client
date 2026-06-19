"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostLoginPage() {
    const router = useRouter();

    useEffect(() => {
        const finish = async () => {
            const res  = await fetch("/api/auth/issue-token", { method: "POST" });
            const data = await res.json();

            if (res.status === 403) {
                const { authClient } = await import("@/lib/auth-client");
                await authClient.signOut();
                router.replace("/signin?blocked=1");
                return;
            }

            if (!res.ok) {
                router.replace("/signin");
                return;
            }

            const role = data.role;
            if (role === "admin")        router.replace("/dashboard/admin");
            else if (role === "founder") router.replace("/dashboard/founder");
            else                         router.replace("/dashboard/collaborator");
        };
        finish();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );
}