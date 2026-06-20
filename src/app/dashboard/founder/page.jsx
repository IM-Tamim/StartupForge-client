"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
    FiZap, FiFileText, FiCheckCircle, FiClock, FiArrowRight,
    FiPlusCircle, FiBriefcase, FiAlertCircle, FiTrendingUp,
} from "react-icons/fi";
import { getOpportunities } from "@/lib/api/opportunities";
import { getApplications } from "@/lib/api/applications";
import { getMyStartup } from "@/lib/api/startups";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";

export default function FounderOverviewPage() {
    const { data: session } = authClient.useSession();
    const [stats, setStats] = useState({ totalOpps: 0, totalApps: 0, accepted: 0, pending: 0, rejected: 0 });
    const [startupStatus, setStartupStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        const email = session.user.email;

        Promise.all([
            getOpportunities({ founder_email: email }),
            getApplications({ founder_email: email }),
            getMyStartup(email).catch(() => null),
        ])
            .then(([opps, apps, startup]) => {
                const oppsArr = Array.isArray(opps) ? opps : opps.opportunities || [];
                const appsArr = Array.isArray(apps) ? apps : apps.applications || [];
                setStats({
                    totalOpps: oppsArr.length,
                    totalApps: appsArr.length,
                    accepted: appsArr.filter((a) => a.status === "accepted").length,
                    pending: appsArr.filter((a) => a.status === "pending").length,
                    rejected: appsArr.filter((a) => a.status === "rejected").length,
                });
                setStartupStatus(startup?.status || null);
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
        { label: "Total Opportunities", value: stats.totalOpps, icon: FiZap, color: "text-secondary", bg: "bg-secondary/10" },
        { label: "Total Applications", value: stats.totalApps, icon: FiFileText, color: "text-info", bg: "bg-info/10" },
        { label: "Accepted Members", value: stats.accepted, icon: FiCheckCircle, color: "text-success", bg: "bg-success/10" },
    ];

    const quickLinks = [
        { href: "/dashboard/founder/my-startup", label: "My Startup", desc: "Create or update your startup profile", icon: FiZap },
        { href: "/dashboard/founder/add-opportunity", label: "Post Opportunity", desc: "Find your next team member", icon: FiPlusCircle },
        { href: "/dashboard/founder/manage-opportunities", label: "Manage Opportunities", desc: "Edit or delete your posted roles", icon: FiBriefcase },
        { href: "/dashboard/founder/applications", label: "Applications", desc: "Review and respond to applicants", icon: FiCheckCircle },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">
                    Welcome, {session?.user?.name?.split(" ")[0] || "Founder"} 👋
                </h1>
                <p className="text-sm text-base-content/50 mt-1">
                    Here is your founder dashboard overview.
                </p>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">

                {/* ── Stat Cards ── */}
                <div className="flex flex-col gap-2">
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

                {/* Startup Status Card */}
                <div className="rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <FiTrendingUp size={16} className="text-secondary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base-content text-sm">Startup Status</h3>
                            <p className="text-xs text-base-content/40">Your startup profile</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="h-20 rounded-xl bg-base-300 animate-pulse" />
                    ) : startupStatus === "approved" ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/30">
                            <FiCheckCircle size={20} className="text-success" />
                            <div>
                                <p className="text-sm font-bold text-success">Approved</p>
                                <p className="text-xs text-base-content/50">Your startup is live and can post opportunities.</p>
                            </div>
                        </div>
                    ) : startupStatus === "pending" ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30">
                            <FiClock size={20} className="text-warning" />
                            <div>
                                <p className="text-sm font-bold text-warning">Pending Approval</p>
                                <p className="text-xs text-base-content/50">Waiting for admin approval before posting.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-base-200 border border-base-300">
                            <FiAlertCircle size={20} className="text-base-content/50" />
                            <div>
                                <p className="text-sm font-bold text-base-content">No Startup Profile</p>
                                <p className="text-xs text-base-content/50">Create your startup to get started.</p>
                            </div>
                        </div>
                    )}
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
