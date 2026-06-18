"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiZap, FiUpload, FiSave, FiTrash2, FiClock, FiCheckCircle } from "react-icons/fi";
import { getMyStartup } from "@/lib/api/startups";
import { createStartup, updateStartup, deleteStartup } from "@/lib/actions/startups";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const fundingStages = ["Pre-Seed", "Seed", "Series A", "Series B", "Bootstrapped", "Other"];
const industries   = ["Tech", "Health", "Fintech", "EdTech", "SaaS", "E-commerce", "AI/ML", "Other"];

const EMPTY_FORM = { startup_name: "", industry: "", description: "", funding_stage: "Pre-Seed", logo: "" };

export default function MyStartupPage() {
    const { data: session } = authClient.useSession();
    const [startup, setStartup]       = useState(null);
    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [deleting, setDeleting]     = useState(false);
    const [logoFile, setLogoFile]     = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [form, setForm]             = useState(EMPTY_FORM);

    useEffect(() => {
        if (!session?.user) return;
        getMyStartup(session.user.email)
            .then((data) => {
                if (data?._id) {
                    setStartup(data);
                    setForm({
                        startup_name:  data.startup_name  || "",
                        industry:      data.industry      || "",
                        description:   data.description   || "",
                        funding_stage: data.funding_stage || "Pre-Seed",
                        logo:          data.logo          || "",
                    });
                    if (data.logo) setLogoPreview(data.logo);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    const uploadToImgbb = async (file) => {
        const fd = new FormData();
        fd.append("image", file);
        const res  = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
        const data = await res.json();
        if (!data.success) throw new Error("Image upload failed");
        return data.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let logoUrl = form.logo;
            if (logoFile) logoUrl = await uploadToImgbb(logoFile);

            const payload = { ...form, logo: logoUrl, founder_email: session.user.email };

            if (startup?._id) {
                const data = await updateStartup(startup._id, payload);
                if (data.modifiedCount > 0) {
                    toast.success("Startup updated!");
                    setStartup((prev) => ({ ...prev, ...payload }));
                } else {
                    toast("No changes made.");
                }
            } else {
                const data = await createStartup(payload);
                if (data.insertedId) {
                    toast.success("Startup created! Waiting for admin approval.");
                    setStartup({ _id: data.insertedId, ...payload, status: "pending" });
                } else {
                    toast.error("Failed to create startup.");
                }
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete your startup? This cannot be undone.")) return;
        setDeleting(true);
        try {
            const data = await deleteStartup(startup._id);
            if (data.deletedCount > 0) {
                toast.success("Startup deleted.");
                setStartup(null);
                setForm(EMPTY_FORM);
                setLogoPreview(null);
                setLogoFile(null);
            }
        } catch (err) {
            toast.error(err.message || "Failed to delete.");
        } finally {
            setDeleting(false); }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-base-content">My Startup</h1>
                    <p className="text-sm text-base-content/50 mt-1">
                        {startup ? "Update your startup profile" : "Create your startup profile"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Status badge */}
                    {startup?.status && (
                        <span className={`badge badge-md gap-1 ${
                            startup.status === "approved"
                                ? "badge-success"
                                : "badge-warning"
                        }`}>
                            {startup.status === "approved" ? (
                                <><FiCheckCircle size={12} /> Approved</>
                            ) : (
                                <><FiClock size={12} /> Pending Approval</>
                            )}
                        </span>
                    )}
                    {startup && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="btn btn-error btn-sm btn-outline rounded-xl gap-2"
                        >
                            {deleting ? <span className="loading loading-spinner loading-xs" /> : <FiTrash2 size={14} />}
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Pending notice */}
            {startup?.status === "pending" && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-warning/10 border border-warning/30 text-warning text-sm flex items-center gap-2">
                    <FiClock size={14} />
                    Your startup is awaiting admin approval. It will not appear on the public browse page until approved.
                </div>
            )}

            <form onSubmit={handleSubmit} className="rounded-2xl border border-base-300 bg-base-100 p-6 lg:p-8 flex flex-col gap-6">

                {/* Logo upload */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Startup Logo
                    </label>
                    <label className="flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-dashed border-base-300 bg-base-200 hover:border-secondary/50 cursor-pointer transition-colors group">
                        {logoPreview ? (
                            <img src={logoPreview} alt="logo" className="w-12 h-12 rounded-xl object-cover ring-2 ring-secondary/30" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-base-300 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                                <FiZap size={20} className="text-secondary" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-base-content/70">
                                {logoFile ? logoFile.name : "Click to upload logo"}
                            </p>
                            <p className="text-xs text-base-content/40">PNG, JPG up to 5MB</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files[0];
                                if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
                            }}
                        />
                    </label>
                </div>

                {/* Name + Industry */}
                <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                            Startup Name
                        </label>
                        <input
                            value={form.startup_name}
                            onChange={(e) => setForm({ ...form, startup_name: e.target.value })}
                            placeholder="My Awesome Startup"
                            className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                            Industry
                        </label>
                        <select
                            value={form.industry}
                            onChange={(e) => setForm({ ...form, industry: e.target.value })}
                            className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                            required
                        >
                            <option value="">Select Industry</option>
                            {industries.map((i) => <option key={i}>{i}</option>)}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Description
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        placeholder="Describe your startup idea, mission, and vision…"
                        className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors resize-none"
                        required
                    />
                </div>

                {/* Funding stage */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Funding Stage
                    </label>
                    <select
                        value={form.funding_stage}
                        onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}
                        className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                    >
                        {fundingStages.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-secondary rounded-xl gap-2 font-bold self-start"
                >
                    {saving
                        ? <span className="loading loading-spinner loading-xs" />
                        : <FiSave size={15} />
                    }
                    {startup ? "Save Changes" : "Create Startup"}
                </button>
            </form>
        </div>
    );
}
