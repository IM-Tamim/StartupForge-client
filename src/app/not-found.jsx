import Link from "next/link";
import { FiHome, FiCompass } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-base-200 flex items-center justify-center px-6">
            <div className="text-center max-w-md">

                {/* 404 text */}
                <p
                    style={{ fontSize: "10rem", lineHeight: 1, opacity: 0.9 }}
                    className="font-black tracking-tight text-secondary mb-4"
                >
                    404
                </p>

                <h1 className="text-2xl font-black text-base-content mb-3">
                    This page drifted off course
                </h1>
                <p className="text-sm text-base-content/50 leading-relaxed mb-8">
                    The page you&apos;re looking for doesn&apos;t exist, may have been moved,
                    or the startup behind it has pivoted.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/" className="btn btn-secondary rounded-xl gap-2 font-bold">
                        <FiHome size={15} /> Back to Home
                    </Link>
                    <Link href="/opportunities" className="btn btn-info btn-outline rounded-xl gap-2">
                        <FiCompass size={15} /> Browse Opportunities
                    </Link>
                </div>
            </div>
        </div>
    );
}