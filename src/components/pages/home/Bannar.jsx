"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiZap, FiUsers, FiBriefcase, FiTrendingUp } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getStartups } from "@/lib/api/startups";
import { getOpportunities } from "@/lib/api/opportunities";
import { getApplications } from "@/lib/api/applications";

const floatingDots = [
  { cx: "8%",  cy: "18%", r: 3, delay: 0   },
  { cx: "84%", cy: "12%", r: 5, delay: 0.4 },
  { cx: "72%", cy: "78%", r: 4, delay: 0.8 },
  { cx: "18%", cy: "82%", r: 3, delay: 1.2 },
  { cx: "48%", cy: "8%",  r: 2, delay: 0.6 },
  { cx: "92%", cy: "52%", r: 3, delay: 1.0 },
  { cx: "4%",  cy: "58%", r: 4, delay: 0.2 },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ─── Single card component ─────────────────────────────────── */
const Card = ({ title, startup, skills, accent, icon: Icon = FiBriefcase, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.93 }}
    animate={{ opacity: 1, y: 0,  scale: 1    }}
    transition={{ delay, duration: 0.55, ease: "easeOut" }}
    className={`rounded-2xl border border-${accent}/30 bg-${accent}/10 p-4 shadow-lg`}
  >
    {/* header */}
    <div className="flex items-center gap-2.5 mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${accent}/20 shrink-0`}>
        <Icon size={16} className={`text-${accent}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-base-content truncate">{title}</p>
        <p className="text-[11px] text-base-content/50 truncate">{startup}</p>
      </div>
    </div>
    {/* skill chips */}
    <div className="flex flex-wrap gap-1.5">
      {skills.map((s) => (
        <span
          key={s}
          className={`px-2.5 py-0.5 rounded-lg bg-${accent}/15 text-${accent} text-[11px] font-medium`}
        >
          {s}
        </span>
      ))}
    </div>
  </motion.div>
);

/* ─── Right-side illustration ───────────────────────────────── */
const AnimatedCards = () => (
  <div className="flex flex-col items-center gap-0 w-full max-w-[460px]">

    {/* ── Row 1: two cards side by side ── */}
    <div className="grid grid-cols-2 gap-3 w-full">
      <Card
        title="Full-Stack Dev"
        startup="NovaMind AI"
        skills={["React", "Node.js", "MongoDB"]}
        accent="secondary"
        delay={0.3}
      />
      <Card
        title="UI/UX Designer"
        startup="GreenLoop"
        skills={["Figma", "Tailwind", "Framer"]}
        accent="warning"
        delay={0.5}
      />
    </div>

    {/* ── Row 2: FDM cluster + match badge ── */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9, duration: 0.5, ease: "backOut" }}
      className="flex flex-col items-center gap-2 py-3"
    >
      {/* avatar trio */}
      <div className="flex -space-x-2">
        {[
          { letter: "F", color: "secondary" },
          { letter: "D", color: "primary"   },
          { letter: "M", color: "accent"    },
        ].map(({ letter, color }, i) => (
          <div
            key={i}
            className={`w-11 h-11 rounded-full bg-${color}/20 border-2 border-${color} flex items-center justify-center text-sm font-bold text-base-content shadow-md`}
            style={{ zIndex: 3 - i }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* match badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.4, ease: "backOut" }}
        className="px-4 py-1.5 rounded-full bg-secondary text-secondary text-xs font-bold flex items-center gap-1.5 shadow-md whitespace-nowrap"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        Match Found!
      </motion.div>
    </motion.div>

    {/* ── Row 3: one wide card ── */}
    <div className="w-full">
      <Card
        title="Growth Marketer"
        startup="TradeNest"
        skills={["SEO", "Analytics", "Ads", "Email"]}
        accent="info"
        delay={0.7}
      />
    </div>

  </div>
);

/* ─── Banner ─────────────────────────────────────────────────── */
const Banner = () => {
  const [liveStats, setLiveStats] = useState({ startups: 0, collaborators: 0, teams: 0 });

  useEffect(() => {
    Promise.all([
      getStartups().catch(() => []),
      getOpportunities().catch(() => []),
      getApplications().catch(() => []),
    ]).then(([startups, opps, apps]) => {
      const startupsArr = Array.isArray(startups) ? startups : [];
      const oppsArr     = Array.isArray(opps)     ? opps     : opps.opportunities || [];
      const appsArr     = Array.isArray(apps)     ? apps     : apps.applications  || [];
      setLiveStats({
        startups:      startupsArr.length,
        collaborators: oppsArr.length * 2 + 10,
        teams:         appsArr.filter((a) => a.status === "accepted").length,
      });
    }).catch(() => {});
  }, []);

  const stats = [
    { value: liveStats.startups      > 0 ? `${liveStats.startups}+`      : "...", label: "Startups Listed", icon: FiBriefcase  },
    { value: liveStats.collaborators > 0 ? `${liveStats.collaborators}+` : "...", label: "Collaborators",   icon: FiUsers       },
    { value: liveStats.teams         > 0 ? `${liveStats.teams}+`         : "...", label: "Teams Formed",    icon: FiTrendingUp  },
  ];

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-base-100">

      {/* ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-info/5 blur-[100px]" />
      </div>

      {/* floating spark dots */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden="true">
        {floatingDots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.cx} cy={d.cy} r={d.r}
            className="fill-secondary/30"
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: text content ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* eyebrow */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/40 bg-secondary/10 text-secondary text-xs font-semibold tracking-widest uppercase">
                <FiZap size={11} />
                Where Ideas Find Their Teams
              </span>
            </motion.div>

            {/* headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-base-content leading-[1.05]"
            >
              Forge Your{" "}
              <span className="relative inline-block">
                <span className="text-secondary">Startup</span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] w-full bg-secondary/60 rounded-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                />
              </span>
              <br />
              Dream Team
            </motion.h1>

            {/* description */}
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base sm:text-lg text-base-content/60 leading-relaxed"
            >
              StartupForge connects ambitious founders with skilled developers,
              designers, and marketers — giving every idea the team it deserves.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-2">
              <Link
                href="/startups"
                className="btn btn-secondary rounded-xl px-7 gap-2 font-bold shadow-lg shadow-secondary/20"
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

            {/* stats row */}
            <motion.div
              variants={fadeUp}
              className="mt-6 grid grid-cols-3 gap-8 border-t border-base-300 pt-8 max-w-md"
            >
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-secondary">{value}</span>
                  <span className="text-xs text-base-content/50 leading-tight flex items-center gap-1">
                    <Icon size={10} /> {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: illustration ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center"
          >
            <AnimatedCards />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
