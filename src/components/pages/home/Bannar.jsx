"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiZap } from "react-icons/fi";
import { useEffect, useState } from "react";

const floatingDots = [
  { cx: "8%", cy: "18%", r: 3, delay: 0 },
  { cx: "84%", cy: "12%", r: 5, delay: 0.4 },
  { cx: "72%", cy: "78%", r: 4, delay: 0.8 },
  { cx: "18%", cy: "82%", r: 3, delay: 1.2 },
  { cx: "48%", cy: "8%", r: 2, delay: 0.6 },
  { cx: "92%", cy: "52%", r: 3, delay: 1.0 },
  { cx: "4%", cy: "58%", r: 4, delay: 0.2 },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardFloat = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" },
});

const stats = [
  { value: "3,200+", label: "Startups Listed" },
  { value: "18,000+", label: "Collaborators" },
  { value: "940+", label: "Teams Formed" },
];

/* ─── Right-side illustration ──────────────────────────────── */
const Illustration = ({ theme }) => (
  <svg
    viewBox="0 0 350 320" // Increased viewbox size
    width="100%"
    className="max-w-[400px] block" // Increased max-width
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="ig" cx="50%" cy="0%" r="100%">
        <stop offset="0%" stopColor="oklch(var(--s))" stopOpacity=".2" />
        <stop offset="100%" stopColor="oklch(var(--s))" stopOpacity="0" />
      </radialGradient>
      {/* Theme-dependent gradients for the cards */}
      <radialGradient id="cg1" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor={theme === 'abyss' ? "#2a7a50" : "#a1ef9b"} stopOpacity={theme === 'abyss' ? ".4" : ".3"} />
        <stop offset="100%" stopColor={theme === 'abyss' ? "#2a7a50" : "#a1ef9b"} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cg2" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor={theme === 'abyss' ? "#7a4a20" : "#ffbb9a"} stopOpacity={theme === 'abyss' ? ".35" : ".25"} />
        <stop offset="100%" stopColor={theme === 'abyss' ? "#7a4a20" : "#ffbb9a"} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cg3" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor={theme === 'abyss' ? "#205070" : "#9ed6f9"} stopOpacity={theme === 'abyss' ? ".35" : ".25"} />
        <stop offset="100%" stopColor={theme === 'abyss' ? "#205070" : "#9ed6f9"} stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* ambient glow behind cards */}
    <ellipse cx="175" cy="160" rx="160" ry="125" fill="url(#ig)" opacity=".8" />

    {/* ── Card 1 · Founder ── */}
    <motion.g {...cardFloat(0.3)}>
      <rect x="20" y="20" width="140" height="110" rx="16" // Larger card
        fill="oklch(var(--b2))" stroke="oklch(var(--s)/0.3)" strokeWidth="1" />
      <rect x="20" y="20" width="140" height="110" rx="16" fill="url(#cg1)" />
      {/* top accent stripe */}
      <rect x="20" y="20" width="140" height="3" rx="1.5"
        fill="oklch(var(--s))" opacity=".7" />
      {/* avatar */}
      <circle cx="48" cy="50" r="18" // Larger avatar
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.4)" strokeWidth="1" />
      <circle cx="48" cy="45" r="8" fill="oklch(var(--s)/0.4)" />
      <path d="M31,66 Q48,58 65,66" fill="oklch(var(--s)/0.2)" />
      {/* name + sub */}
      <rect x="76" y="40" width="68" height="9" rx="4.5" // Larger text placeholders
        fill="oklch(var(--s))" opacity=".9" />
      <rect x="76" y="54" width="50" height="6" rx="3"
        fill="oklch(var(--bc))" opacity=".4" />
      <rect x="76" y="64" width="58" height="6" rx="3"
        fill="oklch(var(--bc))" opacity=".25" />
      {/* role badge */}
      <rect x="30" y="80" width="54" height="18" rx="9" // Larger badge
        fill="oklch(var(--s)/0.15)" stroke="oklch(var(--s)/0.5)" strokeWidth=".8" />
      <text x="57" y="93" textAnchor="middle" fontSize="10" // Larger text
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif" fontWeight="600">
        Founder
      </text>
      {/* skill chips */}
      <rect x="30" y="105" width="34" height="16" rx="8"
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.55)" strokeWidth=".6" />
      <text x="47" y="117" textAnchor="middle" fontSize="9"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif">AI / SaaS</text>
      <rect x="68" y="105" width="44" height="16" rx="8"
        fill="oklch(var(--b3))" stroke="oklch(var(--bc)/0.3)" strokeWidth=".6" />
      <text x="90" y="117" textAnchor="middle" fontSize="9"
        fill="oklch(var(--bc)/0.7)" fontFamily="'Segoe UI',sans-serif">Series A</text>
      {/* + icon */}
      <circle cx="138" cy="28" r="6" // Larger icon
        fill="oklch(var(--s)/0.2)" stroke="oklch(var(--s))" strokeWidth="1.2" />
      <line x1="135" y1="28" x2="141" y2="28"
        stroke="oklch(var(--s))" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="138" y1="25" x2="138" y2="31"
        stroke="oklch(var(--s))" strokeWidth="1.5" strokeLinecap="round" />
    </motion.g>

    {/* ── Card 2 · Developer ── */}
    <motion.g {...cardFloat(0.5)}>
      <rect x="180" y="10" width="144" height="110" rx="16" // Larger card
        fill="oklch(var(--b2))" stroke="oklch(var(--s)/0.3)" strokeWidth="1" />
      <rect x="180" y="10" width="144" height="110" rx="16" fill="url(#cg2)" />
      <rect x="180" y="10" width="144" height="3" rx="1.5"
        fill="oklch(var(--s))" opacity=".7" />
      {/* avatar */}
      <circle cx="208" cy="40" r="18" // Larger avatar
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.4)" strokeWidth="1" />
      <circle cx="208" cy="35" r="8" fill="oklch(var(--s)/0.4)" />
      <path d="M191,56 Q208,48 225,56" fill="oklch(var(--s)/0.2)" />
      {/* name + sub */}
      <rect x="236" y="30" width="72" height="9" rx="4.5"
        fill="oklch(var(--s))" opacity=".9" />
      <rect x="236" y="44" width="54" height="6" rx="3"
        fill="oklch(var(--bc))" opacity=".4" />
      <rect x="236" y="54" width="62" height="6" rx="3"
        fill="oklch(var(--bc))" opacity=".25" />
      {/* role badge */}
      <rect x="190" y="70" width="60" height="18" rx="9"
        fill="oklch(var(--s)/0.15)" stroke="oklch(var(--s)/0.5)" strokeWidth=".8" />
      <text x="220" y="83" textAnchor="middle" fontSize="10"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif" fontWeight="600">
        Developer
      </text>
      {/* skill chips */}
      <rect x="190" y="95" width="40" height="16" rx="8"
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.6)" strokeWidth=".6" />
      <text x="210" y="107" textAnchor="middle" fontSize="9"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif">React</text>
      <rect x="234" y="95" width="38" height="16" rx="8"
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.5)" strokeWidth=".6" />
      <text x="253" y="107" textAnchor="middle" fontSize="9"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif">Node.js</text>
      <rect x="276" y="95" width="44" height="16" rx="8"
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.4)" strokeWidth=".6" />
      <text x="298" y="107" textAnchor="middle" fontSize="9"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif">MongoDB</text>
      {/* star icon */}
      <circle cx="316" cy="18" r="6" // Larger icon
        fill="oklch(var(--s)/0.2)" stroke="oklch(var(--s))" strokeWidth="1.2" />
      <path d="M316,14.5 L317.2,17 L319.8,17 L317.8,18.8 L318.5,21.5 L316,20 L313.5,21.5 L314.2,18.8 L312.2,17 L314.8,17 Z"
        fill="oklch(var(--s))" opacity=".95" />
    </motion.g>

    {/* ── Card 3 · Marketer ── */}
    <motion.g {...cardFloat(0.7)}>
      <rect x="90" y="145" width="170" height="120" rx="16" // Larger card
        fill="oklch(var(--b2))" stroke="oklch(var(--s)/0.3)" strokeWidth="1" />
      <rect x="90" y="145" width="170" height="120" rx="16" fill="url(#cg3)" />
      <rect x="90" y="145" width="170" height="3" rx="1.5"
        fill="oklch(var(--s))" opacity=".7" />
      {/* avatar */}
      <circle cx="120" cy="175" r="20" // Larger avatar
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.4)" strokeWidth="1" />
      <circle cx="120" cy="170" r="8" fill="oklch(var(--s)/0.4)" />
      <path d="M101,190 Q120,182 139,190" fill="oklch(var(--s)/0.2)" />
      {/* name + sub */}
      <rect x="150" y="160" width="80" height="9" rx="4.5"
        fill="oklch(var(--s))" opacity=".9" />
      <rect x="150" y="174" width="62" height="6" rx="3"
        fill="oklch(var(--bc))" opacity=".4" />
      <rect x="150" y="184" width="70" height="6" rx="3"
        fill="oklch(var(--bc))" opacity=".25" />
      {/* role badge */}
      <rect x="100" y="200" width="60" height="20" rx="10"
        fill="oklch(var(--s)/0.15)" stroke="oklch(var(--s)/0.5)" strokeWidth=".8" />
      <text x="130" y="214" textAnchor="middle" fontSize="10"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif" fontWeight="600">
        Marketer
      </text>
      {/* skill chips */}
      <rect x="170" y="200" width="42" height="20" rx="10"
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.5)" strokeWidth=".6" />
      <text x="191" y="213" textAnchor="middle" fontSize="9"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif">Growth</text>
      <rect x="216" y="200" width="36" height="20" rx="10"
        fill="oklch(var(--b3))" stroke="oklch(var(--s)/0.4)" strokeWidth=".6" />
      <text x="234" y="213" textAnchor="middle" fontSize="9"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif">SEO</text>
      {/* pulse icon */}
      <circle cx="250" cy="150" r="6" // Larger icon
        fill="oklch(var(--s)/0.2)" stroke="oklch(var(--s))" strokeWidth="1.2" />
      <polyline points="244,150 247,150 249,147 251,153 253,150 256,150"
        fill="none" stroke="oklch(var(--s))"
        strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>

    {/* connecting dashed lines */}
    <line x1="95" y1="130" x2="130" y2="150"
      stroke="oklch(var(--s))" strokeWidth="1"
      strokeDasharray="4 5" opacity=".35" />
    <line x1="240" y1="120" x2="225" y2="150"
      stroke="oklch(var(--s))" strokeWidth="1"
      strokeDasharray="4 5" opacity=".3" />

    {/* stacked avatar cluster */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
      <circle cx="162" cy="135" r="11" // Larger avatars
        fill="oklch(var(--b2))" stroke="oklch(var(--s)/0.6)" strokeWidth="1.2" />
      <text x="162" y="140" textAnchor="middle" fontSize="11"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif" fontWeight="700">F</text>

      <circle cx="180" cy="133" r="11"
        fill="oklch(var(--b2))" stroke="oklch(var(--s)/0.6)" strokeWidth="1.2" />
      <text x="180" y="138" textAnchor="middle" fontSize="11"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif" fontWeight="700">D</text>

      <circle cx="198" cy="135" r="11"
        fill="oklch(var(--b2))" stroke="oklch(var(--s)/0.6)" strokeWidth="1.2" />
      <text x="198" y="140" textAnchor="middle" fontSize="11"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif" fontWeight="700">M</text>
    </motion.g>

    {/* Match pill */}
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4, ease: "backOut" }}
    >
      <rect x="136" y="275" width="78" height="26" rx="13" // Larger pill
        fill="oklch(var(--s)/0.2)" stroke="oklch(var(--s))" strokeWidth="1" strokeOpacity=".7" />
      <circle cx="152" cy="288" r="5" fill="oklch(var(--s))" />
      <text x="175" y="293" textAnchor="middle" fontSize="10"
        fill="oklch(var(--s))" fontFamily="'Segoe UI',sans-serif" fontWeight="600">Match!</text>
    </motion.g>

    {/* ambient sparkle dots */}
    <circle cx="25" cy="165" r="4" fill="oklch(var(--s))" opacity=".2" />
    <circle cx="320" cy="220" r="3" fill="oklch(var(--s))" opacity=".18" />
    <circle cx="65" cy="250" r="2.5" fill="oklch(var(--s))" opacity=".2" />
    <circle cx="295" cy="285" r="2.5" fill="oklch(var(--s))" opacity=".18" />
  </svg>
);

/* ─── Banner ────────────────────────────────────────────────── */
const Banner = () => {
  const [theme, setTheme] = useState('abyss'); // Initial theme

  useEffect(() => {
    const handleThemeChange = () => {
      // Logic to detect theme from DaisyUI
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme || 'abyss'); // Fallback to abyss
    };

    // Observer to watch for theme attribute changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    handleThemeChange(); // Set initial theme on mount

    return () => observer.disconnect(); // Cleanup
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-base-100 transition-colors duration-300"> {/* Added transition */}

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
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-secondary">
                    {value}
                  </span>
                  <span className="text-xs text-base-content/50 leading-tight">
                    {label}
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
            className="hidden lg:flex items-center justify-center p-4" // Added padding
          >
            <Illustration theme={theme} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Banner;