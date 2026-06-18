"use client";
import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getOpportunities } from "@/lib/api/opportunities";
import OpportunityCard from "@/components/ui/OpportunityCard";
import OpportunityCardSkeleton from "@/components/ui/OpportunityCardSkeleton";

const WORK_TYPES = ["Remote", "On-site", "Hybrid"];
const INDUSTRIES = [
    "Tech", "Health", "Fintech", "EdTech",
    "SaaS", "E-commerce", "AI/ML", "CleanTech",
    "HealthTech", "FinTech", "Other",
];
const PER_PAGE = 9;

export default function BrowseOpportunitiesPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [total, setTotal]                 = useState(0);
    const [loading, setLoading]             = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch]           = useState("");
    const [workType, setWorkType]       = useState("");
    const [industry, setIndustry]       = useState("");
    const [page, setPage]               = useState(1);

    const totalPages = Math.ceil(total / PER_PAGE);
    const hasFilters = search || workType || industry;

    const fetchOpportunities = useCallback((params) => {
        setLoading(true);
        getOpportunities({ page: params.page, perPage: PER_PAGE, ...params })
            .then((data) => {
                if (data && typeof data.total === "number") {
                    setOpportunities(data.opportunities || []);
                    setTotal(data.total);
                } else {
                    setOpportunities([]);
                    setTotal(0);
                }
            })
            .catch(() => { setOpportunities([]); setTotal(0); })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchOpportunities({ page, search, workType, industry });
    }, [page, search, workType, industry, fetchOpportunities]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleWorkType = (val) => { setWorkType(val); setPage(1); };
    const handleIndustry = (val) => { setIndustry(val); setPage(1); };

    const clearFilters = () => {
        setSearch("");
        setSearchInput("");
        setWorkType("");
        setIndustry("");
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                        Explore
                    </p>
                    <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">
                        Browse Opportunities
                    </h1>
                    <p className="text-sm text-base-content/50">
                        Find roles that match your skills and join exciting startup teams.
                    </p>
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <FiSearch
                                size={15}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
                            />
                            <input
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by role or skill…"
                                className="w-full h-10 pl-11 pr-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                            />
                        </div>
                        <button type="submit" className="btn btn-secondary rounded-xl px-5">
                            Search
                        </button>
                    </form>

                    <div className="flex gap-2">
                        <select
                            value={workType}
                            onChange={(e) => handleWorkType(e.target.value)}
                            className="py-2.5 px-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors flex-1 sm:w-36"
                        >
                            <option value="">All Types</option>
                            {WORK_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>

                        <select
                            value={industry}
                            onChange={(e) => handleIndustry(e.target.value)}
                            className="py-2.5 px-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors flex-1 sm:w-40"
                        >
                            <option value="">All Industries</option>
                            {INDUSTRIES.map((i) => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Count + clear */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <p className="text-xs text-base-content/40">
                        {loading
                            ? "Loading…"
                            : `${total} opportunit${total !== 1 ? "ies" : "y"} found`
                        }
                    </p>
                    {hasFilters && !loading && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 text-xs text-base-content/50 hover:text-error transition-colors"
                        >
                            <FiX size={12} /> Clear filters
                        </button>
                    )}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: PER_PAGE }).map((_, i) => (
                            <OpportunityCardSkeleton key={i} />
                        ))}
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl border border-base-300 bg-base-100">
                        <p className="text-lg font-semibold text-base-content/40 mb-2">No opportunities found</p>
                        <p className="text-sm text-base-content/30 mb-5">Try adjusting your search or filters</p>
                        <button onClick={clearFilters} className="btn btn-secondary btn-sm rounded-xl">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {opportunities.map((opp) => (
                            <OpportunityCard key={opp._id} opportunity={opp} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="btn btn-sm btn-ghost btn-outline rounded-xl disabled:opacity-30"
                        >
                            <FiChevronLeft size={15} />
                        </button>

                        <div className="flex gap-1.5">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                .reduce((acc, p, idx, arr) => {
                                    if (idx > 0 && arr[idx - 1] !== p - 1) {
                                        acc.push("...");
                                    }
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((item, idx) =>
                                    item === "..." ? (
                                        <span key={`dots-${idx}`} className="px-2 text-xs text-base-content/30 self-center">
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => setPage(item)}
                                            className={`btn btn-sm rounded-xl w-9 ${
                                                page === item
                                                    ? "btn-secondary"
                                                    : "btn-ghost btn-outline"
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}
                        </div>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="btn btn-sm btn-ghost btn-outline rounded-xl disabled:opacity-30"
                        >
                            <FiChevronRight size={15} />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}