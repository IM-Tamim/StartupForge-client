"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FiExternalLink, FiClock, FiBriefcase } from "react-icons/fi";
import { getApplications } from "@/lib/api/applications";

const statusStyles = {
    pending:  "badge-warning",
    accepted: "badge-success",
    rejected: "badge-error",
};

export default function MyApplicationsPage() {
    const { data: session }     = authClient.useSession();
    const [apps, setApps]       = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        getApplications({ applicant_email: session.user.email })
            .then((data) => setApps(Array.isArray(data) ? data : data.applications || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">My Applications</h1>
                <p className="text-sm text-base-content/50 mt-1">
                    {apps.length} application{apps.length !== 1 ? "s" : ""} submitted
                </p>
            </div>

            {apps.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-base-300 bg-base-100 text-base-content/40">
                    <FiBriefcase size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="mb-4">You haven&apos;t applied to any opportunities yet.</p>
                    <Link href="/opportunities" className="btn btn-secondary btn-sm rounded-xl">
                        Browse Opportunities
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {apps.map((app) => (
                        <div key={app._id} className="rounded-2xl border border-base-300 bg-base-100 p-5">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="min-w-0">
                                    <p className="font-bold text-base-content truncate">
                                        {app.role_title || "Opportunity"}
                                    </p>
                                    <p className="text-xs text-base-content/50 mt-0.5">
                                        {app.startup_name || "Startup"}
                                    </p>
                                </div>
                                <span className={`badge badge-sm shrink-0 capitalize ${statusStyles[app.status] || "badge-ghost"}`}>
                                    {app.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                {app.applied_at && (
                                    <span className="flex items-center gap-1 text-xs text-base-content/40">
                                        <FiClock size={11} />
                                        Applied {new Date(app.applied_at).toLocaleDateString()}
                                    </span>
                                )}
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

                            {app.motivation && (
                                <p className="mt-3 text-sm text-base-content/60 leading-relaxed bg-base-200 rounded-xl px-4 py-3 line-clamp-2">
                                    {app.motivation}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
