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
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area,
} from "recharts";

const useDaisyColor = (textClass, fallback = "#888888") => {
    const [color, setColor] = useState(fallback);
    useEffect(() => {
        const el = document.createElement("span");
        el.className = textClass;
        el.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
        document.body.appendChild(el);
        const resolved = getComputedStyle(el).color;
        document.body.removeChild(el);
        if (resolved) setColor(resolved);
    }, [textClass]);
    return color;
};

const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CHART_HEIGHT = 256;

export default function AdminOverviewPage() {
    const { data: session } = authClient.useSession();
    const [stats, setStats] = useState({
        users: 0, startups: 0, opps: 0, revenue: 0,
        pendingStartups: 0, pendingApps: 0, blockedUsers: 0,
    });
    const [chartData, setChartData]           = useState([]);
    const [revenueChartData, setRevenueChartData] = useState([]);
    const [loading, setLoading]               = useState(true);

    // Each resolves to a real rgb() string the browser computed for that theme
    const primaryColor   = useDaisyColor("text-primary",       "#6366f1");
    const secondaryColor = useDaisyColor("text-secondary",     "#8b5cf6");
    const infoColor      = useDaisyColor("text-info",          "#3b82f6");
    const warningColor   = useDaisyColor("text-warning",       "#f59e0b");
    const successColor   = useDaisyColor("text-success",       "#10b981");
    const mutedColor     = useDaisyColor("text-base-content",  "#64748b");

    useEffect(() => {
        Promise.all([
            getUsers().catch(() => []),
            getAllStartups().catch(() => []),
            getOpportunities().catch(() => []),
            getPayments().catch(() => []),
            getApplications().catch(() => []),
        ])
            .then(([users, startups, opps, payments, apps]) => {
                const usersArr    = Array.isArray(users)    ? users    : [];
                const startupsArr = Array.isArray(startups) ? startups : [];
                const oppsArr     = Array.isArray(opps)     ? opps     : opps.opportunities || [];
                const paymentsArr = Array.isArray(payments) ? payments : [];
                const appsArr     = Array.isArray(apps)     ? apps     : apps.applications  || [];

                const totalRevenue = paymentsArr
                    .filter((p) => p.payment_status === "paid")
                    .reduce((sum, p) => sum + (p.amount || 0), 0);

                setStats({
                    users:           usersArr.length,
                    startups:        startupsArr.length,
                    opps:            oppsArr.length,
                    revenue:         totalRevenue,
                    pendingStartups: startupsArr.filter((s) => s.status === "pending").length,
                    pendingApps:     appsArr.filter((a)  => a.status  === "pending").length,
                    blockedUsers:    usersArr.filter((u)  => u.isBlocked).length,
                });

                // colors are assigned at render time from resolved state
                setChartData([
                    { name: "Users",         value: usersArr.length,    color: "primary"   },
                    { name: "Startups",      value: startupsArr.length, color: "secondary" },
                    { name: "Opportunities", value: oppsArr.length,     color: "info"      },
                ]);

                const revenueByMonth = {};
                paymentsArr.forEach((p) => {
                    if (p.payment_status !== "paid" || !p.paid_at) return;
                    const key = new Date(p.paid_at).toLocaleString("en-US", { month: "short" });
                    revenueByMonth[key] = (revenueByMonth[key] || 0) + (p.amount || 0);
                });

                const sorted = monthOrder
                    .filter((m) => revenueByMonth[m] !== undefined)
                    .map((name) => ({ name, amount: revenueByMonth[name] }));

                setRevenueChartData(
                    sorted.length > 0 ? sorted : [{ name: "No data", amount: 0 }]
                );
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const colorMap = { primary: primaryColor, secondary: secondaryColor, info: infoColor };

    const statCards = [
        { key: "users",   value: stats.users,         label: "Total Users",         icon: FiUsers,      bg: "bg-primary/10",   text: "text-primary"   },
        { key: "startup", value: stats.startups,      label: "Total Startups",      icon: FiZap,        bg: "bg-secondary/10", text: "text-secondary" },
        { key: "opps",    value: stats.opps,          label: "Total Opportunities", icon: FiBriefcase,  bg: "bg-info/10",      text: "text-info"      },
        { key: "revenue", value: `$${stats.revenue}`, label: "Total Revenue",       icon: FiDollarSign, bg: "bg-success/10",   text: "text-success"   },
    ];

    // Tooltip uses inline styles — CSS vars work fine here (not SVG attributes)
    const tooltipStyle = {
        backgroundColor: "var(--color-base-100)",
        border:          "1px solid var(--color-base-300)",
        borderRadius:    "12px",
        fontSize:        "12px",
        color:           "var(--color-base-content)",
        boxShadow:       "0 4px 16px rgba(0,0,0,0.15)",
    };

    // SVG attributes need real color values — use resolved mutedColor with opacity
    const axisTick = { fontSize: 11, fill: mutedColor, fillOpacity: 0.5 };
    const gridStroke = mutedColor;

    return (
        <div className="flex flex-col gap-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-base-content">
                    Welcome, {session?.user?.name?.split(" ")[0] || "Admin"} 👋
                </h1>
                <p className="text-sm text-base-content/50 mt-1">
                    Here&apos;s what&apos;s happening across the platform.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map(({ key, value, label, icon: Icon, bg, text }) => (
                    <div key={key} className="rounded-2xl border border-base-300 bg-base-100 p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-base-300/20 transition-shadow duration-300">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                            <Icon size={22} className={text} />
                        </div>
                        <div className="min-w-0">
                            {loading
                                ? <div className="h-7 w-16 rounded bg-base-300 animate-pulse mb-1.5" />
                                : <p className="text-2xl font-black text-base-content leading-tight">{value}</p>
                            }
                            <p className="text-xs text-base-content/50 leading-tight">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Revenue Trend */}
                <div className="rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                            <FiTrendingUp size={16} className="text-success" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base-content text-sm">Revenue Trend</h3>
                            <p className="text-xs text-base-content/40">Payments over time</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-xl bg-base-300 animate-pulse" style={{ height: CHART_HEIGHT }} />
                    ) : revenueChartData.length === 1 && revenueChartData[0].amount === 0 ? (
                        <div className="flex items-center justify-center text-sm text-base-content/40" style={{ height: CHART_HEIGHT }}>
                            No revenue data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                            <AreaChart data={revenueChartData} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor={successColor} stopOpacity={0.35} />
                                        <stop offset="95%" stopColor={successColor} stopOpacity={0}    />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} strokeOpacity={0.12} vertical={false} />
                                <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                                <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={48} />
                                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}`, "Revenue"]} />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke={successColor}
                                    strokeWidth={2.5}
                                    fill="url(#revenueGradient)"
                                    dot={{ fill: successColor, r: 4, strokeWidth: 0 }}
                                    activeDot={{ fill: successColor, r: 5, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Platform Overview */}
                <div className="rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
                            <FiActivity size={16} className="text-info" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base-content text-sm">Platform Overview</h3>
                            <p className="text-xs text-base-content/40">Users, startups &amp; opportunities</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-xl bg-base-300 animate-pulse" style={{ height: CHART_HEIGHT }} />
                    ) : (
                        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                            <BarChart data={chartData} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} strokeOpacity={0.12} vertical={false} />
                                <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48} maxBarSize={64}>
                                    {chartData.map((entry) => (
                                        <Cell key={entry.name} fill={colorMap[entry.color]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                    { value: stats.pendingStartups, label: "Pending Startups",     icon: FiClock,         bg: "bg-warning/10", text: "text-warning" },
                    { value: stats.blockedUsers,    label: "Blocked Users",        icon: FiAlertTriangle, bg: "bg-error/10",   text: "text-error"   },
                    { value: stats.pendingApps,     label: "Pending Applications", icon: FiBriefcase,     bg: "bg-info/10",    text: "text-info"    },
                ].map(({ value, label, icon: Icon, bg, text }) => (
                    <div key={label} className="rounded-2xl border border-base-300 bg-base-100 p-5 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                            <Icon size={18} className={text} />
                        </div>
                        <div className="min-w-0">
                            {loading
                                ? <div className="h-6 w-10 rounded bg-base-300 animate-pulse mb-1" />
                                : <p className="text-lg font-black text-base-content leading-tight">{value}</p>
                            }
                            <p className="text-xs text-base-content/50 leading-tight">{label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}