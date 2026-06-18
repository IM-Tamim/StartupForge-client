"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { getOpportunities } from "@/lib/api/opportunities";
import OpportunityCard from "@/components/ui/OpportunityCard";
import OpportunityCardSkeleton from "@/components/ui/OpportunityCardSkeleton";

export default function FeaturedOpportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOpportunities({ limit: 4 })
            .then((data) => {
                const arr = Array.isArray(data) ? data : [];
                setOpportunities(arr.slice(0, 4));
            })
            .catch(() => setOpportunities([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-20 bg-base-100">
            <div className="max-w-6xl mx-auto px-6">

                <div className="flex items-end justify-between mb-10 gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                            Open Roles
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
                            Featured Opportunities
                        </h2>
                    </div>
                    <Link
                        href="/opportunities"
                        className="btn btn-sm btn-outline btn-secondary rounded-xl hidden sm:flex gap-1.5"
                    >
                        View All <FiArrowRight size={13} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <OpportunityCardSkeleton key={i} />
                        ))}
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border border-base-300 bg-base-100 text-base-content/40">
                        <p className="text-lg font-semibold mb-2">No opportunities yet</p>
                        <p className="text-sm text-base-content/30 mb-5">Founders are building — check back soon</p>
                        <Link href="/startups" className="btn btn-primary btn-sm rounded-xl">
                            Browse Startups
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {opportunities.map((o) => (
                            <OpportunityCard key={o._id} opportunity={o} />
                        ))}
                    </div>
                )}

                <div className="mt-6 flex sm:hidden justify-center">
                    <Link href="/opportunities" className="btn btn-outline btn-primary rounded-xl btn-sm gap-1.5">
                        View All Opportunities <FiArrowRight size={13} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
