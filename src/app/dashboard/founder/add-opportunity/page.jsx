"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiZap, FiX } from "react-icons/fi";
import { getMyStartup } from "@/lib/api/startups";
import { createOpportunity } from "@/lib/actions/opportunities";

const workTypes        = ["Remote", "On-site", "Hybrid"];
const commitmentLevels = ["Full-time", "Part-time", "Contract", "Volunteer"];

const EMPTY_FORM = { role_title: "", work_type: "Remote", commitment_level: "Full-time", deadline: "" };

export default function AddOpportunityPage() {
    const { data: session } = authClient.useSession();
    const [startup, setStartup]       = useState(null);
    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills]         = useState([]);
    const [form, setForm]             = useState(EMPTY_FORM);

    useEffect(() => {
        if (!session?.user) return;
        getMyStartup(session.user.email)
            .then((data) => { if (data?._id) setStartup(data); })
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

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">Add Opportunity</h1>
                <p className="text-sm text-base-content/50 mt-1">Post a role and find the right collaborator.</p>
            </div>

            {!startup && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-warning/10 border border-warning/30 text-warning text-sm">
                    You need to create your startup profile first before posting opportunities.
                </div>
            )}

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