"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiZap } from "react-icons/fi";

const floatingDots = [
    { cx: "10%", cy: "20%", r: 3, delay: 0 },
    { cx: "85%", cy: "15%", r: 5, delay: 0.4 },
    { cx: "70%", cy: "75%", r: 4, delay: 0.8 },
    { cx: "20%", cy: "80%", r: 3, delay: 1.2 },
    { cx: "50%", cy: "10%", r: 2, delay: 0.6 },
    { cx: "90%", cy: "50%", r: 3, delay: 1.0 },
    { cx: "5%",  cy: "55%", r: 4, delay: 0.2 },
];

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stats = [
    { value: "3,200+", label: "Startups Listed" },
    { value: "18,000+", label: "Collaborators" },
    { value: "940+",   label: "Teams Formed" },
];

const Banner = () => (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-base-100">

        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]" />
        </div>

        {/* Floating spark dots */}
        <svg className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden="true">
            {floatingDots.map((d, i) => (
                <motion.circle
                    key={i}
                    cx={d.cx} cy={d.cy} r={d.r}
                    className="fill-primary/30"
                    animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
                />
            ))}
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center text-center gap-6"
            >
                {/* Eyebrow */}
                <motion.div variants={fadeUp}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/40 bg-secondary/10 text-secondary text-xs font-semibold tracking-widest uppercase">
                        <FiZap size={11} />
                        Where Ideas Find Their Teams
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={fadeUp}
                    className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-base-content leading-[1.05]"
                >
                    Forge Your{" "}
                    <span className="relative inline-block">
                        <span className="text-primary">Startup</span>
                        <motion.span
                            className="absolute -bottom-1 left-0 h-[3px] w-full bg-secondary rounded-full"
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                        />
                    </span>
                    <br />
                    Dream Team
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={fadeUp}
                    className="max-w-xl text-base sm:text-lg text-base-content/60 leading-relaxed"
                >
                    StartupForge connects ambitious founders with skilled developers,
                    designers, and marketers — giving every idea the team it deserves.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center mt-2">
                    <Link
                        href="/startups"
                        className="btn btn-primary rounded-xl px-7 gap-2 font-bold shadow-lg shadow-primary/20"
                    >
                        Browse Startups <FiArrowRight size={16} />
                    </Link>
                    <Link
                        href="/opportunities"
                        className="btn btn-outline btn-secondary rounded-xl px-7 font-bold"
                    >
                        Find Opportunities
                    </Link>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    variants={fadeUp}
                    className="mt-10 grid grid-cols-3 gap-8 sm:gap-16 border-t border-base-300 pt-10 w-full max-w-lg"
                >
                    {stats.map(({ value, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                            <span className="text-2xl sm:text-3xl font-black text-secondary">
                                {value}
                            </span>
                            <span className="text-xs text-base-content/50 text-center leading-tight">
                                {label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    </section>
);

export default Banner;