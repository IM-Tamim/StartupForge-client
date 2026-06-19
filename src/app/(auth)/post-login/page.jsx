"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostLoginPage() {
    const router = useRouter();

    useEffect(() => {
        const finish = async () => {
            await fetch("/api/auth/issue-token", { method: "POST" });
            router.push("/");
        };
        finish();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );
}