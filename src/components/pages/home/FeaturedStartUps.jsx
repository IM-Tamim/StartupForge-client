"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { getStartups } from "@/lib/api/startups";
import StartupCard from "@/components/ui/StartupCard";
import StartupCardSkeleton from "@/components/ui/StartupCardSkeleton";

export default function FeaturedStartUps() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStartups({ limit: 4 })
            .then((data) => {
                const arr = Array.isArray(data) ? data : [];
                setStartups(arr.slice(0, 4));
            })
            .catch(() => setStartups([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-20 bg-base-200">
            <div className="max-w-6xl mx-auto px-6">

                <div className="flex items-end justify-between mb-10 gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                            Discover
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
                            Featured Startups
                        </h2>
                    </div>
                    <Link
                        href="/startups"
                        className="btn btn-sm btn-outline btn-secondary rounded-xl hidden sm:flex gap-1.5"
                    >
                        View All <FiArrowRight size={13} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <StartupCardSkeleton key={i} />
                        ))}
                    </div>
                ) : startups.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border border-base-300 bg-base-100 text-base-content/40">
                        <p className="text-lg font-semibold mb-2">No startups yet</p>
                        <p className="text-sm text-base-content/30 mb-5">Be the first to create a startup profile</p>
                        <Link href="/signup" className="btn btn-secondary btn-sm rounded-xl">
                            Get Started
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {startups.map((s) => (
                            <StartupCard key={s._id} startup={s} />
                        ))}
                    </div>
                )}

                <div className="mt-6 flex sm:hidden justify-center">
                    <Link href="/startups" className="btn btn-outline btn-secondary rounded-xl btn-sm gap-1.5">
                        View All Startups <FiArrowRight size={13} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
