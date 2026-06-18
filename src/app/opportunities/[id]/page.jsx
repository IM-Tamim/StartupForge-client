"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    FiArrowLeft, FiZap, FiClock, FiMapPin, FiBriefcase,
    FiCalendar, FiSend, FiCheckCircle, FiX, FiAlertCircle,
} from "react-icons/fi";
import { getOpportunity } from "@/lib/api/opportunities";
import { authClient } from "@/lib/auth-client";

const workTypeBadge = {
    "Remote":  "badge-secondary badge-outline",
    "On-site": "badge-ghost",
    "Hybrid":  "badge-primary badge-outline",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const DetailSkeleton = () => (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-8 flex flex-col gap-6 animate-pulse">
        <div className="flex flex-col gap-3">
            <div className="h-8 w-64 rounded bg-base-300" />
            <div className="h-4 w-40 rounded bg-base-300" />
            <div className="flex gap-2 mt-1">
                <div className="h-5 w-16 rounded-full bg-base-300" />
                <div className="h-5 w-16 rounded-full bg-base-300" />
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-base-300" />
            ))}
        </div>
        <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded bg-base-300" />
            <div className="h-3 w-5/6 rounded bg-base-300" />
            <div className="h-3 w-4/6 rounded bg-base-300" />
        </div>
        <div className="h-11 w-40 rounded-xl bg-base-300" />
    </div>
);

// ── Apply Modal ───────────────────────────────────────────────────────────────
function ApplyModal({ opportunity, user, onClose }) {
    const [portfolio, setPortfolio]   = useState("");
    const [motivation, setMotivation] = useState("");
    const [status, setStatus]         = useState("idle"); // idle | loading | success | error
    const [errMsg, setErrMsg]         = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!motivation.trim()) { setErrMsg("Please write a motivation message."); return; }
        setStatus("loading");
        setErrMsg("");

        try {
            const res = await fetch(`${API_BASE}/api/applications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    opportunity_id:  opportunity._id,
                    applicant_email: user.email,
                    portfolio_link:  portfolio,
                    motivation:      motivation,
                    status:          "pending",
                    applied_at:      new Date().toISOString(),
                    // handy denormalised fields for display
                    role_title:      opportunity.role_title,
                    startup_name:    opportunity.startup_name,
                }),
            });

            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                throw new Error(d.message || "Failed to submit");
            }
            setStatus("success");
        } catch (err) {
            setErrMsg(err.message);
            setStatus("error");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className="relative w-full max-w-lg bg-base-100 rounded-2xl border border-base-300 shadow-2xl p-8">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle"
                >
                    <FiX size={16} />
                </button>

                {status === "success" ? (
                    <div className="flex flex-col items-center gap-4 py-6 text-center">
                        <FiCheckCircle size={48} className="text-success" />
                        <h3 className="text-xl font-black text-base-content">Application Sent!</h3>
                        <p className="text-sm text-base-content/60">
                            Your application for <span className="font-semibold text-secondary">{opportunity.role_title}</span> has been submitted. You can track its status in your dashboard.
                        </p>
                        <button onClick={onClose} className="btn btn-secondary rounded-xl mt-2">
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-black text-base-content mb-1">
                            Apply for Role
                        </h3>
                        <p className="text-sm text-base-content/50 mb-6">
                            <span className="font-semibold text-secondary">{opportunity.role_title}</span>
                            {opportunity.startup_name && ` · ${opportunity.startup_name}`}
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Applicant email (read-only) */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
                                    Your Email
                                </label>
                                <input
                                    value={user.email}
                                    readOnly
                                    className="w-full h-10 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content/60 outline-none cursor-not-allowed"
                                />
                            </div>

                            {/* Portfolio */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
                                    Portfolio / LinkedIn / GitHub <span className="text-base-content/30">(optional)</span>
                                </label>
                                <input
                                    type="url"
                                    value={portfolio}
                                    onChange={(e) => setPortfolio(e.target.value)}
                                    placeholder="https://yourportfolio.com"
                                    className="w-full h-10 px-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                                />
                            </div>

                            {/* Motivation */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
                                    Why do you want this role? <span className="text-error">*</span>
                                </label>
                                <textarea
                                    value={motivation}
                                    onChange={(e) => setMotivation(e.target.value)}
                                    rows={4}
                                    placeholder="Tell the founder what makes you a great fit…"
                                    className="w-full px-4 py-3 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors resize-none"
                                />
                            </div>

                            {/* Error */}
                            {errMsg && (
                                <div className="flex items-center gap-2 text-xs text-error bg-error/10 border border-error/20 rounded-xl px-4 py-2.5">
                                    <FiAlertCircle size={13} /> {errMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="btn btn-secondary rounded-xl w-full mt-1"
                            >
                                {status === "loading" ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    <><FiSend size={14} /> Submit Application</>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OpportunityDetailPage() {
    const { id } = useParams();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(false);
    const [showModal, setShowModal]     = useState(false);

    const { data: session } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        if (!id) return;
        getOpportunity(id)
            .then((data) => {
                if (!data?._id) { setError(true); return; }
                setOpportunity(data);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (!loading && error) return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
            <div className="text-center">
                <p className="text-4xl font-black text-base-content/10 mb-4">404</p>
                <p className="text-lg font-bold text-base-content mb-2">Opportunity not found</p>
                <p className="text-sm text-base-content/50 mb-6">This role may have been removed or filled.</p>
                <Link href="/opportunities" className="btn btn-secondary btn-sm rounded-xl">
                    Back to Opportunities
                </Link>
            </div>
        </div>
    );

    const deadlineDate = opportunity?.deadline
        ? new Date(opportunity.deadline)
        : null;
    const isExpired = deadlineDate && deadlineDate < new Date();

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-3xl mx-auto px-6 py-12">

                {/* Back */}
                <Link
                    href="/opportunities"
                    className="inline-flex items-center gap-2 text-sm text-base-content/50 hover:text-secondary transition-colors mb-8"
                >
                    <FiArrowLeft size={14} /> Back to Opportunities
                </Link>

                {loading ? (
                    <DetailSkeleton />
                ) : opportunity && (
                    <div className="flex flex-col gap-6">

                        {/* ── Hero card ── */}
                        <div className="rounded-2xl border border-base-300 bg-base-100 p-8">

                            {/* Title row */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-black text-base-content leading-tight mb-2">
                                        {opportunity.role_title}
                                    </h1>
                                    {opportunity.startup_name && (
                                        <p className="text-sm text-base-content/50">
                                            at{" "}
                                            {opportunity.startup_id ? (
                                                <Link
                                                    href={`/startups/${opportunity.startup_id}`}
                                                    className="text-secondary hover:underline font-medium"
                                                >
                                                    {opportunity.startup_name}
                                                </Link>
                                            ) : (
                                                <span className="font-medium text-base-content/70">
                                                    {opportunity.startup_name}
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                <span className={`badge badge-md shrink-0 ${workTypeBadge[opportunity.work_type] || "badge-ghost"}`}>
                                    {opportunity.work_type}
                                </span>
                            </div>

                            {/* Meta grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                {opportunity.commitment_level && (
                                    <div className="flex flex-col gap-1 bg-base-200 rounded-xl px-4 py-3">
                                        <span className="flex items-center gap-1.5 text-xs text-base-content/40 font-medium">
                                            <FiZap size={11} className="text-secondary" /> Commitment
                                        </span>
                                        <span className="text-sm font-bold text-base-content">
                                            {opportunity.commitment_level}
                                        </span>
                                    </div>
                                )}
                                {opportunity.work_type && (
                                    <div className="flex flex-col gap-1 bg-base-200 rounded-xl px-4 py-3">
                                        <span className="flex items-center gap-1.5 text-xs text-base-content/40 font-medium">
                                            <FiMapPin size={11} className="text-secondary" /> Work Type
                                        </span>
                                        <span className="text-sm font-bold text-base-content">
                                            {opportunity.work_type}
                                        </span>
                                    </div>
                                )}
                                {opportunity.industry && (
                                    <div className="flex flex-col gap-1 bg-base-200 rounded-xl px-4 py-3">
                                        <span className="flex items-center gap-1.5 text-xs text-base-content/40 font-medium">
                                            <FiBriefcase size={11} className="text-secondary" /> Industry
                                        </span>
                                        <span className="text-sm font-bold text-base-content">
                                            {opportunity.industry}
                                        </span>
                                    </div>
                                )}
                                {deadlineDate && (
                                    <div className={`flex flex-col gap-1 rounded-xl px-4 py-3 ${isExpired ? "bg-error/10 border border-error/20" : "bg-base-200"}`}>
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${isExpired ? "text-error/70" : "text-base-content/40"}`}>
                                            <FiCalendar size={11} className={isExpired ? "text-error" : "text-secondary"} />
                                            Deadline
                                        </span>
                                        <span className={`text-sm font-bold ${isExpired ? "text-error" : "text-base-content"}`}>
                                            {isExpired ? "Expired" : deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Skills */}
                            {opportunity.required_skills?.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-3">
                                        Required Skills
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {opportunity.required_skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/20 text-xs font-medium text-secondary"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {opportunity.description && (
                                <div className="mb-6">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-3">
                                        About This Role
                                    </p>
                                    <p className="text-sm text-base-content/70 leading-relaxed whitespace-pre-line">
                                        {opportunity.description}
                                    </p>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="pt-6 border-t border-base-300">
                                {isExpired ? (
                                    <div className="flex items-center gap-2 text-sm text-error/70 bg-error/10 border border-error/20 rounded-xl px-4 py-3">
                                        <FiAlertCircle size={14} /> This opportunity has passed its deadline.
                                    </div>
                                ) : !user ? (
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p className="text-sm text-base-content/50">
                                            Sign in to apply for this role.
                                        </p>
                                        <Link href="/signin" className="btn btn-secondary rounded-xl btn-sm">
                                            Sign In
                                        </Link>
                                    </div>
                                ) : user.role === "founder" ? (
                                    <div className="flex items-center gap-2 text-sm text-base-content/40 bg-base-200 rounded-xl px-4 py-3">
                                        <FiAlertCircle size={14} /> Founders cannot apply to opportunities.
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="btn btn-secondary rounded-xl gap-2"
                                    >
                                        <FiSend size={14} /> Apply Now
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Posted date footer ── */}
                        {opportunity.createdAt && (
                            <p className="text-xs text-base-content/30 text-center">
                                Posted on {new Date(opportunity.createdAt).toLocaleDateString("en-US", {
                                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                                })}
                            </p>
                        )}

                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && opportunity && user && (
                <ApplyModal
                    opportunity={opportunity}
                    user={user}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}