"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import {
    FiUsers, FiZap, FiBriefcase, FiFileText,
    FiClock, FiCheckCircle, FiAlertCircle,
} from "react-icons/fi";
import { getUsers } from "@/lib/api/users";
import { getAllStartups } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import { getApplications } from "@/lib/api/applications";

export default function AdminOverviewPage() {
    const { data: session } = authClient.useSession();
    const [stats, setStats] = useState({
        users: 0, startups: 0, opps: 0, apps: 0,
        pendingStartups: 0, pendingApps: 0, blockedUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getUsers().catch(() => []),
            getAllStartups().catch(() => []),
            getOpportunities().catch(() => []),
            getApplications().catch(() => []),
        ])
            .then(([users, startups, opps, apps]) => {
                const usersArr = Array.isArray(users) ? users : [];
                const startupsArr = Array.isArray(startups) ? startups : [];
                const oppsArr = Array.isArray(opps) ? opps : opps.opportunities || [];
                const appsArr = Array.isArray(apps) ? apps : apps.applications || [];

                setStats({
                    users:         usersArr.length,
                    startups:      startupsArr.length,
                    opps:          oppsArr.length,
                    apps:          appsArr.length,
                    pendingStartups: startupsArr.filter((s) => s.status === "pending").length,
                    pendingApps:     appsArr.filter((a) => a.status === "pending").length,
                    blockedUsers:    usersArr.filter((u) => u.isBlocked).length,
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: "Total Users",        value: stats.users,         icon: FiUsers,      color: "text-info",       bg: "bg-info/10"       },
        { label: "Total Startups",     value: stats.startups,      icon: FiZap,        color: "text-secondary",  bg: "bg-secondary/10"  },
        { label: "Total Opportunities",value: stats.opps,          icon: FiBriefcase,   color: "text-warning",    bg: "bg-warning/10"    },
        { label: "Total Applications", value: stats.apps,          icon: FiFileText,    color: "text-success",    bg: "bg-success/10"    },
        { label: "Pending Startups",   value: stats.pendingStartups, icon: FiAlertCircle, color: "text-error",      bg: "bg-error/10"      },
        { label: "Pending Applications",value: stats.pendingApps,    icon: FiClock,       color: "text-warning",    bg: "bg-warning/10"    },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">
                    Welcome, {session?.user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-base-content/50 mt-1">
                    Admin dashboard overview.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        </div>
    );
}
