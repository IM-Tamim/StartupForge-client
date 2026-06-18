"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
    FiTrash2, FiEdit2, FiClock, FiX, FiSave, FiUsers,
    FiPlus, FiCheckCircle, FiXCircle,
} from "react-icons/fi";
import Link from "next/link";
import { getOpportunities } from "@/lib/api/opportunities";
import { getApplications } from "@/lib/api/applications";
import { updateOpportunity, deleteOpportunity } from "@/lib/actions/opportunities";
import { updateApplicationStatus } from "@/lib/actions/applications";

const workTypes        = ["Remote", "On-site", "Hybrid"];
const commitmentLevels = ["Full-time", "Part-time", "Contract", "Volunteer"];

export default function ManageOpportunitiesPage() {
    const { data: session }               = authClient.useSession();
    const [opps, setOpps]                 = useState([]);
    const [apps, setApps]                 = useState([]);   // all founder applications
    const [loading, setLoading]           = useState(true);
    const [editing, setEditing]           = useState(null); // id of row being edited
    const [editForm, setEditForm]         = useState({});
    const [editSkills, setEditSkills]     = useState([]);
    const [editSkillInput, setEditSkillInput] = useState("");
    const [saving, setSaving]             = useState(false);
    const [deletingId, setDeletingId]     = useState(null);

    // ── Load opportunities + applications together ──
    useEffect(() => {
        if (!session?.user) return;
        const email = session.user.email;

        Promise.all([
            getOpportunities({ founder_email: email }),
            getApplications({ founder_email: email }),
        ])
            .then(([oppsData, appsData]) => {
                const oppsArr = Array.isArray(oppsData) ? oppsData : oppsData.opportunities || [];
                const appsArr = Array.isArray(appsData) ? appsData : appsData.applications || [];
                setOpps(oppsArr);
                setApps(appsArr);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    // helper: count applications per opportunity
    const appCount = (oppId) => apps.filter((a) => a.opportunity_id === oppId).length;
    const pendingCount = (oppId) => apps.filter((a) => a.opportunity_id === oppId && a.status === "pending").length;

    const startEdit = (opp) => {
        setEditing(opp._id);
        setEditForm({
            role_title:       opp.role_title,
            work_type:        opp.work_type,
            commitment_level: opp.commitment_level,
            deadline:         opp.deadline ? opp.deadline.split("T")[0] : "",
        });
        setEditSkills(opp.required_skills || []);
        setEditSkillInput("");
    };

    const addEditSkill = () => {
        const s = editSkillInput.trim();
        if (s && !editSkills.includes(s)) setEditSkills([...editSkills, s]);
        setEditSkillInput("");
    };

    const handleEditSkillKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addEditSkill(); }
    };

    const handleSave = async (id) => {
        setSaving(true);
        try {
            const payload = { ...editForm, required_skills: editSkills };
            const data = await updateOpportunity(id, payload);
            if (data.modifiedCount > 0) {
                toast.success("Opportunity updated!");
                setOpps((prev) => prev.map((o) => o._id === id ? { ...o, ...payload } : o));
                setEditing(null);
            } else {
                toast("No changes made.");
                setEditing(null);
            }
        } catch (err) {
            toast.error(err.message || "Update failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this opportunity? All associated applications will remain in the database.")) return;
        setDeletingId(id);
        try {
            const data = await deleteOpportunity(id);
            if (data.deletedCount > 0) {
                toast.success("Deleted.");
                setOpps((prev) => prev.filter((o) => o._id !== id));
            }
        } catch (err) {
            toast.error(err.message || "Delete failed.");
        } finally {
            setDeletingId(null);
        }
    };

    // Accept / Reject an application inline (mini action)
    const handleAppStatus = async (appId, status) => {
        try {
            const data = await updateApplicationStatus(appId, status);
            if (data.modifiedCount > 0) {
                toast.success(`Application ${status}.`);
                setApps((prev) => prev.map((a) => a._id === appId ? { ...a, status } : a));
            }
        } catch (err) {
            toast.error(err.message || "Action failed.");
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
                <h1 className="text-2xl font-black text-base-content">Manage Opportunities</h1>
                <p className="text-sm text-base-content/50 mt-1">
                    {opps.length} opportunit{opps.length !== 1 ? "ies" : "y"} posted
                </p>
            </div>

            {opps.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-base-300 bg-base-100 text-base-content/40">
                    <p className="mb-4">No opportunities yet.</p>
                    <Link href="/dashboard/founder/add-opportunity" className="btn btn-secondary btn-sm rounded-xl">
                        Post Your First Opportunity
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {opps.map((opp) => (
                        <div key={opp._id} className="rounded-2xl border border-base-300 bg-base-100 p-5">
                            {editing === opp._id ? (
                                /* ── Edit mode ── */
                                <div className="flex flex-col gap-4">
                                    {/* Role title */}
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1.5 block">
                                            Role Title
                                        </label>
                                        <input
                                            value={editForm.role_title}
                                            onChange={(e) => setEditForm({ ...editForm, role_title: e.target.value })}
                                            className="w-full py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary"
                                        />
                                    </div>

                                    {/* Work type + Commitment + Deadline */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1.5 block">Work Type</label>
                                            <select
                                                value={editForm.work_type}
                                                onChange={(e) => setEditForm({ ...editForm, work_type: e.target.value })}
                                                className="w-full py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none"
                                            >
                                                {workTypes.map((w) => <option key={w}>{w}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1.5 block">Commitment</label>
                                            <select
                                                value={editForm.commitment_level}
                                                onChange={(e) => setEditForm({ ...editForm, commitment_level: e.target.value })}
                                                className="w-full py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none"
                                            >
                                                {commitmentLevels.map((c) => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1.5 block">Deadline</label>
                                            <input
                                                type="date"
                                                value={editForm.deadline}
                                                onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                                                className="w-full py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Skills tag editor */}
                                    <div>
                                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50 mb-1.5 block">
                                            Required Skills <span className="normal-case text-base-content/30 font-normal">(press Enter)</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                value={editSkillInput}
                                                onChange={(e) => setEditSkillInput(e.target.value)}
                                                onKeyDown={handleEditSkillKeyDown}
                                                placeholder="React, Node.js…"
                                                className="flex-1 py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary"
                                            />
                                            <button
                                                type="button"
                                                onClick={addEditSkill}
                                                className="btn btn-secondary btn-sm rounded-xl px-4"
                                            >
                                                <FiPlus size={14} />
                                            </button>
                                        </div>
                                        {editSkills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {editSkills.map((s) => (
                                                    <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold">
                                                        {s}
                                                        <button type="button" onClick={() => setEditSkills(editSkills.filter((x) => x !== s))}>
                                                            <FiX size={11} className="hover:text-error" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSave(opp._id)}
                                            disabled={saving}
                                            className="btn btn-secondary btn-sm rounded-xl gap-1.5"
                                        >
                                            {saving ? <span className="loading loading-spinner loading-xs" /> : <FiSave size={13} />}
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditing(null)}
                                            className="btn btn-ghost btn-sm rounded-xl gap-1.5"
                                        >
                                            <FiX size={13} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* ── View mode ── */
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Title + application badge */}
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="font-bold text-base-content">{opp.role_title}</h3>
                                            <div className="flex gap-1.5">
                                                <span className="badge badge-secondary badge-sm">{opp.work_type}</span>
                                                <span className="badge badge-outline badge-sm border-base-content/20 text-base-content/60">
                                                    {opp.commitment_level}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Deadline */}
                                        {opp.deadline && (
                                            <p className="text-xs text-base-content/40 flex items-center gap-1 mb-2">
                                                <FiClock size={11} />
                                                Deadline: {new Date(opp.deadline).toLocaleDateString()}
                                            </p>
                                        )}

                                        {/* Skills */}
                                        {opp.required_skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {opp.required_skills.map((s) => (
                                                    <span key={s} className="px-2 py-0.5 rounded-lg bg-base-200 text-xs text-base-content/50">{s}</span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Application mini-stats */}
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1 text-xs text-base-content/40">
                                                <FiUsers size={12} />
                                                {appCount(opp._id)} applicant{appCount(opp._id) !== 1 ? "s" : ""}
                                            </span>
                                            {pendingCount(opp._id) > 0 && (
                                                <span className="flex items-center gap-1 text-xs text-warning">
                                                    <FiClock size={12} />
                                                    {pendingCount(opp._id)} pending
                                                </span>
                                            )}
                                            <Link
                                                href={`/dashboard/founder/applications?opp=${opp._id}`}
                                                className="text-xs text-secondary hover:opacity-70 transition-opacity"
                                            >
                                                View all →
                                            </Link>
                                        </div>

                                        {/* Inline pending applications list (optional, collapsible) */}
                                        {apps.filter((a) => a.opportunity_id === opp._id && a.status === "pending").length > 0 && (
                                            <div className="mt-3 flex flex-col gap-2">
                                                {apps
                                                    .filter((a) => a.opportunity_id === opp._id && a.status === "pending")
                                                    .slice(0, 2)
                                                    .map((app) => (
                                                        <div key={app._id} className="flex items-center justify-between gap-3 rounded-xl bg-base-200 px-3 py-2">
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-medium text-base-content truncate">{app.applicant_email}</p>
                                                                <p className="text-[10px] text-base-content/40">{app.motivation?.slice(0, 60)}…</p>
                                                            </div>
                                                            <div className="flex gap-1 shrink-0">
                                                                <button
                                                                    onClick={() => handleAppStatus(app._id, "accepted")}
                                                                    className="btn btn-ghost btn-xs btn-square rounded-lg text-success hover:bg-success/10"
                                                                    title="Accept"
                                                                >
                                                                    <FiCheckCircle size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAppStatus(app._id, "rejected")}
                                                                    className="btn btn-ghost btn-xs btn-square rounded-lg text-error hover:bg-error/10"
                                                                    title="Reject"
                                                                >
                                                                    <FiXCircle size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                {pendingCount(opp._id) > 2 && (
                                                    <p className="text-[10px] text-base-content/30 pl-1">
                                                        +{pendingCount(opp._id) - 2} more pending
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => startEdit(opp)}
                                            className="btn btn-ghost btn-sm btn-square rounded-xl"
                                            title="Edit"
                                        >
                                            <FiEdit2 size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(opp._id)}
                                            disabled={deletingId === opp._id}
                                            className="btn btn-ghost btn-sm btn-square rounded-xl text-error hover:bg-error/10"
                                            title="Delete"
                                        >
                                            {deletingId === opp._id
                                                ? <span className="loading loading-spinner loading-xs" />
                                                : <FiTrash2 size={15} />
                                            }
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
