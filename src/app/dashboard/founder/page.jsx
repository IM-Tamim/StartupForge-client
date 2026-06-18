"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiZap, FiFileText, FiCheckCircle, FiArrowRight, FiPlusCircle } from "react-icons/fi";

export default function FounderOverviewPage() {
    const { data: session } = authClient.useSession();
    const [stats, setStats] = useState({ totalOpps: 0, totalApps: 0, accepted: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        const base = process.env.NEXT_PUBLIC_API_URL;
        const email = session.user.email;

        Promise.all([
            fetch(`${base}/api/opportunities?founder_email=${email}`).then((r) => r.json()),
            fetch(`${base}/api/applications?founder_email=${email}`).then((r) => r.json()),
        ])
            .then(([opps, apps]) => {
                const oppsArr = Array.isArray(opps) ? opps : opps.opportunities || [];
                const appsArr = Array.isArray(apps) ? apps : apps.applications || [];
                setStats({
                    totalOpps: oppsArr.length,
                    totalApps: appsArr.length,
                    accepted: appsArr.filter((a) => a.status === "accepted").length,
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    const cards = [
        { label: "Total Opportunities", value: stats.totalOpps, icon: FiZap,         color: "text-secondary",  bg: "bg-secondary/10"  },
        { label: "Total Applications",  value: stats.totalApps,  icon: FiFileText,    color: "text-info",       bg: "bg-info/10"       },
        { label: "Accepted Members",    value: stats.accepted,   icon: FiCheckCircle, color: "text-success",    bg: "bg-success/10"    },
    ];

    const quickLinks = [
        { href: "/dashboard/founder/my-startup",          label: "My Startup",          desc: "Create or update your startup profile", icon: FiZap         },
        { href: "/dashboard/founder/add-opportunity",     label: "Post Opportunity",     desc: "Find your next team member",            icon: FiPlusCircle  },
        { href: "/dashboard/founder/manage-opportunities",label: "Manage Opportunities", desc: "Edit or delete your posted roles",      icon: FiFileText    },
        { href: "/dashboard/founder/applications",        label: "Applications",         desc: "Review and respond to applicants",      icon: FiCheckCircle },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">
                    Welcome, {session?.user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-base-content/50 mt-1">
                    Here is your founder dashboard overview.
                </p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-5 mb-8">
                {cards.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="flex items-center gap-4 p-5 rounded-2xl border border-base-300 bg-base-100">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                            <Icon className={color} size={22} />
                        </div>
                        <div>
                            {loading
                                ? <div className="h-7 w-10 rounded bg-base-300 animate-pulse mb-1" />
                                : <p className="text-2xl font-black text-base-content">{value}</p>
                            }
                            <p className="text-xs text-base-content/50">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick links */}
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