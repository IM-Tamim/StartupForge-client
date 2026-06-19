"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
    FiUsers, FiZap, FiBriefcase, FiDollarSign,
    FiTrendingUp, FiActivity, FiClock, FiAlertTriangle,
} from "react-icons/fi";
import { getUsers } from "@/lib/api/users";
import { getAllStartups } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import { getPayments } from "@/lib/api/payments";
import { getApplications } from "@/lib/api/applications";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area,
} from "recharts";

export default function AdminOverviewPage() {
    const { data: session } = authClient.useSession();
    const [stats, setStats] = useState({
        users: 0, startups: 0, opps: 0, revenue: 0,
        pendingStartups: 0, pendingApps: 0, blockedUsers: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [revenueChartData, setRevenueChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getUsers().catch(() => []),
            getAllStartups().catch(() => []),
            getOpportunities().catch(() => []),
            getPayments().catch(() => []),
            getApplications().catch(() => []),
        ])
            .then(([users, startups, opps, payments, apps]) => {
                const usersArr = Array.isArray(users) ? users : [];
                const startupsArr = Array.isArray(startups) ? startups : [];
                const oppsArr = Array.isArray(opps) ? opps : opps.opportunities || [];
                const paymentsArr = Array.isArray(payments) ? payments : [];
                const appsArr = Array.isArray(apps) ? apps : apps.applications || [];

                const totalRevenue = paymentsArr
                    .filter((p) => p.payment_status === "paid")
                    .reduce((sum, p) => sum + (p.amount || 0), 0);

                setStats({
                    users:         usersArr.length,
                    startups:      startupsArr.length,
                    opps:          oppsArr.length,
                    revenue:       totalRevenue,
                    pendingStartups: startupsArr.filter((s) => s.status === "pending").length,
                    pendingApps:     appsArr.filter((a) => a.status === "pending").length,
                    blockedUsers:    usersArr.filter((u) => u.isBlocked).length,
                });

                setChartData([
                    { name: "Users",         value: usersArr.length,    fill: "#3b82f6" },
                    { name: "Startups",      value: startupsArr.length, fill: "#8b5cf6" },
                    { name: "Opportunities", value: oppsArr.length,     fill: "#f59e0b" },
                ]);

                const revenueByMonth = {};
                paymentsArr.forEach((p) => {
                    if (p.payment_status !== "paid" || !p.paid_at) return;
                    const date = new Date(p.paid_at);
                    const key = `${date.toLocaleString("en-US", { month: "short" })}`;
                    revenueByMonth[key] = (revenueByMonth[key] || 0) + (p.amount || 0);
                });

                const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                const sortedMonths = monthOrder
                    .filter((m) => revenueByMonth[m] !== undefined)
                    .map((name) => ({ name, amount: revenueByMonth[name] }));

                setRevenueChartData(sortedMonths.length > 0 ? sortedMonths : [{ name: "No data", amount: 0 }]);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { key: "users",    value: stats.users,    label: "Total Users",        icon: FiUsers,      color: "#3b82f6", bg: "bg-blue-500/10",  text: "text-blue-500"  },
        { key: "startups", value: stats.startups, label: "Total Startups",     icon: FiZap,        color: "#8b5cf6", bg: "bg-violet-500/10", text: "text-violet-500" },
        { key: "opps",     value: stats.opps,     label: "Total Opportunities",icon: FiBriefcase,  color: "#f59e0b", bg: "bg-amber-500/10",  text: "text-amber-500"  },
        { key: "revenue",  value: `$${stats.revenue}`, label: "Total Revenue", icon: FiDollarSign, color: "#10b981", bg: "bg-emerald-500/10", text: "text-emerald-500" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">
                    Welcome, {session?.user?.name?.split(" ")[0] || "Admin"} 👋
                </h1>
                <p className="text-sm text-base-content/50 mt-1">
                    Admin dashboard overview.
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {statCards.map(({ key, value, label, icon: Icon, color, bg, text }) => (
                    <div
                        key={key}
                        className="rounded-2xl border border-base-300 bg-base-100 p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-base-300/20 transition-shadow duration-300"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                            <Icon size={22} className={text} />
                        </div>
                        <div>
                            {loading ? (
                                <div className="h-7 w-14 rounded bg-base-300 animate-pulse mb-1" />
                            ) : (
                                <p className="text-2xl font-black text-base-content">{value}</p>
                            )}
                            <p className="text-xs text-base-content/50">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Revenue Trend Chart */}
                <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <FiTrendingUp size={16} className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base-content text-sm">Revenue Trend</h3>
                            <p className="text-xs text-base-content/40">Payments over time</p>
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        {loading ? (
                            <div className="h-full w-full rounded-xl bg-base-300 animate-pulse" />
                        ) : revenueChartData.length === 0 || (revenueChartData.length === 1 && revenueChartData[0].amount === 0) ? (
                            <div className="h-full flex items-center justify-center text-sm text-base-content/40">
                                No revenue data yet
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.1)" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--bc) / 0.5)" }} axisLine={{ stroke: "hsl(var(--bc) / 0.1)" }} />
                                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--bc) / 0.5)" }} axisLine={{ stroke: "hsl(var(--bc) / 0.1)" }} tickFormatter={(v) => `$${v}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "hsl(var(--b1))", border: "1px solid hsl(var(--bc) / 0.15)", borderRadius: "12px", fontSize: "12px" }}
                                        formatter={(value) => [`$${value}`, "Revenue"]}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Stats Bar Chart */}
                <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <FiActivity size={16} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base-content text-sm">Platform Overview</h3>
                            <p className="text-xs text-base-content/40">Users, startups & opportunities</p>
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        {loading ? (
                            <div className="h-full w-full rounded-xl bg-base-300 animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.1)" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--bc) / 0.5)" }} axisLine={{ stroke: "hsl(var(--bc) / 0.1)" }} />
                                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--bc) / 0.5)" }} axisLine={{ stroke: "hsl(var(--bc) / 0.1)" }} />
                                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--b1))", border: "1px solid hsl(var(--bc) / 0.15)", borderRadius: "12px", fontSize: "12px" }} />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

            </div>

            {/* ── Quick Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                        <FiClock size={18} className="text-warning" />
                    </div>
                    <div>
                        <p className="text-lg font-black text-base-content">{loading ? "..." : stats.pendingStartups}</p>
                        <p className="text-xs text-base-content/50">Pending Startups</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
                        <FiAlertTriangle size={18} className="text-error" />
                    </div>
                    <div>
                        <p className="text-lg font-black text-base-content">{loading ? "..." : stats.blockedUsers}</p>
                        <p className="text-xs text-base-content/50">Blocked Users</p>
                    </div>
                </div>
                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                        <FiBriefcase size={18} className="text-info" />
                    </div>
                    <div>
                        <p className="text-lg font-black text-base-content">{loading ? "..." : stats.pendingApps}</p>
                        <p className="text-xs text-base-content/50">Pending Applications</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
