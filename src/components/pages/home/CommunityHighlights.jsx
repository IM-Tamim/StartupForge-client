"use client";
import Image from "next/image";
import { useState } from "react";
import { FiStar } from "react-icons/fi";

const AvatarWithFallback = ({ src, name }) => {
    const [error, setError] = useState(false);
    if (error || !src) {
        return (
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
                {name.slice(0, 2).toUpperCase()}
            </div>
        );
    }
    return (
        <Image
            src={src}
            alt={name}
            width={40}
            height={40}
            className="rounded-full bg-base-200 object-cover flex-shrink-0"
            onError={() => setError(true)}
        />
    );
};

const highlights = [
    {
        id: 1,
        name: "Priya Nair",
        role: "Full-Stack Dev → CTO at NovaMind AI",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya&backgroundColor=b6e3f4",
        quote: "I found my co-founder here within two weeks. StartupForge is the real deal for serious builders.",
        stars: 5,
    },
    {
        id: 2,
        name: "James Okafor",
        role: "Designer → Lead at GreenLoop",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=James&backgroundColor=c0aede",
        quote: "I was tired of cold LinkedIn messages. Here the founders actually read your application and get back to you.",
        stars: 5,
    },
    {
        id: 3,
        name: "Mei Lin",
        role: "Founder of MediSync",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=MeiLin&backgroundColor=ffdfbf",
        quote: "Assembled a team of 5 in under a month. The quality of applicants here is genuinely impressive.",
        stars: 5,
    },
    {
        id: 4,
        name: "Carlos Reyes",
        role: "Growth Marketer → Head of Growth, TradeNest",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Carlos&backgroundColor=d1f4cc",
        quote: "Finally a platform that treats collaborators as real team members, not just gig workers.",
        stars: 5,
    },
];

const HighlightCard = ({ h }) => (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col gap-4 hover:border-secondary/30 transition-all duration-300">
        <div className="flex gap-0.5">
            {Array.from({ length: h.stars }).map((_, i) => (
                <FiStar key={i} size={13} className="fill-secondary text-secondary" />
            ))}
        </div>
        <p className="text-sm text-base-content/70 leading-relaxed flex-1">
            `{h.quote}`
        </p>
        <div className="flex items-center gap-3 pt-3 border-t border-base-200">
            <AvatarWithFallback src={h.avatar} name={h.name} />
            <div>
                <p className="text-sm font-bold text-base-content">{h.name}</p>
                <p className="text-xs text-base-content/45 leading-tight">{h.role}</p>
            </div>
        </div>
    </div>
);

const CommunityHighlights = () => (
    <section className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-6">

            <div className="text-center mb-14">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                    Real Stories
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
                    Community Highlights
                </h2>
                <p className="mt-4 text-base-content/50 max-w-lg mx-auto text-sm leading-relaxed">
                    Thousands of builders have found their teams on StartupForge.
                    Here is what some of them have to say.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {highlights.map((h) => (
                    <HighlightCard key={h.id} h={h} />
                ))}
            </div>

            {/* Bottom stat bar */}
            <div className="mt-14 rounded-2xl border border-base-300 bg-base-200 px-8 py-7 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {[
                    { val: "4.9 / 5", label: "Average Rating" },
                    { val: "940+",    label: "Teams Formed" },
                    { val: "18k+",    label: "Community Members" },
                    { val: "72 hrs",  label: "Avg. Match Time" },
                ].map(({ val, label }) => (
                    <div key={label} className="flex flex-col gap-1">
                        <span className="text-2xl font-black text-secondary">{val}</span>
                        <span className="text-xs text-base-content/50">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default CommunityHighlights;