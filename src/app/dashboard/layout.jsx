"use client";
import FounderSidebar from "@/components/dashboard/DashboardSidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function FounderDashboardLayout({ children }) {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (isPending) return;
        if (!session) { router.push("/signin"); return; }
        if (session.user.role !== "founder") router.push("/dashboard");
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-secondary" />
            </div>
        );
    }

    if (!session || session.user.role !== "founder") return null;

    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            <FounderSidebar user={session.user} />
            <main className="flex-1 overflow-auto bg-base-200">
                <div className="p-6 lg:p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}