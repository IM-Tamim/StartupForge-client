"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
    FiUser, FiMail, FiUpload, FiSave, FiX,
    FiPlus, FiShield, FiEdit3
} from "react-icons/fi";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

// ── Avatar ────────────────────────────────────────────────
const Avatar = ({ src, name, size = 96 }) => {
    const [error, setError] = useState(false);
    if (error || !src) {
        return (
            <div
                style={{ width: size, height: size }}
                className="rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-black text-2xl shrink-0"
            >
                {name?.slice(0, 2).toUpperCase() || "??"}
            </div>
        );
    }
    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-full overflow-hidden flex-shrink-0"
        >
            <Image
                src={src}
                alt={name || "avatar"}
                width={size}
                height={size}
                className="object-cover w-full h-full"
                onError={() => setError(true)}
            />
        </div>
    );
};

// ── Skill tag input ───────────────────────────────────────
const SkillsInput = ({ skills, setSkills }) => {
    const [input, setInput] = useState("");

    const addSkill = () => {
        const trimmed = input.trim();
        if (!trimmed || skills.includes(trimmed)) return;
        setSkills([...skills, trimmed]);
        setInput("");
    };

    const removeSkill = (skill) =>
        setSkills(skills.filter((s) => s !== skill));

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                    }}
                    placeholder="e.g. React, Node.js, Figma…"
                    className="flex-1 pl-4 pr-4 py-2.5 rounded-xl text-sm outline-none bg-base-200 text-base-content border border-base-300 focus:border-secondary transition-all"
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className="btn btn-secondary btn-sm rounded-xl px-4 gap-1"
                >
                    <FiPlus size={14} /> Add
                </button>
            </div>
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="hover:text-error transition-colors"
                            >
                                <FiX size={11} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Main page ─────────────────────────────────────────────
const ProfilePage = () => {
    const { data: session, isPending, refetch } = authClient.useSession();
    const user = session?.user;

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    // Prefill from session
    useEffect(() => {
        const prefillForm = () => {
            if (!user) return;
            setName(user.name || "");
            setBio(user.bio || "");
            setSkills(user.skills || []);
        };

        prefillForm();
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadToImgbb = async (file) => {
        const form = new FormData();
        form.append("image", file);
        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            { method: "POST", body: form }
        );
        const data = await res.json();
        if (!data.success) throw new Error("Image upload failed");
        return data.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) { toast.error("Name is required."); return; }

        setLoading(true);
        try {
            let imageUrl = user?.image || "";
            if (imageFile) {
                setUploading(true);
                imageUrl = await uploadToImgbb(imageFile);
                setUploading(false);
            }

            await authClient.updateUser({
                name: name.trim(),
                image: imageUrl,
                bio: bio.trim(),
                ...(user?.role === "collaborator" && { skills }),
            });

            await refetch();
            toast.success("Profile updated!");
            setImageFile(null);
        } catch (err) {
            toast.error(err.message || "Update failed.");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    // ── Loading state ──
    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-secondary" />
            </div>
        );
    }

    const isCollaborator = user?.role === "collaborator";
    const currentImage = imagePreview || user?.image || "";

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">

                {/* ── Page header ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">
                        Account
                    </p>
                    <h1 className="text-3xl font-black text-base-content tracking-tight">
                        Your Profile
                    </h1>
                    <p className="text-sm text-base-content/50 mt-1">
                        Manage your personal info and how others see you.
                    </p>
                </div>

                {/* ── Read-only identity card ── */}
                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 flex items-center gap-4">
                    <Avatar src={currentImage} name={user?.name} size={56} />
                    <div className="min-w-0">
                        <p className="font-bold text-base-content truncate">{user?.name}</p>
                        <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
                        <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold capitalize">
                            {user?.role || "member"}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="ml-auto btn btn-sm btn-outline btn-secondary btn-outline rounded-xl gap-1.5 shrink-0"
                    >
                        <FiEdit3 size={13} /> Change Photo
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                {/* ── Edit form ── */}
                <form onSubmit={handleSubmit} className="rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col gap-5">

                    {/* Image upload area — shown when a new file is picked */}
                    {imagePreview && (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-base-200 border border-secondary/30">
                            <Avatar src={imagePreview} name={name} size={56} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-base-content truncate">
                                    {imageFile?.name}
                                </p>
                                <p className="text-xs text-base-content/40 mt-0.5">
                                    New photo selected — save to apply
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                className="btn btn-ghost btn-xs btn-circle text-error"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    )}

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                            Full Name
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={15} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all bg-base-200 text-base-content border border-base-300 focus:border-secondary"
                                required
                                minLength={3}
                            />
                        </div>
                    </div>

                    {/* Email — read only */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                            Email <span className="normal-case text-base-content/30 font-normal">(cannot be changed)</span>
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={15} />
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-base-200 text-base-content/40 border border-base-300 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>

                    {/* Role — read only */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                            Role <span className="normal-case text-base-content/30 font-normal">(cannot be changed)</span>
                        </label>
                        <div className="relative">
                            <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" size={15} />
                            <input
                                type="text"
                                value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                                readOnly
                                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm bg-base-200 text-base-content/40 border border-base-300 cursor-not-allowed outline-none capitalize"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the community a little about yourself…"
                            rows={4}
                            maxLength={300}
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-base-200 text-base-content border border-base-300 focus:border-secondary resize-none"
                        />
                        <p className="text-xs text-base-content/30 text-right">{bio.length} / 300</p>
                    </div>

                    {/* Skills — collaborator only */}
                    {isCollaborator && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                Skills
                            </label>
                            <SkillsInput skills={skills} setSkills={setSkills} />
                        </div>
                    )}

                    {/* Upload indicator */}
                    {uploading && (
                        <div className="flex items-center gap-2 text-sm text-secondary">
                            <span className="loading loading-spinner loading-xs" />
                            Uploading photo…
                        </div>
                    )}

                    {/* Save */}
                    <div className="flex justify-end pt-2 border-t border-base-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-secondary rounded-xl px-8 gap-2 font-bold"
                        >
                            {loading
                                ? <span className="loading loading-spinner loading-xs" />
                                : <><FiSave size={15} /> Save Changes</>
                            }
                        </button>
                    </div>
                </form>

                {/* ── Danger zone ── */}
                <div className="rounded-2xl border border-error/30 bg-base-100 p-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-error">Danger Zone</p>
                        <p className="text-xs text-base-content/40 mt-0.5">
                            Once you delete your account, there is no going back.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-error btn-outline rounded-xl shrink-0"
                        onClick={() => toast.error("Contact support to delete your account.")}
                    >
                        Delete Account
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;