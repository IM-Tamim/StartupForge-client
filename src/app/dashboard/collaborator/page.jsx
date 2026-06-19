"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
    FiFileText, FiCheckCircle, FiClock, FiXCircle, FiArrowRight,
    FiBriefcase, FiSearch, FiUser, FiTrendingUp,
} from "react-icons/fi";
import { getApplications } from "@/lib/api/applications";

export default function CollaboratorOverviewPage() {
    const { data: session } = authClient.useSession();
    const [stats, setStats] = useState({
        total: 0, pending: 0, accepted: 0, rejected: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        const email = session.user.email;

        getApplications({ applicant_email: email })
            .then((apps) => {
                const appsArr = Array.isArray(apps) ? apps : apps.applications || [];
                setStats({
                    total: appsArr.length,
                    pending: appsArr.filter((a) => a.status === "pending").length,
                    accepted: appsArr.filter((a) => a.status === "accepted").length,
                    rejected: appsArr.filter((a) => a.status === "rejected").length,
                });
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [session]);

    const pieData = [
        { name: "Accepted", value: stats.accepted, fill: "#10b981" },
        { name: "Pending", value: stats.pending, fill: "#f59e0b" },
        { name: "Rejected", value: stats.rejected, fill: "#ef4444" },
    ].filter((d) => d.value > 0);

    const statCards = [
        { label: "Applications Sent", value: stats.total, icon: FiFileText, color: "text-secondary", bg: "bg-secondary/10" },
        { label: "Pending", value: stats.pending, icon: FiClock, color: "text-warning", bg: "bg-warning/10" },
        { label: "Accepted", value: stats.accepted, icon: FiCheckCircle, color: "text-success", bg: "bg-success/10" },
    ];

    const quickLinks = [
        { href: "/opportunities", label: "Browse Opportunities", desc: "Find open roles from startups", icon: FiSearch },
        { href: "/dashboard/collaborator/my-applications", label: "My Applications", desc: "Track status of your applications", icon: FiFileText },
        { href: "/dashboard/collaborator/profile", label: "My Profile", desc: "Update your skills and bio", icon: FiUser },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">
                    Welcome, {session?.user?.name?.split(" ")[0] || "Collaborator"} 👋
                </h1>
                <p className="text-sm text-base-content/50 mt-1">
                    Your collaborator dashboard overview.
                </p>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                {/* ── Stat Cards ── */}
                <div className="flex flex-col gap-2 justify-between">
                    {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="flex items-center gap-4 p-5 rounded-2xl border border-base-300 bg-base-100 flex-1">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                                <Icon className={color} size={22} />
                            </div>
                            <div>
                                {loading ? (
                                    <div className="h-7 w-10 rounded bg-base-300 animate-pulse mb-1" />
                                ) : (
                                    <p className="text-2xl font-black text-base-content">{value}</p>
                                )}
                                <p className="text-xs text-base-content/50">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Applications Status */}
                <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <FiBriefcase size={16} className="text-secondary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base-content text-sm">Application Summary</h3>
                            <p className="text-xs text-base-content/40">Overview of all your applications</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/30">
                            <div className="flex items-center gap-2">
                                <FiCheckCircle size={16} className="text-success" />
                                <span className="text-sm text-base-content">Accepted</span>
                            </div>
                            <span className="text-sm font-bold text-success">{loading ? "..." : stats.accepted}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-warning/10 border border-warning/30">
                            <div className="flex items-center gap-2">
                                <FiClock size={16} className="text-warning" />
                                <span className="text-sm text-base-content">Pending</span>
                            </div>
                            <span className="text-sm font-bold text-warning">{loading ? "..." : stats.pending}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-error/10 border border-error/30">
                            <div className="flex items-center gap-2">
                                <FiXCircle size={16} className="text-error" />
                                <span className="text-sm text-base-content">Rejected</span>
                            </div>
                            <span className="text-sm font-bold text-error">{loading ? "..." : stats.rejected}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40 mb-4">
                Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
                {quickLinks.map(({ href, label, desc, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-base-300 bg-base-100 hover:border-secondary/40 hover:bg-base-100 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                                <Icon size={18} className="text-secondary" />
                            </div>
                            <div>
                                <p className="font-bold text-base-content group-hover:text-secondary transition-colors text-sm">
                                    {label}
                                </p>
                                <p className="text-xs text-base-content/50">{desc}</p>
                            </div>
                        </div>
                        <FiArrowRight className="text-base-content/30 group-hover:text-secondary transition-colors shrink-0" size={16} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
