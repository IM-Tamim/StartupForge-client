"use client";
import { FiZap, FiShield, FiTrendingUp, FiUsers, FiSearch, FiCheckCircle } from "react-icons/fi";

const reasons = [
    {
        icon: FiSearch,
        title: "Discover the Right Fit",
        desc: "Browse hundreds of vetted startups filtered by industry, role, and commitment level — find one that actually matches your skills.",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: FiUsers,
        title: "Build Real Teams",
        desc: "Founders get tools to post requirements, review applicants, and assemble a team — not just a list of followers.",
        color: "text-secondary",
        bg: "bg-secondary/10",
    },
    {
        icon: FiTrendingUp,
        title: "Grow Together",
        desc: "Track your applications, update your profile with new skills, and watch your startup journey unfold in one place.",
        color: "text-success",
        bg: "bg-success/10",
    },
    {
        icon: FiShield,
        title: "Verified Founders",
        desc: "Every startup goes through an approval process before going live — so collaborators only see serious opportunities.",
        color: "text-warning",
        bg: "bg-warning/10",
    },
    {
        icon: FiZap,
        title: "Fast Matching",
        desc: "Smart filters by work type, skills, and deadlines mean you spend less time scrolling and more time building.",
        color: "text-error",
        bg: "bg-error/10",
    },
    {
        icon: FiCheckCircle,
        title: "Track Every Step",
        desc: "Real-time application status updates so you always know where you stand — no more wondering if anyone saw your message.",
        color: "text-info",
        bg: "bg-info/10",
    },
];

const WhyJoin = () => (
    <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">

            <div className="text-center mb-14">
                <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
                    The StartupForge Edge
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
                    Why Join StartupForge?
                </h2>
                <p className="mt-4 text-base-content/50 max-w-lg mx-auto text-sm leading-relaxed">
                    Whether you are a founder with a vision or a builder looking for your next challenge,
                    StartupForge is the place where momentum starts.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reasons.map(({ icon: Icon, title, desc, color, bg }) => (
                    <div
                        key={title}
                        className="rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col gap-4 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                    >
                        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
                            <Icon size={20} className={color} />
                        </span>
                        <div>
                            <h3 className="font-bold text-base-content mb-1.5">{title}</h3>
                            <p className="text-sm text-base-content/55 leading-relaxed">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default WhyJoin;