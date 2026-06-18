"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { getStartups } from "@/lib/api/startups";
import StartupCard from "@/components/ui/StartupCard";
import StartupCardSkeleton from "@/components/ui/StartupCardSkeleton";

const industries = [
    "Tech", "Health", "Fintech", "EdTech",
    "SaaS", "E-commerce", "AI/ML", "CleanTech",
    "HealthTech", "FinTech", "Other",
];

export default function BrowseStartupsPage() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [industry, setIndustry] = useState("");

    const fetchStartups = (s = "", i = "") => {
        setLoading(true);
        const params = {};
        if (s) params.search = s;
        if (i) params.industry = i;
        getStartups(params)
            .then((data) => setStartups(Array.isArray(data) ? data : []))
            .catch(() => setStartups([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchStartups(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        fetchStartups(searchInput, industry);
    };

    const handleIndustry = (val) => {
        setIndustry(val);
        fetchStartups(search, val);
    };

    const clearFilters = () => {
        setSearch("");
        setSearchInput("");
        setIndustry("");
        fetchStartups();
    };

    const hasFilters = search || industry;

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                        Discover
                    </p>
                    <h1 className="text-4xl font-black text-base-content tracking-tight mb-2">
                        Browse Startups
                    </h1>
                    <p className="text-sm text-base-content/50">
                        Find exciting startups to collaborate with and make an impact.
                    </p>
                </div>

                {/* Search + Industry filter */}
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
                                placeholder="Search by name or description…"
                                className="w-full h-10 pl-11 pr-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                            />
                        </div>
                        <button type="submit" className="btn btn-secondary rounded-xl px-5">
                            Search
                        </button>
                    </form>

                    <select
                        value={industry}
                        onChange={(e) => handleIndustry(e.target.value)}
                        className="py-2.5 px-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors sm:w-48"
                    >
                        <option value="">All Industries</option>
                        {industries.map((i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </div>

                {/* Count + clear */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <p className="text-xs text-base-content/40">
                        {loading
                            ? "Loading…"
                            : `${startups.length} startup${startups.length !== 1 ? "s" : ""} found`
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
                        {Array.from({ length: 6 }).map((_, i) => (
                            <StartupCardSkeleton key={i} />
                        ))}
                    </div>
                ) : startups.length === 0 ? (
                    <div className="text-center py-24 rounded-2xl border border-base-300 bg-base-100 mb-5">
                        <p className="text-lg font-semibold text-base-content/40 mb-2">No startups found</p>
                        <p className="text-sm text-base-content/30 mb-5">Try adjusting your search or filters</p>
                        <button onClick={clearFilters} className="btn btn-secondary btn-sm rounded-xl">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {startups.map((s) => (
                            <StartupCard key={s._id} startup={s} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}