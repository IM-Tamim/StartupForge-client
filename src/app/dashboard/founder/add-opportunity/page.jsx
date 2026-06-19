"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiZap, FiX, FiClock, FiLock, FiArrowRight, FiCheck } from "react-icons/fi";
import Link from "next/link";
import { getMyStartup } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import { createOpportunity } from "@/lib/actions/opportunities";

const workTypes        = ["Remote", "On-site", "Hybrid"];
const commitmentLevels = ["Full-time", "Part-time", "Contract", "Volunteer"];
const FREE_LIMIT        = 3;

const EMPTY_FORM = { role_title: "", work_type: "Remote", commitment_level: "Full-time", deadline: "" };

export default function AddOpportunityPage() {
    const { data: session } = authClient.useSession();
    const [startup, setStartup]       = useState(null);
    const [oppCount, setOppCount]     = useState(0);
    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills]         = useState([]);
    const [form, setForm]             = useState(EMPTY_FORM);

    const isPremium = session?.user?.plan === "founder_premium";
    const isLocked  = !isPremium && oppCount >= FREE_LIMIT;

    useEffect(() => {
        if (!session?.user) return;
        Promise.all([
            getMyStartup(session.user.email),
            getOpportunities({ founder_email: session.user.email }),
        ])
            .then(([startupData, oppData]) => {
                if (startupData?._id) setStartup(startupData);
                const arr = Array.isArray(oppData) ? oppData : oppData?.opportunities || [];
                setOppCount(arr.length);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !skills.includes(s)) setSkills([...skills, s]);
        setSkillInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startup) { toast.error("Create your startup first before posting opportunities."); return; }
        if (startup.status !== "approved") { toast.error("Your startup must be approved by an admin before posting opportunities."); return; }
        if (isLocked) { toast.error("You've reached your free opportunity limit. Upgrade to Premium."); return; }
        if (skills.length === 0) { toast.error("Add at least one required skill."); return; }

        setSaving(true);
        try {
            const data = await createOpportunity({
                ...form,
                required_skills: skills,
                startup_id:      startup._id,
                startup_name:    startup.startup_name,
                founder_email:   session.user.email,
            });
            if (data.insertedId) {
                toast.success("Opportunity posted!");
                setForm(EMPTY_FORM);
                setSkills([]);
                setOppCount((c) => c + 1);
            } else {
                toast.error("Failed to post opportunity.");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );

    // ── No startup at all ──
    if (!startup?._id) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-base-content">Add Opportunity</h1>
                    <p className="text-sm text-base-content/50 mt-1">Post a role and find the right collaborator.</p>
                </div>

                <div className="rounded-2xl border border-base-300 bg-base-100 p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center">
                        <FiZap size={24} className="text-warning" />
                    </div>
                    <div>
                        <p className="font-bold text-base-content mb-1">You need a startup profile first</p>
                        <p className="text-sm text-base-content/50 max-w-sm">
                            Create your startup profile before you can post opportunities for collaborators.
                        </p>
                    </div>
                    <Link href="/dashboard/founder/my-startup" className="btn btn-secondary rounded-xl gap-2">
                        Create Startup Profile <FiArrowRight size={15} />
                    </Link>
                </div>
            </div>
        );
    }

    // ── Startup exists but pending admin approval ──
    if (startup.status !== "approved") {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-base-content">Add Opportunity</h1>
                    <p className="text-sm text-base-content/50 mt-1">Post a role and find the right collaborator.</p>
                </div>

                <div className="rounded-2xl border border-warning/30 bg-warning/10 p-8 flex flex-col items-center text-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-warning/20 flex items-center justify-center">
                        <FiClock size={24} className="text-warning" />
                    </div>
                    <div>
                        <p className="font-bold text-base-content mb-1">Waiting for admin approval</p>
                        <p className="text-sm text-base-content/50 max-w-sm">
                            Your startup <span className="font-semibold text-secondary">{startup.startup_name}</span> is pending approval.
                            You will be able to post opportunities once an admin approves it.
                        </p>
                    </div>
                    <Link href="/dashboard/founder/my-startup" className="btn btn-ghost btn-outline rounded-xl gap-2">
                        View My Startup <FiArrowRight size={15} />
                    </Link>
                </div>
            </div>
        );
    }

    // ── Free limit reached, not premium — show upgrade gate ──
    if (isLocked) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-base-content">Add Opportunity</h1>
                    <p className="text-sm text-base-content/50 mt-1">Post a role and find the right collaborator.</p>
                </div>

                <div className="relative rounded-2xl border-2 border-secondary/40 bg-base-100 p-8 flex flex-col items-center text-center gap-5 overflow-hidden">
                    {/* glow */}
                    <div className="absolute inset-0 bg-secondary/[0.04] pointer-events-none" />

                    <div className="relative w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                        <FiLock size={26} className="text-secondary" />
                    </div>

                    <div className="relative">
                        <p className="font-black text-xl text-base-content mb-2">
                            You&apos;ve used all {FREE_LIMIT} free opportunities
                        </p>
                        <p className="text-sm text-base-content/55 max-w-sm leading-relaxed">
                            Upgrade to <span className="text-secondary font-bold">Premium</span> to post
                            unlimited opportunities and keep building your team without limits.
                        </p>
                    </div>

                    <div className="relative flex flex-col gap-2.5 w-full max-w-xs">
                        {[
                            "Unlimited opportunity postings",
                            "Priority listing in browse page",
                            "Premium founder badge",
                        ].map((f) => (
                            <div key={f} className="flex items-center gap-2.5 text-sm text-base-content/70">
                                <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <FiCheck size={11} className="text-secondary" />
                                </span>
                                {f}
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/plans"
                        className="relative btn btn-secondary rounded-xl gap-2 font-bold mt-2"
                    >
                        <FiZap size={15} /> Upgrade to Premium — $19
                    </Link>
                </div>
            </div>
        );
    }

    // ── Approved startup, within free limit or premium — show the form ──
    return (
        <div>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
                <div>
                    <h1 className="text-2xl font-black text-base-content">Add Opportunity</h1>
                    <p className="text-sm text-base-content/50 mt-1">Post a role and find the right collaborator.</p>
                </div>

                {/* Quota / premium indicator */}
                {isPremium ? (
                    <span className="badge badge-secondary gap-1.5 py-3 px-3">
                        <FiZap size={11} /> Premium — Unlimited
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-base-content/50">
                            {oppCount}/{FREE_LIMIT} free postings used
                        </span>
                        <div className="w-20 h-1.5 rounded-full bg-base-300 overflow-hidden">
                            <div
                                className="h-full bg-secondary rounded-full transition-all"
                                style={{ width: `${Math.min((oppCount / FREE_LIMIT) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-base-300 bg-base-100 p-6 lg:p-8 flex flex-col gap-6">

                {/* Role title */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Role Title
                    </label>
                    <input
                        value={form.role_title}
                        onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                        placeholder="e.g. Senior React Developer"
                        className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                        required
                    />
                </div>

                {/* Skills tag input */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Required Skills
                        <span className="normal-case text-base-content/30 font-normal ml-1">(press Enter to add)</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="React, Node.js, Figma…"
                            className="flex-1 py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                        />
                        <button
                            type="button"
                            onClick={addSkill}
                            className="btn btn-secondary btn-sm rounded-xl px-4"
                        >
                            Add
                        </button>
                    </div>
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {skills.map((s) => (
                                <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold">
                                    {s}
                                    <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>
                                        <FiX size={11} className="hover:text-error" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Work type + Commitment */}
                <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">Work Type</label>
                        <select
                            value={form.work_type}
                            onChange={(e) => setForm({ ...form, work_type: e.target.value })}
                            className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                        >
                            {workTypes.map((w) => <option key={w}>{w}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">Commitment Level</label>
                        <select
                            value={form.commitment_level}
                            onChange={(e) => setForm({ ...form, commitment_level: e.target.value })}
                            className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                        >
                            {commitmentLevels.map((c) => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Application Deadline
                    </label>
                    <input
                        type="date"
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                        className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                    />
                </div>

                <button type="submit" disabled={saving} className="btn btn-secondary rounded-xl gap-2 font-bold self-start">
                    {saving ? <span className="loading loading-spinner loading-xs" /> : <FiZap size={15} />}
                    Post Opportunity
                </button>
            </form>
        </div>
    );
}