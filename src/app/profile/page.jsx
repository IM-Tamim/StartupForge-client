"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiSave, FiUpload } from "react-icons/fi";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const API_BASE  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const [saving, setSaving]          = useState(false);
    const [imageFile, setImageFile]    = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [form, setForm] = useState({ name: "" });

    useEffect(() => {
        if (!session?.user) return;
        setForm({ name: session.user.name || "" });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let imageUrl = session?.user?.image || "";
            if (imageFile) imageUrl = await uploadToImgbb(imageFile);

            const res = await fetch(`${API_BASE}/api/users/profile`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, image: imageUrl, email: session.user.email }),
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
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-base-content">My Profile</h1>
                    <p className="text-sm text-base-content/50 mt-1">Update your name and profile photo.</p>
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-base-300 bg-base-100 p-6 lg:p-8 flex flex-col gap-6">

                    {/* Avatar */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                            Profile Photo
                        </label>
                        <label className="flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-dashed border-base-300 bg-base-200 hover:border-secondary/50 cursor-pointer transition-colors group">
                            {imagePreview ? (
                                <img src={imagePreview} alt="preview" className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/30" />
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
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const f = e.target.files[0];
                                if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                            }} />
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

                    {/* Email — read only */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                            Email
                        </label>
                        <input
                            value={session?.user?.email || ""}
                            disabled
                            className="py-3 px-4 rounded-xl text-sm bg-base-200 border border-base-300 text-base-content/40 outline-none cursor-not-allowed"
                        />
                    </div>

                    <button type="submit" disabled={saving} className="btn btn-secondary rounded-xl gap-2 font-bold self-start">
                        {saving ? <span className="loading loading-spinner loading-xs" /> : <FiSave size={15} />}
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}