"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2, FiClock, FiX, FiSave } from "react-icons/fi";
import Link from "next/link";
import { getOpportunities } from "@/lib/api/opportunities";
import { updateOpportunity, deleteOpportunity } from "@/lib/actions/opportunities";

const workTypes        = ["Remote", "On-site", "Hybrid"];
const commitmentLevels = ["Full-time", "Part-time", "Contract", "Volunteer"];

export default function ManageOpportunitiesPage() {
    const { data: session }               = authClient.useSession();
    const [opps, setOpps]                 = useState([]);
    const [loading, setLoading]           = useState(true);
    const [editing, setEditing]           = useState(null); // id of row being edited
    const [editForm, setEditForm]         = useState({});
    const [saving, setSaving]             = useState(false);

    useEffect(() => {
        if (!session?.user) return;
        getOpportunities({ founder_email: session.user.email })
            .then((data) => setOpps(Array.isArray(data) ? data : data.opportunities || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    const startEdit = (opp) => {
        setEditing(opp._id);
        setEditForm({
            role_title:       opp.role_title,
            work_type:        opp.work_type,
            commitment_level: opp.commitment_level,
            deadline:         opp.deadline ? opp.deadline.split("T")[0] : "",
        });
    };

    const handleSave = async (id) => {
        setSaving(true);
        try {
            const data = await updateOpportunity(id, editForm);
            if (data.modifiedCount > 0) {
                toast.success("Opportunity updated!");
                setOpps((prev) => prev.map((o) => o._id === id ? { ...o, ...editForm } : o));
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
        if (!confirm("Delete this opportunity?")) return;
        try {
            const data = await deleteOpportunity(id);
            if (data.deletedCount > 0) {
                toast.success("Deleted.");
                setOpps((prev) => prev.filter((o) => o._id !== id));
            }
        } catch (err) {
            toast.error(err.message || "Delete failed.");
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
                                    <input
                                        value={editForm.role_title}
                                        onChange={(e) => setEditForm({ ...editForm, role_title: e.target.value })}
                                        className="py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <select
                                            value={editForm.work_type}
                                            onChange={(e) => setEditForm({ ...editForm, work_type: e.target.value })}
                                            className="py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none"
                                        >
                                            {workTypes.map((w) => <option key={w}>{w}</option>)}
                                        </select>
                                        <select
                                            value={editForm.commitment_level}
                                            onChange={(e) => setEditForm({ ...editForm, commitment_level: e.target.value })}
                                            className="py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none"
                                        >
                                            {commitmentLevels.map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                        <input
                                            type="date"
                                            value={editForm.deadline}
                                            onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                                            className="py-2.5 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none"
                                        />
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
                                        <h3 className="font-bold text-base-content mb-2">{opp.role_title}</h3>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="badge badge-secondary badge-sm">{opp.work_type}</span>
                                            <span className="badge badge-outline badge-sm border-base-content/20 text-base-content/60">
                                                {opp.commitment_level}
                                            </span>
                                        </div>
                                        {opp.deadline && (
                                            <p className="text-xs text-base-content/40 flex items-center gap-1">
                                                <FiClock size={11} />
                                                Deadline: {new Date(opp.deadline).toLocaleDateString()}
                                            </p>
                                        )}
                                        {opp.required_skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {opp.required_skills.map((s) => (
                                                    <span key={s} className="px-2 py-0.5 rounded-lg bg-base-200 text-xs text-base-content/50">{s}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => startEdit(opp)}
                                            className="btn btn-ghost btn-sm btn-square rounded-xl"
                                        >
                                            <FiEdit2 size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(opp._id)}
                                            className="btn btn-ghost btn-sm btn-square rounded-xl text-error hover:bg-error/10"
                                        >
                                            <FiTrash2 size={15} />
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