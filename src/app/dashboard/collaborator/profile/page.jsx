"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiSave, FiUpload, FiX } from "react-icons/fi";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const API_BASE  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CollaboratorProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const [saving, setSaving]          = useState(false);
    const [imageFile, setImageFile]    = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [skillInput, setSkillInput]  = useState("");
    const [form, setForm] = useState({ name: "", bio: "", skills: [] });

    useEffect(() => {
        if (!session?.user) return;
        setForm({
            name:   session.user.name   || "",
            bio:    session.user.bio    || "",
            skills: session.user.skills || [],
        });
        if (session.user.image) setImagePreview(session.user.image);
    }, [session]);

    const uploadToImgbb = async (file) => {
        const fd = new FormData();
        fd.append("image", file);
        const res  = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
        const data = await res.json();
        if (!data.success) throw new Error("Image upload failed");
        return data.data.url;
    };

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !form.skills.includes(s)) setForm({ ...form, skills: [...form.skills, s] });
        setSkillInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); }
    };

    const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter((x) => x !== s) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let imageUrl = session?.user?.image || "";
            if (imageFile) imageUrl = await uploadToImgbb(imageFile);

            const res = await fetch(`${API_BASE}/api/users/profile`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, image: imageUrl, email: session.user.email }),
            });
            const data = await res.json();

            if (data.modifiedCount > 0 || data.acknowledged) {
                toast.success("Profile updated!");
            } else {
                toast("No changes made.");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    if (isPending) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">My Profile</h1>
                <p className="text-sm text-base-content/50 mt-1">
                    Keep your skills and bio up to date to attract the right founders.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-base-300 bg-base-100 p-6 lg:p-8 flex flex-col gap-6 max-w-2xl">

                {/* Avatar upload */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Profile Photo
                    </label>
                    <label className="flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-dashed border-base-300 bg-base-200 hover:border-secondary/50 cursor-pointer transition-colors group">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/30"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                                <FiUpload size={18} className="text-base-content/40 group-hover:text-secondary transition-colors" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-base-content/70">
                                {imageFile ? imageFile.name : "Click to change photo"}
                            </p>
                            <p className="text-xs text-base-content/40">PNG, JPG up to 5MB</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files[0];
                                if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                            }}
                        />
                    </label>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Full Name
                    </label>
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                        required
                    />
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Bio
                    </label>
                    <textarea
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell founders about your background, experience, and what you're looking for…"
                        className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors resize-none"
                    />
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Skills
                        <span className="normal-case text-base-content/30 font-normal ml-1">(press Enter to add)</span>
                    </label>
                    <div className="flex gap-2">
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="React, Design, Marketing…"
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
                    {form.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {form.skills.map((s) => (
                                <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold">
                                    {s}
                                    <button type="button" onClick={() => removeSkill(s)}>
                                        <FiX size={11} className="hover:text-error" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
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
                    Save Changes
                </button>
            </form>
        </div>
    );
}
