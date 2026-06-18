"use client";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiTag } from "react-icons/fi";

const badgeColor = {
    "Pre-Seed": "badge-ghost",
    "Seed":     "badge-secondary badge-outline",
    "Series A": "badge-primary badge-outline",
    "Series B": "badge-accent badge-outline",
    "Bootstrapped": "badge-success badge-outline",
};

const StartupCard = ({ startup }) => (
    <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 flex flex-col gap-4 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300">

        {/* Header */}
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-secondary/10 border border-base-300 flex items-center justify-center">
                {startup.logo ? (
                    <Image
                        src={startup.logo}
                        alt={startup.startup_name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span className="font-black text-secondary text-lg">
                        {startup.startup_name?.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="min-w-0">
                <h3 className="font-bold text-base-content truncate">{startup.startup_name}</h3>
                <p className="text-xs text-base-content/50 truncate">by {startup.founder_email}</p>
            </div>
            <span className={`badge badge-sm ml-auto shrink-0 ${badgeColor[startup.funding_stage] || "badge-ghost"}`}>
                {startup.funding_stage}
            </span>
        </div>

        {/* Description */}
        <p className="text-sm text-base-content/60 leading-relaxed line-clamp-2 flex-1">
            {startup.description}
        </p>

        {/* Industry */}
        <div className="flex items-center gap-1.5 text-xs text-base-content/50">
            <FiTag size={11} className="text-secondary" />
            {startup.industry}
        </div>

        {/* CTA */}
        <Link
            href={`/startups/${startup._id}`}
            className="btn btn-sm btn-ghost btn-outline rounded-xl w-full mt-auto btn-secondary transition-all"
        >
            View Startup <FiArrowRight size={13} />
        </Link>
    </div>
);

export default StartupCard;