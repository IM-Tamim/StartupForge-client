"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiGoogle } from "react-icons/si";
import { Suspense, useState } from "react";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const SignInForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const userData = Object.fromEntries(formData.entries());

        try {
            const { error } = await authClient.signIn.email({
                email: userData.email,
                password: userData.password,
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            // better-auth login succeeded — now issue our own JWT cookie
            // for the Express backend to verify on protected routes.
            await fetch("/api/auth/issue-token", { method: "POST" });

            toast.success("Welcome back!");
            router.push("/");
        } catch (err) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/post-login",
        });
        if (error) toast.error(error.message);
    };

    const baseInput =
        "w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all bg-base-200 text-base-content border border-base-300 focus:border-secondary";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight text-base-content">
                        Startup<span className="text-secondary">Forge</span>
                    </h1>
                    <p className="text-sm mt-1.5 text-base-content/50">
                        Welcome back. Pick up where you left off.
                    </p>
                </div>

                <div className="rounded-2xl p-8 border border-base-300 bg-base-100 shadow-xl">
                    <form onSubmit={onSubmit} className="flex flex-col gap-5">

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                Email
                            </label>
                            <div className="relative">
                                <FiMail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
                                    size={15}
                                />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@gmail.com"
                                    className={baseInput}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-warning hover:opacity-70 font-medium transition-opacity"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <FiLock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
                                    size={15}
                                />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none transition-all bg-base-200 text-base-content border border-base-300 focus:border-secondary"
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
                        </div>

                        <div className="flex gap-3 mt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-secondary flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold"
                            >
                                {loading
                                    ? <span className="loading loading-spinner loading-xs" />
                                    : <><span>Sign In</span><FiArrowRight size={15} /></>
                                }
                            </button>
                            <button
                                type="reset"
                                className="btn btn-ghost btn-outline btn-error px-5 rounded-xl text-sm font-medium"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-base-300" />
                            <span className="text-xs text-base-content/40">OR</span>
                            <div className="flex-1 h-px bg-base-300" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="btn btn-outline btn-info w-full flex items-center justify-center gap-2 rounded-xl text-sm font-medium"
                        >
                            <SiGoogle size={15} />
                            Continue with Google
                        </button>

                        <p className="text-center text-sm text-base-content/50">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-warning hover:opacity-70 transition-opacity"
                            >
                                Create one
                            </Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
};

const SignInPage = () => (
    <Suspense
        fallback={
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner text-secondary" />
            </div>
        }
    >
        <SignInForm />
    </Suspense>
);

export default SignInPage;