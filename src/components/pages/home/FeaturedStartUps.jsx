"use client";
import Link from "next/link";
import { FiArrowRight, FiUsers, FiTag } from "react-icons/fi";

const startups = [
    {
        id: 1,
        name: "NovaMind AI",
        founder: "Aryan Hossain",
        industry: "Artificial Intelligence",
        teamSize: 6,
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=NovaMind&backgroundColor=6366f1",
        badge: "Seed",
    },
    {
        id: 2,
        name: "GreenLoop",
        founder: "Sara Müller",
        industry: "CleanTech",
        teamSize: 4,
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=GreenLoop&backgroundColor=22c55e",
        badge: "Pre-Seed",
    },
    {
        id: 3,
        name: "TradeNest",
        founder: "Kiran Patel",
        industry: "FinTech",
        teamSize: 8,
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=TradeNest&backgroundColor=f59e0b",
        badge: "Series A",
    },
    {
        id: 4,
        name: "MediSync",
        founder: "Li Wei",
        industry: "HealthTech",
        teamSize: 5,
        logo: "https://api.dicebear.com/9.x/initials/svg?seed=MediSync&backgroundColor=ec4899",
        badge: "Seed",
    },
];

const badgeColor = {
    "Pre-Seed": "badge-ghost",
    "Seed":     "badge-secondary badge-outline",
    "Series A": "badge-primary badge-outline",
};

const StartupCard = ({ startup }) => (
    <div className="group rounded-2xl border border-base-300 bg-base-100 p-5 flex flex-col gap-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <div className="flex items-center gap-3">
            <img
                src={startup.logo}
                alt={startup.name}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />
            <div className="min-w-0">
                <h3 className="font-bold text-base-content truncate">{startup.name}</h3>
                <p className="text-xs text-base-content/50 truncate">by {startup.founder}</p>
            </div>
            <span className={`badge badge-sm ml-auto shrink-0 ${badgeColor[startup.badge] || "badge-ghost"}`}>
                {startup.badge}
            </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-base-content/50">
            <span className="flex items-center gap-1.5">
                <FiTag size={11} className="text-secondary" />
                {startup.industry}
            </span>
            <span className="flex items-center gap-1.5">
                <FiUsers size={11} className="text-secondary" />
                {startup.teamSize} members needed
            </span>
        </div>

        <Link
            href={`/startups/${startup.id}`}
            className="btn btn-sm btn-ghost btn-outline rounded-xl w-full mt-auto group-hover:btn-secondary transition-all"
        >
            View Startup <FiArrowRight size={13} />
        </Link>
    </div>
);

const FeaturedStartUps = () => (
    <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">

            <div className="flex items-end justify-between mb-10 gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                        Opportunities Await
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
                        Featured Startups
                    </h2>
                </div>
                <Link
                    href="/startups"
                    className="btn btn-sm btn-outline btn-secondary rounded-xl hidden sm:flex gap-1.5"
                >
                    View All <FiArrowRight size={13} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {startups.map((s) => (
                    <StartupCard key={s.id} startup={s} />
                ))}
            </div>

            <div className="mt-6 flex sm:hidden justify-center">
                <Link href="/startups" className="btn btn-outline btn-secondary rounded-xl btn-sm gap-1.5">
                    View All Startups <FiArrowRight size={13} />
                </Link>
            </div>
        </div>
    </section>
);

export default FeaturedStartUps;