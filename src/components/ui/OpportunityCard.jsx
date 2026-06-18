"use client";
import Link from "next/link";
import { FiArrowRight, FiClock, FiZap } from "react-icons/fi";

const workTypeBadge = {
    "Remote":  "badge-secondary badge-outline",
    "On-site": "badge-ghost",
    "Hybrid":  "badge-primary badge-outline",
};

const OpportunityCard = ({ opportunity }) => (
    <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 flex flex-col gap-4 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
                <h3 className="font-bold text-base-content truncate group-hover:text-secondary transition-colors">
                    {opportunity.role_title}
                </h3>
                <p className="text-xs text-base-content/50 mt-0.5 truncate">
                    {opportunity.startup_name}
                </p>
            </div>
            <span className={`badge badge-sm shrink-0 ${workTypeBadge[opportunity.work_type] || "badge-ghost"}`}>
                {opportunity.work_type}
            </span>
        </div>

        {/* Skills */}
        {opportunity.required_skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
                {opportunity.required_skills.slice(0, 4).map((skill) => (
                    <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-lg bg-base-200 border border-base-300 text-xs text-base-content/60"
                    >
                        {skill}
                    </span>
                ))}
                {opportunity.required_skills.length > 4 && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-base-200 border border-base-300 text-xs text-base-content/40">
                        +{opportunity.required_skills.length - 4} more
                    </span>
                )}
            </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-base-content/40 mt-auto">
            <span className="flex items-center gap-1.5">
                <FiZap size={11} className="text-secondary" />
                {opportunity.commitment_level}
            </span>
            {opportunity.deadline && (
                <span className="flex items-center gap-1.5">
                    <FiClock size={11} className="text-secondary" />
                    {new Date(opportunity.deadline).toLocaleDateString()}
                </span>
            )}
        </div>

        {/* CTA */}
        <Link
            href={`/opportunities/${opportunity._id}`}
            className="btn btn-sm btn-ghost btn-outline rounded-xl w-full group-hover:btn-secondary transition-all"
        >
            View & Apply <FiArrowRight size={13} />
        </Link>
    </div>
);

export default OpportunityCard;