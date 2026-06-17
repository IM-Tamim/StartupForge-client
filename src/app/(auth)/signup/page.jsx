"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiGoogle } from "react-icons/si";
import {
    FiUser, FiMail, FiLock, FiUpload, FiArrowRight,
    FiCheck, FiX, FiEye, FiEyeOff, FiZap, FiUsers
} from "react-icons/fi";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const passwordRules = [
    {
        id: "uppercase",
        label: "At least 1 uppercase letter",
        test: (v) => /[A-Z]/.test(v),
    },
    {
        id: "lowercase",
        label: "At least 1 lowercase letter",
        test: (v) => /[a-z]/.test(v),
    },
    {
        id: "minLength",
        label: "Minimum 8 characters",
        test: (v) => v.length >= 8,
    },
];

const roles = [
    {
        id: "collaborator",
        label: "Collaborator",
        desc: "Find startups & join teams",
        icon: FiUsers,
    },
    {
        id: "founder",
        label: "Founder",
        desc: "Post ideas & build your team",
        icon: FiZap,
    },

];

const RuleItem = ({ passed, label }) => (
    <li
        className={`flex items-center gap-1.5 text-xs transition-colors ${passed ? "text-success" : "text-base-content/40"
            }`}
    >
        {passed ? <FiCheck size={11} /> : <FiX size={11} />}
        {label}
    </li>
);

const SignUpForm = () => {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [formError, setFormError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const allRulesPassed = passwordRules.every((r) => r.test(password));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadToImgbb = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            { method: "POST", body: formData }
        );
        const data = await res.json();
        if (!data.success) throw new Error("Image upload failed");
        return data.data.url;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!selectedRole) {
            setFormError("Please select a role to continue.");
            return;
        }

        if (!allRulesPassed) {
            setPasswordTouched(true);
            setFormError("Please fix the password issues before registering.");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const userData = Object.fromEntries(formData.entries());

        setLoading(true);
        try {
            let imageUrl = "";
            if (imageFile) {
                setUploading(true);
                imageUrl = await uploadToImgbb(imageFile);
                setUploading(false);
            }

            const plan =
                selectedRole === "founder"
                    ? "founder_free"
                    : "collaborator_free";

            const { error } = await authClient.signUp.email({
                email: userData.email,
                password: userData.password,
                name: userData.name,
                image: imageUrl,
                role: selectedRole,
                plan,
            });

            if (error) {
                setFormError(error.message);
                toast.error(error.message);
            } else {
                toast.success("Account created! Please sign in.");
                router.push("/signin");
            }
        } catch (err) {
            setFormError(err.message || "Something went wrong.");
            toast.error(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
        if (error) toast.error(error.message);
    };

    const baseInput =
        "w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all bg-base-200 text-base-content border border-base-300 focus:border-secondary";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight text-base-content">
                        Startup<span className="text-secondary">Forge</span>
                    </h1>
                    <p className="text-sm mt-1.5 text-base-content/50">
                        Build your team. Shape the future.
                    </p>
                </div>

                <div className="rounded-2xl p-8 border border-base-300 bg-base-100 shadow-xl">

                    {/* Error banner */}
                    {formError && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm font-medium flex items-start gap-2">
                            <FiX className="mt-0.5 shrink-0" size={15} />
                            {formError}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="flex flex-col gap-5">

                        {/* ── Role Selector ── */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                I am joining as
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map(({ id, label, desc, icon: Icon }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setSelectedRole(id)}
                                        className={`relative flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all cursor-pointer
                                            ${selectedRole === id
                                                ? "border-secondary bg-secondary/10 text-secondary"
                                                : "border-base-300 bg-base-200 text-base-content/60 hover:border-secondary/40"
                                            }`}
                                    >
                                        <span className={`p-1.5 rounded-lg ${selectedRole === id ? "bg-secondary/20" : "bg-base-300"}`}>
                                            <Icon size={16} className={selectedRole === id ? "text-secondary" : "text-base-content/50"} />
                                        </span>
                                        <span className="text-sm font-bold mt-1 text-base-content">
                                            {label}
                                        </span>
                                        <span className="text-xs text-base-content/50 leading-snug">
                                            {desc}
                                        </span>
                                        {selectedRole === id && (
                                            <span className="absolute top-2 right-2">
                                                <FiCheck size={12} className="text-secondary" />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Name ── */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={15} />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Your full name"
                                    className={baseInput}
                                    required
                                    minLength={3}
                                />
                            </div>
                        </div>

                        {/* ── Email ── */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                Email
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={15} />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@gmail.com"
                                    className={baseInput}
                                    required
                                />
                            </div>
                        </div>

                        {/* ── Profile Photo Upload ── */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                Profile Photo
                            </label>
                            <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-base-300 bg-base-200 hover:border-secondary/50 cursor-pointer transition-all group">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary/30"
                                    />
                                ) : (
                                    <span className="w-9 h-9 rounded-full bg-base-300 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                                        <FiUpload size={15} className="text-base-content/40 group-hover:text-secondary transition-colors" />
                                    </span>
                                )}
                                <div>
                                    <p className="text-sm text-base-content/70 font-medium">
                                        {imageFile ? imageFile.name : "Click to upload photo"}
                                    </p>
                                    <p className="text-xs text-base-content/40">PNG, JPG up to 5MB</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        {/* ── Password ── */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={15} />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => { if (password.length > 0) setPasswordTouched(true); }}
                                    className={`w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none transition-all bg-base-200 text-base-content border
                                        ${passwordTouched && !allRulesPassed
                                            ? "border-error"
                                            : passwordTouched && allRulesPassed
                                                ? "border-success"
                                                : "border-base-300 focus:border-secondary"
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-secondary transition-colors"
                                >
                                    {showPassword ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                                </button>
                            </div>

                            {(passwordTouched || password.length > 0) && (
                                <ul className="mt-1 flex flex-col gap-1 pl-1">
                                    {passwordRules.map((rule) => (
                                        <RuleItem key={rule.id} passed={rule.test(password)} label={rule.label} />
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* ── Actions ── */}
                        <div className="flex gap-3 mt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-secondary flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold"
                            >
                                {uploading
                                    ? "Uploading photo…"
                                    : loading
                                        ? <span className="loading loading-spinner loading-xs" />
                                        : <><span>Create Account</span><FiArrowRight size={15} /></>
                                }
                            </button>
                            <button
                                type="reset"
                                onClick={() => {
                                    setPassword("");
                                    setPasswordTouched(false);
                                    setFormError("");
                                    setSelectedRole("");
                                    setImageFile(null);
                                    setImagePreview(null);
                                }}
                                className="btn btn-ghost btn-outline px-5 rounded-xl text-sm font-medium"
                            >
                                Reset
                            </button>
                        </div>

                        {/* ── Divider ── */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-base-300" />
                            <span className="text-xs text-base-content/40">OR</span>
                            <div className="flex-1 h-px bg-base-300" />
                        </div>

                        {/* ── Google ── */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="btn btn-outline w-full flex items-center justify-center gap-2 rounded-xl text-sm font-medium"
                        >
                            <SiGoogle size={15} />
                            Continue with Google
                        </button>

                        <p className="text-center text-sm text-base-content/50">
                            Already have an account?{" "}
                            <Link href="/signin" className="font-semibold text-secondary hover:opacity-70 transition-opacity">
                                Sign In
                            </Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
};

const SignUpPage = () => (
    <Suspense
        fallback={
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner text-secondary" />
            </div>
        }
    >
        <SignUpForm />
    </Suspense>
);

export default SignUpPage;