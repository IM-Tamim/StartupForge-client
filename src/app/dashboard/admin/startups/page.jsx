"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    FiZap, FiCheckCircle, FiTrash2, FiFilter,
    FiSearch, FiX, FiClock,
} from "react-icons/fi";
import { getAllStartups } from "@/lib/api/startups";
import { approveStartup, deleteStartupAdmin } from "@/lib/actions/startups";

const statusTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
];

export default function AdminStartupsPage() {
    const [startups, setStartups]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [activeTab, setActiveTab]   = useState("all");
    const [search, setSearch]         = useState("");
    const [actingId, setActingId]     = useState(null);

    useEffect(() => {
        fetchStartups();
    }, [activeTab]);

    const fetchStartups = () => {
        setLoading(true);
        const statusParam = activeTab === "all" ? "" : activeTab;
        getAllStartups(statusParam)
            .then((data) => setStartups(Array.isArray(data) ? data : []))
            .catch(() => setStartups([]))
            .finally(() => setLoading(false));
    };

    const handleApprove = async (id) => {
        setActingId(id);
        try {
            const data = await approveStartup(id);
            if (data.modifiedCount > 0) {
                toast.success("Startup approved!");
                setStartups((prev) => prev.map((s) => s._id === id ? { ...s, status: "approved" } : s));
            }
        } catch (err) {
            toast.error(err.message || "Approval failed.");
        } finally {
            setActingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Remove this startup permanently?")) return;
        setActingId(id);
        try {
            const data = await deleteStartupAdmin(id);
            if (data.deletedCount > 0) {
                toast.success("Startup removed.");
                setStartups((prev) => prev.filter((s) => s._id !== id));
            }
        } catch (err) {
            toast.error(err.message || "Remove failed.");
        } finally {
            setActingId(null);
        }
    };

    const filtered = startups.filter((s) => {
        const q = search.toLowerCase();
        return (
            (s.startup_name || "").toLowerCase().includes(q) ||
            (s.industry || "").toLowerCase().includes(q) ||
            (s.founder_email || "").toLowerCase().includes(q)
        );
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">Manage Startups</h1>
                <p className="text-sm text-base-content/50 mt-1">
                    {startups.length} startup{startups.length !== 1 ? "s" : ""} · {startups.filter((s) => s.status === "pending").length} pending approval
                </p>
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex gap-1">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                activeTab === tab.key
                                    ? "bg-secondary text-secondary-content"
                                    : "bg-base-100 text-base-content/60 hover:text-base-content border border-base-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1">
                    <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search startups…"
                        className="w-full h-10 pl-11 pr-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-error"
                        >
                            <FiX size={14} />
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg text-secondary" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-base-300 bg-base-100 text-base-content/40">
                    <FiZap size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No startups found.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((s) => (
                        <div key={s._id} className="rounded-2xl border border-base-300 bg-base-100 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 min-w-0">
                                    {/* Logo */}
                                    <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0 overflow-hidden">
                                        {s.logo ? (
                                            <img src={s.logo} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <FiZap size={20} className="text-secondary" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="font-bold text-base-content text-sm">{s.startup_name}</p>
                                            {s.status === "pending" ? (
                                                <span className="badge badge-sm badge-warning gap-1">
                                                    <FiClock size={10} /> Pending
                                                </span>
                                            ) : (
                                                <span className="badge badge-sm badge-success gap-1">
                                                    <FiCheckCircle size={10} /> Approved
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-base-content/50">{s.founder_email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="badge badge-sm badge-outline border-base-content/20 text-base-content/60">
                                                {s.industry || "Unknown"}
                                            </span>
                                            <span className="text-xs text-base-content/40">
                                                {s.funding_stage || "Pre-Seed"}
                                            </span>
                                        </div>
                                        {s.description && (
                                            <p className="text-xs text-base-content/40 mt-1 line-clamp-1">
                                                {s.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    {s.status === "pending" && (
                                        <button
                                            onClick={() => handleApprove(s._id)}
                                            disabled={actingId === s._id}
                                            className="btn btn-success btn-sm rounded-xl gap-1.5"
                                        >
                                            {actingId === s._id
                                                ? <span className="loading loading-spinner loading-xs" />
                                                : <><FiCheckCircle size={13} /> Approve</>
                                            }
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(s._id)}
                                        disabled={actingId === s._id}
                                        className="btn btn-error btn-sm btn-outline rounded-xl gap-1.5"
                                    >
                                        <FiTrash2 size={13} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
