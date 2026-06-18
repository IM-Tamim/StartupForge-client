"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiTag, FiMail, FiZap } from "react-icons/fi";
import { getStartup } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import OpportunityCard from "@/components/ui/OpportunityCard";

const badgeColor = {
    "Pre-Seed":    "badge-ghost",
    "Seed":        "badge-secondary badge-outline",
    "Series A":    "badge-primary badge-outline",
    "Series B":    "badge-accent badge-outline",
    "Bootstrapped":"badge-success badge-outline",
};

const OpportunityCardSkeleton = () => (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-40 rounded bg-base-300 animate-pulse" />
                <div className="h-3 w-24 rounded bg-base-300 animate-pulse" />
            </div>
            <div className="h-5 w-16 rounded-full bg-base-300 animate-pulse" />
        </div>
        <div className="flex gap-2">
            <div className="h-6 w-16 rounded-lg bg-base-300 animate-pulse" />
            <div className="h-6 w-16 rounded-lg bg-base-300 animate-pulse" />
            <div className="h-6 w-16 rounded-lg bg-base-300 animate-pulse" />
        </div>
        <div className="h-9 w-full rounded-xl bg-base-300 animate-pulse mt-auto" />
    </div>
);

export default function StartupDetailPage() {
    const { id } = useParams();
    const [startup, setStartup]         = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loadingStartup, setLoadingStartup]   = useState(true);
    const [loadingOpps, setLoadingOpps]         = useState(true);
    const [error, setError]             = useState(false);

    useEffect(() => {
        if (!id) return;

        // fetch startup
        getStartup(id)
            .then((data) => {
                if (!data?._id) { setError(true); return; }
                setStartup(data);
            })
            .catch(() => setError(true))
            .finally(() => setLoadingStartup(false));

        // fetch this startup's opportunities
        getOpportunities({ startup_id: id })
            .then((data) => setOpportunities(Array.isArray(data) ? data : data.opportunities || []))
            .catch(() => setOpportunities([]))
            .finally(() => setLoadingOpps(false));
    }, [id]);

    // ── Error state ──
    if (!loadingStartup && error) return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
            <div className="text-center">
                <p className="text-4xl font-black text-base-content/10 mb-4">404</p>
                <p className="text-lg font-bold text-base-content mb-2">Startup not found</p>
                <p className="text-sm text-base-content/50 mb-6">This startup may have been removed.</p>
                <Link href="/startups" className="btn btn-secondary btn-sm rounded-xl">
                    Back to Startups
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-5xl mx-auto px-6 py-12">

                {/* Back link */}
                <Link
                    href="/startups"
                    className="inline-flex items-center gap-2 text-sm text-base-content/50 hover:text-secondary transition-colors mb-8"
                >
                    <FiArrowLeft size={14} /> Back to Startups
                </Link>

                {/* ── Startup card ── */}
                {loadingStartup ? (
                    <div className="rounded-2xl border border-base-300 bg-base-100 p-8 mb-8 flex flex-col gap-5">
                        <div className="flex items-start gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-base-300 animate-pulse shrink-0" />
                            <div className="flex flex-col gap-3 flex-1">
                                <div className="h-7 w-48 rounded bg-base-300 animate-pulse" />
                                <div className="h-4 w-32 rounded bg-base-300 animate-pulse" />
                                <div className="h-5 w-20 rounded-full bg-base-300 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="h-3 w-full rounded bg-base-300 animate-pulse" />
                            <div className="h-3 w-full rounded bg-base-300 animate-pulse" />
                            <div className="h-3 w-3/4 rounded bg-base-300 animate-pulse" />
                        </div>
                    </div>
                ) : startup && (
                    <div className="rounded-2xl border border-base-300 bg-base-100 p-8 mb-8">

                        {/* Top row */}
                        <div className="flex items-start gap-5 mb-6">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-secondary/10 border border-base-300 flex items-center justify-center">
                                {startup.logo ? (
                                    <Image
                                        src={startup.logo}
                                        alt={startup.startup_name}
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-3xl font-black text-secondary">
                                        {startup.startup_name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h1 className="text-3xl font-black text-base-content mb-1">
                                    {startup.startup_name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className={`badge badge-sm ${badgeColor[startup.funding_stage] || "badge-ghost"}`}>
                                        {startup.funding_stage}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-base-content/50">
                                        <FiTag size={11} className="text-secondary" />
                                        {startup.industry}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-base-content/70 leading-relaxed mb-6">
                            {startup.description}
                        </p>

                        {/* Footer */}
                        <div className="pt-5 border-t border-base-300 flex items-center gap-2 text-sm text-base-content/40">
                            <FiMail size={13} className="text-secondary" />
                            <span>{startup.founder_email}</span>
                        </div>
                    </div>
                )}

                {/* ── Opportunities ── */}
                <div>
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">
                            Open Roles
                        </p>
                        <h2 className="text-xl font-black text-base-content">
                            Opportunities at {startup?.startup_name || "this startup"}
                        </h2>
                    </div>

                    {loadingOpps ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <OpportunityCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : opportunities.length === 0 ? (
                        <div className="text-center py-14 rounded-2xl border border-base-300 bg-base-100">
                            <FiZap size={32} className="mx-auto text-base-content/10 mb-3" />
                            <p className="text-sm font-semibold text-base-content/40 mb-1">No open roles right now</p>
                            <p className="text-xs text-base-content/30">Check back later or browse other startups.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {opportunities.map((opp) => (
                                <OpportunityCard key={opp._id} opportunity={opp} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}