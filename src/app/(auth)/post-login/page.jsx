"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostLoginPage() {
    const router = useRouter();

    useEffect(() => {
        const finish = async () => {
            const res  = await fetch("/api/auth/issue-token", {
                method: "POST",
                credentials: "include",
            });
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

            const redirect = localStorage.getItem("redirectAfterLogin") || "/";
            localStorage.removeItem("redirectAfterLogin");
            router.replace(redirect);
        };
        finish();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );
}