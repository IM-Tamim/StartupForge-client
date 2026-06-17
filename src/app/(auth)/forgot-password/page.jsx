"use client";
import Link from "next/link";
import { FiArrowLeft, FiMail } from "react-icons/fi";

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight text-base-content">
                        Startup<span className="text-secondary">Forge</span>
                    </h1>
                    <p className="text-sm mt-1.5 text-base-content/50">
                        We&apos;ll help you get back in.
                    </p>
                </div>

                <div className="rounded-2xl p-8 border border-base-300 bg-base-100 shadow-xl flex flex-col items-center gap-6 text-center">

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                        <FiMail className="text-secondary" size={28} />
                    </div>

                    {/* Message */}
                    <div>
                        <h2 className="text-lg font-bold text-base-content mb-2">Reset your password</h2>
                        <p className="text-sm text-base-content/50 leading-relaxed">
                            To reset your password, contact our support team or use the email address you registered with.
                        </p>
                    </div>

                    {/* Dev Mode Banner */}
                    <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-3 w-full">
                        <p className="text-xs text-secondary/80 text-center leading-relaxed">
                            🔧 Development mode — in production, a reset link would be sent to your registered email address.
                        </p>
                    </div>

                    {/* Back to Sign In */}
                    <Link
                        href="/signin"
                        className="btn btn-secondary btn-outline btn-info w-full flex items-center justify-center gap-2 rounded-xl text-sm font-bold"
                    >
                        <FiArrowLeft size={15} /> Back to Sign In
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;