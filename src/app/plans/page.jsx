"use client";
import { useState } from "react";
import { FiCheck, FiLock, FiZap, FiShield, FiX } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const AdminModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-base-100 border border-base-300 rounded-2xl p-8 shadow-2xl text-center">
            <button onClick={onClose} className="absolute top-4 right-4 btn btn-ghost btn-xs btn-circle">
                <FiX size={14} />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-5">
                <FiShield size={28} className="text-secondary" />
            </div>
            <h2 className="text-xl font-black text-base-content mb-2">You&apos;re the Admin</h2>
            <p className="text-sm text-base-content/60 leading-relaxed mb-6">
                As the platform administrator, you already have full unrestricted
                access to every feature. Subscriptions exist for founders —
                not for the person running the show.
            </p>
            <div className="flex flex-col gap-2.5">
                <Link href="/dashboard/admin" className="btn btn-secondary rounded-xl w-full btn-sm font-bold">
                    Go to Admin Dashboard
                </Link>
                <button onClick={onClose} className="btn btn-ghost rounded-xl w-full btn-sm text-base-content/40">
                    Got it, thanks
                </button>
            </div>
        </div>
    </div>
);

const freePlan = {
    name:        "Free",
    price:       0,
    period:      "forever",
    description: "Everything you need to get started building.",
    features: [
        "1 startup profile",
        "Up to 3 opportunity postings",
        "Browse all startups & collaborators",
        "Apply to opportunities",
        "Basic dashboard access",
    ],
    locked: [
        "Unlimited opportunities",
        "Priority listing",
        "Premium badge",
    ],
};

const premiumPlan = {
    id:          "founder_premium",
    name:        "Premium",
    price:       19,
    period:      "one-time",
    description: "For founders serious about building their dream team.",
    badge:       "Most Popular",
    features: [
        "Everything in Free",
        "Unlimited opportunity postings",
        "Priority listing in browse page",
        "Premium founder badge on profile",
        "Early access to new features",
    ],
};

const faqs = [
    { q: "Is this a one-time payment?",          a: "Yes — $19 once, yours forever. No monthly renewals or surprise charges." },
    { q: "What if I only need 3 opportunities?", a: "The free plan covers exactly that. Only upgrade when you need more." },
    { q: "How is payment processed?",            a: "All payments go through Stripe. We never store your card details on our servers." },
    { q: "Can collaborators subscribe?",         a: "No — this plan is exclusively for founders who want to post unlimited roles." },
];

export default function PlansPage() {
    const { data: session }                   = authClient.useSession();
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [openFaq, setOpenFaq]               = useState(null);

    const user      = session?.user;
    const isPremium = user?.plan === "founder_premium";
    const isFounder = user?.role === "founder";
    const isAdmin   = user?.role === "admin";

    return (
        <>
            {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} />}

            <div className="min-h-screen bg-base-200">
                <div className="max-w-5xl mx-auto px-6 py-20">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20 mb-5">
                            <FiZap size={11} /> Pricing
                        </span>
                        <h1 className="text-5xl sm:text-6xl font-black text-base-content tracking-tight leading-[1.05] mb-4">
                            One plan.<br />
                            <span className="text-secondary">Unlimited</span> potential.
                        </h1>
                        <p className="text-sm text-base-content/50 max-w-xs mx-auto leading-relaxed">
                            Start free. Pay once when you&apos;re ready to scale your team without limits.
                        </p>
                    </div>

                    {/* Cards — items-stretch so both cards fill equal height */}
                    <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-20 items-stretch">

                        {/* Free card */}
                        <div className="rounded-2xl border border-base-300 bg-base-100 p-8 flex flex-col gap-6">
                            {/* Name row — same height as premium name+badge row */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 h-7">
                                    <h2 className="text-xl font-black text-base-content">{freePlan.name}</h2>
                                    {user && !isPremium && !isAdmin && (
                                        <span className="badge badge-outline badge-secondary badge-sm">Current</span>
                                    )}
                                </div>
                                <p className="text-xs text-base-content/50 leading-relaxed">{freePlan.description}</p>
                            </div>

                            <div className="flex items-end gap-1.5">
                                <span className="text-5xl font-black text-base-content">$0</span>
                                <span className="text-sm text-base-content/40 pb-1.5">/ {freePlan.period}</span>
                            </div>

                            <div className="h-px bg-base-300" />

                            <ul className="flex flex-col gap-3 flex-1">
                                {freePlan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-base-content/70">
                                        <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                            <FiCheck size={11} className="text-secondary" />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                                {freePlan.locked.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-base-content/25">
                                        <span className="w-5 h-5 rounded-full bg-base-300 flex items-center justify-center shrink-0">
                                            <FiLock size={10} />
                                        </span>
                                        <span className="line-through">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button disabled className="btn btn-outline rounded-xl w-full btn-sm opacity-40 cursor-not-allowed">
                                Free Plan
                            </button>
                        </div>

                        {/* Premium card */}
                        <div className="rounded-2xl border-2 border-secondary/50 bg-base-100 p-8 flex flex-col gap-6 shadow-xl shadow-secondary/10">
                            {/* Name + inline badge — no absolute positioning */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 h-7">
                                    <h2 className="text-xl font-black text-base-content">{premiumPlan.name}</h2>
                                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-content text-xs font-black tracking-wide">
                                        {premiumPlan.badge}
                                    </span>
                                    {isPremium && (
                                        <span className="badge badge-secondary badge-sm">Current</span>
                                    )}
                                </div>
                                <p className="text-xs text-base-content/50 leading-relaxed">{premiumPlan.description}</p>
                            </div>

                            <div className="flex items-end gap-1.5">
                                <span className="text-5xl font-black text-base-content">${premiumPlan.price}</span>
                                <span className="text-sm text-base-content/40 pb-1.5">/ {premiumPlan.period}</span>
                            </div>

                            <div className="h-px bg-base-300" />

                            <ul className="flex flex-col gap-3 flex-1">
                                {premiumPlan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-base-content/70">
                                        <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                            <FiCheck size={11} className="text-secondary" />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <div>
                                {isPremium ? (
                                    <button disabled className="btn btn-secondary rounded-xl w-full btn-sm gap-2 opacity-60 cursor-not-allowed">
                                        <FiCheck size={14} /> Already Premium
                                    </button>
                                ) : !user ? (
                                    <Link href="/signin" className="btn btn-secondary rounded-xl w-full btn-sm gap-2 font-bold">
                                        <FiZap size={14} /> Sign In to Upgrade
                                    </Link>
                                ) : isAdmin ? (
                                    <button onClick={() => setShowAdminModal(true)} className="btn btn-secondary rounded-xl w-full btn-sm gap-2 font-bold">
                                        <FiShield size={14} /> You&apos;re an Admin
                                    </button>
                                ) : !isFounder ? (
                                    <>
                                        <button disabled className="btn btn-secondary rounded-xl w-full btn-sm opacity-40 cursor-not-allowed">
                                            Only for Founders
                                        </button>
                                        <p className="text-xs text-base-content/30 text-center mt-2.5">
                                            This plan is only available for founders
                                        </p>
                                    </>
                                ) : (
                                    <form action="/api/checkout_sessions" method="POST">
                                        <input type="hidden" name="plan_id" value={premiumPlan.id} />
                                        <button type="submit" className="btn btn-secondary rounded-xl w-full btn-sm gap-2 font-bold">
                                            <FiZap size={14} /> Upgrade to Premium
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-2xl font-black text-base-content text-center mb-8">Common Questions</h2>
                        <div className="flex flex-col gap-3">
                            {faqs.map((faq, i) => {
                                const isOpen = openFaq === i;
                                return (
                                    <div key={i} className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(isOpen ? null : i)}
                                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                                        >
                                            <span className="text-sm font-semibold text-base-content">{faq.q}</span>
                                            <span className={`shrink-0 transition-transform duration-200 text-secondary ${isOpen ? "rotate-45" : ""}`}>
                                                <FiX size={15} />
                                            </span>
                                        </button>
                                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-40" : "max-h-0"}`}>
                                            <p className="px-5 pb-5 pt-3 text-sm text-base-content/60 leading-relaxed border-t border-base-300">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-center text-xs text-base-content/30 mt-10">
                            Payments securely processed by Stripe. We never store your card details.
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}