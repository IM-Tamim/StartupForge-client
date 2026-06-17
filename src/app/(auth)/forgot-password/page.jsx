"use client";
import Link from "next/link";
import { FiArrowLeft, FiMail } from "react-icons/fi";

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-base-200 via-base-300 to-base-200">
            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight text-base-content">
                        Doc<span className="text-error">Appoint</span>
                    </h1>
                    <p className="text-sm mt-1 text-base-content/60">Forgot Password</p>
                </div>

                <div className="rounded-2xl p-8 border border-base-300 bg-base-100 shadow-2xl flex flex-col items-center gap-6 text-center">

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-info/10 border border-info/30 flex items-center justify-center">
                        <FiMail className="text-info" size={28} />
                    </div>

                    {/* Message */}
                    <div>
                        <h2 className="text-lg font-bold text-base-content mb-2">Password Reset</h2>
                        <p className="text-sm text-base-content/60 leading-relaxed">
                            To reset your password, please contact our support team or use the email address you registered with.
                        </p>
                    </div>

                    {/* Dev Mode Banner */}
                    <div className="rounded-lg bg-info/10 border border-info/30 p-3 w-full">
                        <p className="text-xs text-info text-center">
                            🔧 Development Mode: This is a demo reset flow. In production,
                            a password reset link would be sent to your registered email address.
                        </p>
                    </div>

                    {/* Back to Login */}
                    <Link
                        href="/signin"
                        className="btn btn-error btn-outline w-full flex items-center justify-center gap-2 rounded-xl text-sm font-bold"
                    >
                        <FiArrowLeft size={15} /> Back to Login
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;