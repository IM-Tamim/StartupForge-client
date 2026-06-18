"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    FiCheckCircle, FiXCircle, FiClock, FiUsers,
    FiArrowLeft, FiExternalLink, FiFilter, FiX,
} from "react-icons/fi";
import { getApplications } from "@/lib/api/applications";
import { getOpportunities } from "@/lib/api/opportunities";
import { updateApplicationStatus } from "@/lib/actions/applications";

const statusStyles = {
    pending:  { badge: "badge-warning",   icon: FiClock,        color: "text-warning" },
    accepted: { badge: "badge-success",   icon: FiCheckCircle,  color: "text-success" },
    rejected: { badge: "badge-error",     icon: FiXCircle,      color: "text-error" },
};

export default function FounderApplicationsPage() {
    const { data: session } = authClient.useSession();
    const [apps, setApps]         = useState([]);
    const [opps, setOpps]         = useState([]);
    const [loading, setLoading]   = useState(true);
    const [filterOpp, setFilterOpp] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [actingId, setActingId] = useState(null);

    useEffect(() => {
        if (!session?.user) return;
        const email = session.user.email;

        Promise.all([
            getApplications({ founder_email: email }),
            getOpportunities({ founder_email: email }),
        ])
            .then(([appsData, oppsData]) => {
                const appsArr = Array.isArray(appsData) ? appsData : appsData.applications || [];
                const oppsArr = Array.isArray(oppsData) ? oppsData : oppsData.opportunities || [];
                setApps(appsArr);
                setOpps(oppsArr);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    // Build opportunity map for quick lookup
    const oppMap = opps.reduce((acc, o) => { acc[o._id] = o; return acc; }, {});

    const filtered = apps.filter((a) => {
        const matchOpp = filterOpp === "all" || a.opportunity_id === filterOpp;
        const matchStatus = filterStatus === "all" || a.status === filterStatus;
        return matchOpp && matchStatus;
    });

    const handleStatus = async (id, status) => {
        setActingId(id);
        try {
            const data = await updateApplicationStatus(id, status);
            if (data.modifiedCount > 0) {
                toast.success(`Application ${status}.`);
                setApps((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
            }
        } catch (err) {
            toast.error(err.message || "Action failed.");
        } finally {
            setActingId(null);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">Applications</h1>
                <p className="text-sm text-base-content/50 mt-1">
                    {apps.length} total · {apps.filter((a) => a.status === "pending").length} pending
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex items-center gap-2 flex-1">
                    <FiFilter size={14} className="text-base-content/40" />
                    <select
                        value={filterOpp}
                        onChange={(e) => setFilterOpp(e.target.value)}
                        className="py-3 px-3 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary flex-1 sm:w-56"
                    >
                        <option value="all">All Opportunities</option>
                        {opps.map((o) => (
                            <option key={o._id} value={o._id}>{o.role_title}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="py-3 px-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary w-36"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    {(filterOpp !== "all" || filterStatus !== "all") && (
                        <button
                            onClick={() => { setFilterOpp("all"); setFilterStatus("all"); }}
                            className="btn btn-ghost btn-xs btn-square rounded-xl"
                        >
                            <FiX size={12} />
                        </button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-base-300 bg-base-100 text-base-content/40">
                    <FiUsers size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="mb-2">No applications match your filters.</p>
                    <Link href="/dashboard/founder/add-opportunity" className="btn btn-secondary btn-sm rounded-xl">
                        Post an Opportunity
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map((app) => {
                        const opp = oppMap[app.opportunity_id];
                        const style = statusStyles[app.status] || statusStyles.pending;
                        const StatusIcon = style.icon;

                        return (
                            <div key={app._id} className="rounded-2xl border border-base-300 bg-base-100 p-5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="font-bold text-base-content text-sm">
                                                {app.applicant_email}
                                            </p>
                                            <span className={`badge badge-sm capitalize ${style.badge}`}>
                                                <StatusIcon size={10} className="mr-1" />
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-base-content/50">
                                            {app.role_title || opp?.role_title || "Opportunity"}
                                            {app.startup_name || opp?.startup_name ? ` · ${app.startup_name || opp.startup_name}` : ""}
                                        </p>
                                    </div>
                                    <span className="text-xs text-base-content/30 shrink-0">
                                        <FiClock size={10} className="inline mr-1" />
                                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ""}
                                    </span>
                                </div>

                                {/* Motivation */}
                                {app.motivation && (
                                    <p className="text-sm text-base-content/60 leading-relaxed bg-base-200 rounded-xl px-4 py-3 mb-3">
                                        {app.motivation}
                                    </p>
                                )}

                                {/* Portfolio + Actions */}
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-3">
                                        {app.portfolio_link && (
                                            <a
                                                href={app.portfolio_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-secondary hover:opacity-70 transition-opacity"
                                            >
                                                <FiExternalLink size={12} /> Portfolio
                                            </a>
                                        )}
                                    </div>

                                    {app.status === "pending" ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatus(app._id, "accepted")}
                                                disabled={actingId === app._id}
                                                className="btn btn-success btn-sm rounded-xl gap-1.5"
                                            >
                                                {actingId === app._id
                                                    ? <span className="loading loading-spinner loading-xs" />
                                                    : <FiCheckCircle size={13} />
                                                }
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatus(app._id, "rejected")}
                                                disabled={actingId === app._id}
                                                className="btn btn-error btn-sm btn-outline rounded-xl gap-1.5"
                                            >
                                                <FiXCircle size={13} /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`text-xs font-medium ${style.color}`}>
                                            {app.status === "accepted" ? "Accepted" : "Rejected"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
