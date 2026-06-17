"use client";
import Link from "next/link";
import { FiArrowRight, FiClock, FiCode, FiBriefcase } from "react-icons/fi";

const opportunities = [
    {
        id: 1,
        role: "Full-Stack Developer",
        startup: "NovaMind AI",
        skills: ["Next.js", "Node.js", "MongoDB"],
        deadline: "Jul 30, 2025",
        workType: "Remote",
    },
    {
        id: 2,
        role: "UI/UX Designer",
        startup: "GreenLoop",
        skills: ["Figma", "Tailwind", "Framer"],
        deadline: "Aug 5, 2025",
        workType: "Hybrid",
    },
    {
        id: 3,
        role: "Growth Marketer",
        startup: "TradeNest",
        skills: ["SEO", "Content", "Analytics"],
        deadline: "Jul 25, 2025",
        workType: "Remote",
    },
    {
        id: 4,
        role: "Backend Engineer",
        startup: "MediSync",
        skills: ["Python", "FastAPI", "PostgreSQL"],
        deadline: "Aug 12, 2025",
        workType: "On-site",
    },
];

const workTypeBadge = {
    Remote:  "badge-success badge-outline",
    Hybrid:  "badge-warning badge-outline",
    "On-site": "badge-error badge-outline",
};

const OpportunityCard = ({ opp }) => (
    <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 flex flex-col gap-4 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300">
        <div className="flex items-start justify-between gap-2">
            <div>
                <h3 className="font-bold text-base-content">{opp.role}</h3>
                <p className="text-xs text-base-content/50 mt-0.5 flex items-center gap-1">
                    <FiBriefcase size={11} />
                    {opp.startup}
                </p>
            </div>
            <span className={`badge badge-sm shrink-0 ${workTypeBadge[opp.workType] || "badge-ghost"}`}>
                {opp.workType}
            </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
            {opp.skills.map((skill) => (
                <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-base-200 text-xs text-base-content/60 font-medium flex items-center gap-1"
                >
                    <FiCode size={10} className="text-primary" />
                    {skill}
                </span>
            ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-base-200">
            <span className="text-xs text-base-content/40 flex items-center gap-1.5">
                <FiClock size={11} />
                Deadline: {opp.deadline}
            </span>
            <Link
                href={`/opportunities/${opp.id}`}
                className="btn btn-xs btn-ghost btn-outline rounded-lg group-hover:btn-primary transition-all gap-1"
            >
                Apply <FiArrowRight size={11} />
            </Link>
        </div>
    </div>
);

const FeaturedOpportunities = () => (
    <section className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-6">

            <div className="flex items-end justify-between mb-10 gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                        Open Roles
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
                        Featured Opportunities
                    </h2>
                </div>
                <Link
                    href="/opportunities"
                    className="btn btn-sm btn-outline btn-primary rounded-xl hidden sm:flex gap-1.5"
                >
                    View All <FiArrowRight size={13} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {opportunities.map((o) => (
                    <OpportunityCard key={o.id} opp={o} />
                ))}
            </div>

            <div className="mt-6 flex sm:hidden justify-center">
                <Link href="/opportunities" className="btn btn-outline btn-primary rounded-xl btn-sm gap-1.5">
                    View All Opportunities <FiArrowRight size={13} />
                </Link>
            </div>
        </div>
    </section>
);

export default FeaturedOpportunities;