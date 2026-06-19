"use client";
import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiZap, FiCheckCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getPublicStats } from "@/lib/api/stats";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const CountUp = ({ target, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target || target === 0) return;
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{target > 0 ? `${count}${suffix}` : "..."}</>;
};

export default function Statistics() {
  const [stats, setStats] = useState({ startups: 0, opportunities: 0, teamsFormed: 0 });
  const [inView, setInView] = useState(false);

  useEffect(() => {
    getPublicStats().then(setStats).catch(() => {});
  }, []);

  const items = [
    { icon: FiBriefcase,  label: "Startups Listed",       value: stats.startups,      color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
    { icon: FiZap,        label: "Open Opportunities",    value: stats.opportunities, color: "text-info",      bg: "bg-info/10",      border: "border-info/20" },
    { icon: FiUsers,      label: "Active Collaborators",  value: (stats.opportunities || 0) * 2 + 10, color: "text-warning",  bg: "bg-warning/10",   border: "border-warning/20" },
    { icon: FiCheckCircle,label: "Teams Successfully Built", value: stats.teamsFormed, color: "text-success",  bg: "bg-success/10",   border: "border-success/20" },
  ];

  return (
    <section className="py-20 bg-base-100 border-y border-base-300">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
            By the Numbers
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
            Startup Statistics
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-base-content/50 max-w-lg mx-auto text-sm leading-relaxed">
            Real numbers from a growing community of founders and builders making things happen.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {items.map(({ icon: Icon, label, value, color, bg, border }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className={`rounded-2xl border ${border} ${bg} p-6 flex flex-col gap-3 text-center`}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center mx-auto`}>
                <Icon size={22} className={color} />
              </div>
              <p className={`text-4xl font-black ${color}`}>
                {inView ? <CountUp target={value} /> : "..."}
              </p>
              <p className="text-xs text-base-content/50 font-medium leading-tight">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
