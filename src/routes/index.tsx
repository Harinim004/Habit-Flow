import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import {
  Calendar,
  Flame,
  BarChart3,
  Target,
  Moon,
  Smartphone,
  Menu,
  X,
  ArrowRight,
  Play,
  Sparkles,
  Star,
  Quote,
} from "lucide-react";
import heroDay from "@/assets/hero-valley.jpg";
import heroNight from "@/assets/hero-valley-night.jpg";
import ctaSunset from "@/assets/cta-sunset.jpg";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { Particles } from "@/components/landing/particles";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HabitFlow — Build better habits. Live a better life." },
      {
        name: "description",
        content:
          "The beautiful habit tracking platform that helps you stay consistent, build routines, and achieve your goals effortlessly.",
      },
      { property: "og:title", content: "HabitFlow — Build better habits." },
      {
        property: "og:description",
        content: "Track habits, build streaks, and transform your routine with HabitFlow.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <DashboardShowcase />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ───────────────────────── NAVBAR ───────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all sm:px-6 ${
          scrolled ? "glass" : "bg-transparent"
        }`}
      >
        <a href="#home" className="flex items-center gap-2 font-bold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-lg shadow-primary/40">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg tracking-tight">HabitFlow</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-white/30 hover:text-foreground dark:hover:bg-white/10"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/app"
            className="hidden text-sm font-medium text-foreground/80 hover:text-foreground sm:inline-block"
          >
            Login
          </Link>
          <Link to="/app" className="btn-primary hidden text-sm sm:inline-flex">
            Start Free <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            className="glass grid h-10 w-10 place-items-center rounded-full md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mx-4 mt-2 rounded-3xl p-4 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground/90 hover:bg-white/30 dark:hover:bg-white/10"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/app" className="btn-primary mt-2 w-full text-sm">
                  Start Tracking Free
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="home" className="relative min-h-[100dvh] overflow-hidden pt-24 sm:pt-32">
      {/* Day background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 dark:opacity-0" aria-hidden>
        <img src={heroDay} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-background" />
      </motion.div>
      {/* Night background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10 opacity-0 dark:opacity-100"
        aria-hidden
      >
        <img src={heroNight} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </motion.div>

      <Particles count={35} />

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="mx-auto max-w-4xl px-5 pb-20 text-center flex flex-col items-center justify-center"
      >
        {/* Brand Title / Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 text-6xl font-black leading-[1.1] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl text-gradient"
        >
          HabitFlow
        </motion.h1>

        {/* Subheading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Build better habits.
          <br />
          <span className="text-gradient">Live a better life.</span>
        </motion.h2>

        {/* Description paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 max-w-2xl text-lg text-foreground/80 leading-relaxed sm:text-xl font-medium"
        >
          The beautiful habit tracking platform that helps you stay consistent, build routines, and
          achieve your goals — effortlessly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/app" className="btn-primary">
            Start Tracking Free <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#how" className="btn-glass">
            <Play className="h-4 w-4" /> Watch Demo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-foreground/70"
        >
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full border-2 border-white bg-gradient-accent shadow"
                style={{
                  background: `linear-gradient(135deg, hsl(${i * 60} 80% 70%), hsl(${i * 60 + 40} 80% 60%))`,
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 font-semibold">4.9</span> · loved by 10,000+
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── SOCIAL PROOF ───────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

function SocialProof() {
  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: "Habits Tracked",
      icon: Flame,
      color: "bg-gradient-primary",
    },
    {
      value: 95,
      suffix: "%",
      label: "User Satisfaction",
      icon: Star,
      color: "bg-gradient-accent",
    },
    {
      value: 500,
      suffix: "+",
      label: "Daily Active Users",
      icon: Target,
      color: "bg-gradient-primary",
    },
  ];
  return (
    <section className="relative px-5 py-20">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="glass group relative rounded-3xl p-6 transition-transform hover:-translate-y-1"
          >
            <div
              className={`mb-3 grid h-12 w-12 place-items-center rounded-2xl ${s.color} text-white shadow-lg animate-glow-pulse`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-4xl font-black text-foreground sm:text-5xl">
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── FEATURES ───────────────────────── */
const features = [
  {
    icon: Calendar,
    emoji: "📅",
    title: "Daily Tracking",
    desc: "Track every habit, every day. Simple check-ins that build into powerful routines.",
  },
  {
    icon: Flame,
    emoji: "🔥",
    title: "Streak System",
    desc: "Build unstoppable momentum with streak rewards and milestone celebrations.",
  },
  {
    icon: BarChart3,
    emoji: "📊",
    title: "Progress Analytics",
    desc: "Beautiful charts that show exactly how far you've come and where to go next.",
  },
  {
    icon: Target,
    emoji: "🎯",
    title: "Goal Setting",
    desc: "Set ambitious goals, break them down, and watch yourself crush them.",
  },
  {
    icon: Moon,
    emoji: "🌙",
    title: "Dark Mode",
    desc: "A gorgeous moonlit theme for night owls. Easy on the eyes, magical to look at.",
  },
  {
    icon: Smartphone,
    emoji: "📱",
    title: "Mobile Friendly",
    desc: "Pick up where you left off — on any device, anywhere in the world.",
  },
];

function Features() {
  const [active, setActive] = useState(2);
  return (
    <section id="features" className="relative px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to win the day."
          subtitle="A toolkit designed for consistency. Built for humans who want to grow."
        />

        {/* Carousel */}
        <div className="relative mt-14">
          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {features.map((f, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={f.title}
                  onClick={() => setActive(i)}
                  className={`group snap-center rounded-[2rem] p-7 text-left transition-all duration-500 ${
                    isActive
                      ? "glass-strong scale-100 shadow-xl shadow-primary/30"
                      : "glass scale-90 opacity-70 hover:opacity-100"
                  }`}
                  style={{ minWidth: "min(320px, 80vw)", maxWidth: "320px" }}
                  whileHover={{ y: -6 }}
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-3xl shadow-lg">
                    <span aria-hidden>{f.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Show feature ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-8 bg-primary" : "w-2 bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface SVGFlowerProps {
  x: number;
  y: number;
  color?: string;
  scale?: number;
  delay?: number;
}

function SVGFlower({ x, y, color = "var(--primary)", scale = 1, delay = 0 }: SVGFlowerProps) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      className="animate-sway"
      style={{
        transformOrigin: "bottom center",
        animationDelay: `${delay}s`,
      }}
    >
      {/* Stem */}
      <path d="M 0,30 Q -5,15 0,0" stroke="#76803b" strokeWidth="2" fill="none" />
      {/* Leaf */}
      <path d="M -2,18 Q -10,14 -4,8 Q 0,12 -2,18" fill="#76803b" />
      <path d="M 1,12 Q 9,9 4,3 Q -1,7 1,12" fill="#76803b" />
      {/* Petals */}
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-6"
            rx="4"
            ry="7"
            fill={color}
            transform={`rotate(${angle})`}
            opacity="0.85"
          />
        ))}
        {/* Core center */}
        <circle cx="0" cy="0" r="3.5" fill="#e5d3a1" />
      </g>
    </g>
  );
}

/* ───────────────────────── HOW IT WORKS ───────────────────────── */
function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pathLength = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  const [travelerPos, setTravelerPos] = useState({ x: 250, y: 100 });
  const [angle, setAngle] = useState(90);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const path = pathRef.current;
    if (!path) return;
    try {
      const pathLengthVal = path.getTotalLength();
      let progress = (latest - 0.15) / (0.85 - 0.15);
      progress = Math.max(0, Math.min(1, progress));

      const point = path.getPointAtLength(progress * pathLengthVal);

      const delta = 0.005;
      const nextProgress = Math.min(1, progress + delta);
      const nextPoint = path.getPointAtLength(nextProgress * pathLengthVal);

      const dx = nextPoint.x - point.x;
      const dy = nextPoint.y - point.y;

      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
        const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
        setAngle(deg + 90);
      }

      setTravelerPos({ x: point.x, y: point.y });
    } catch (e) {
      // getPointAtLength can throw if path is not yet fully loaded
    }
  });

  useEffect(() => {
    const path = pathRef.current;
    if (path) {
      try {
        const pathLengthVal = path.getTotalLength();
        const point = path.getPointAtLength(0);
        setTravelerPos({ x: point.x, y: point.y });
      } catch (e) {
        // Fallback for when path length is not yet available
      }
    }
  }, []);

  const steps = [
    {
      title: "Create your habit",
      desc: "Pick what matters. Set the cadence. We handle the rest.",
      emoji: "✨",
    },
    {
      title: "Track daily",
      desc: "One tap to check in. Watch the magic build day by day.",
      emoji: "📅",
    },
    {
      title: "Build your streak",
      desc: "Momentum compounds. Every day strengthens the chain.",
      emoji: "🔥",
    },
    {
      title: "Achieve your goals",
      desc: "Reach milestones you once thought were out of reach.",
      emoji: "🎯",
    },
  ];

  return (
    <section id="how" ref={ref} className="relative px-5 py-28">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes flap-left {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.15) skewY(-5deg); }
        }
        @keyframes flap-right {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.15) skewY(5deg); }
        }
        @keyframes flap-left-fast {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.2) rotate(-8deg); }
        }
        @keyframes flap-right-fast {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.2) rotate(8deg); }
        }
        @keyframes sway {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }
        .animate-flap-left {
          animation: flap-left 0.15s ease-in-out infinite alternate;
        }
        .animate-flap-right {
          animation: flap-right 0.15s ease-in-out infinite alternate;
        }
        .animate-flap-left-fast {
          animation: flap-left-fast 0.08s ease-in-out infinite alternate;
        }
        .animate-flap-right-fast {
          animation: flap-right-fast 0.08s ease-in-out infinite alternate;
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite alternate;
        }
      `,
        }}
      />

      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="How it works"
          title="A path through the valley."
          subtitle="Four steps. One beautiful journey from intention to identity."
        />

        <div className="relative mt-20">
          {/* Curving path */}
          <svg
            className="absolute inset-0 hidden h-full w-full md:block"
            viewBox="0 0 1000 800"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="50%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            <motion.path
              ref={pathRef}
              d="M 250 100 C 500 100, 500 280, 750 280 C 500 280, 500 480, 250 480 C 500 480, 500 680, 750 680"
              stroke="url(#pathGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="0 1"
              style={{ pathLength }}
              fill="none"
            />
            <path
              d="M 250 100 C 500 100, 500 280, 750 280 C 500 280, 500 480, 250 480 C 500 480, 500 680, 750 680"
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Valley Flowers Scenery */}
            <SVGFlower x={200} y={120} scale={0.7} color="var(--primary)" delay={0} />
            <SVGFlower x={280} y={80} scale={0.6} color="var(--accent)" delay={0.5} />
            <SVGFlower x={720} y={320} scale={0.75} color="var(--accent)" delay={0.2} />
            <SVGFlower x={780} y={260} scale={0.55} color="var(--primary)" delay={0.7} />
            <SVGFlower x={220} y={510} scale={0.8} color="var(--primary)" delay={0.4} />
            <SVGFlower x={180} y={450} scale={0.65} color="var(--accent)" delay={0.9} />
            <SVGFlower x={710} y={710} scale={0.8} color="var(--accent)" delay={0.3} />
            <SVGFlower x={770} y={650} scale={0.6} color="var(--primary)" delay={0.8} />

            {/* Guide traveler (SVG elements are positioned directly relative to viewBox) */}
            <g
              transform={`translate(${travelerPos.x}, ${travelerPos.y}) rotate(${angle})`}
              style={{ transition: "transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
            >
              {/* Butterfly (Light Mode) */}
              <g className="block dark:hidden">
                <defs>
                  <linearGradient id="butterflyWingGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#556B2F" />
                    <stop offset="50%" stopColor="#D8D2C2" />
                    <stop offset="100%" stopColor="#9C6644" />
                  </linearGradient>
                </defs>
                {/* Left Wing */}
                <path
                  d="M 0,-4 C -15,-25 -35,-20 -40,-5 C -45,10 -25,10 0,0 C -10,12 -25,22 -30,17 C -35,12 -25,0 0,-4 Z"
                  fill="url(#butterflyWingGrad)"
                  className="animate-flap-left"
                  style={{ transformOrigin: "0px 0px" }}
                />
                {/* Right Wing */}
                <path
                  d="M 0,-4 C 15,-25 35,-20 40,-5 C 45,10 25,10 0,0 C 10,12 25,22 30,17 C 35,12 25,0 0,-4 Z"
                  fill="url(#butterflyWingGrad)"
                  className="animate-flap-right"
                  style={{ transformOrigin: "0px 0px" }}
                />
                {/* Body */}
                <ellipse cx="0" cy="-2" rx="2.5" ry="10" fill="#1e293b" />
                {/* Antennae */}
                <path d="M -1,-10 Q -5,-18 -10,-20" stroke="#1e293b" strokeWidth="1" fill="none" />
                <path d="M 1,-10 Q 5,-18 10,-20" stroke="#1e293b" strokeWidth="1" fill="none" />
              </g>

              {/* Firefly (Dark Mode) */}
              <g className="hidden dark:block">
                <defs>
                  <radialGradient id="fireflyGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C9A227" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#C9A227" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
                  </radialGradient>
                  <filter id="fireflyBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                </defs>
                {/* Pulsating Soft Glow Aura */}
                <circle cx="0" cy="4" r="22" fill="url(#fireflyGlow)" className="animate-pulse" />

                {/* Left Wing */}
                <path
                  d="M 0,0 C -8,-10 -15,-8 -12,2 C -10,8 -5,4 0,0 Z"
                  fill="#ffffff"
                  opacity="0.65"
                  className="animate-flap-left-fast"
                  style={{ transformOrigin: "0px 0px" }}
                />
                {/* Right Wing */}
                <path
                  d="M 0,0 C 8,-10 15,-8 12,2 C 10,8 5,4 0,0 Z"
                  fill="#ffffff"
                  opacity="0.65"
                  className="animate-flap-right-fast"
                  style={{ transformOrigin: "0px 0px" }}
                />
                {/* Body */}
                <ellipse cx="0" cy="-2" rx="2" ry="5.5" fill="#0f172a" />
                {/* Glowing Abdomen */}
                <circle cx="0" cy="4.5" r="4.5" fill="#C9A227" filter="url(#fireflyBlur)" />
                <circle cx="0" cy="4.5" r="3" fill="#ffffff" />
              </g>
            </g>
          </svg>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`glass-strong rounded-[2rem] p-6 sm:p-8 ${i % 2 === 1 ? "md:translate-y-20" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-2xl text-white shadow-lg">
                    <span aria-hidden>{s.emoji}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── DASHBOARD SHOWCASE ───────────────────────── */
function DashboardShowcase() {
  const [selectedSection, setSelectedSection] = useState<
    "streak" | "stats" | "habits" | "graph"
  >("habits");
  const [activeSection, setActiveSection] = useState<
    "streak" | "stats" | "habits" | "graph"
  >("habits");

  const cardData: {
    id: "streak" | "stats" | "habits" | "graph";
    title: string;
    desc: string;
    icon: typeof Calendar;
    color: string;
  }[] = [
    {
      id: "habits",
      title: "Today's Checklist",
      desc: "Check off your scheduled habits like drinking water, reading, or working out.",
      icon: Target,
      color: "bg-gradient-primary",
    },
    {
      id: "graph",
      title: "Select Date",
      desc: "Navigate through the 7-day calendar row to view or log completions for past days.",
      icon: Calendar,
      color: "bg-gradient-accent",
    },
    {
      id: "streak",
      title: "Today's Progress",
      desc: "Monitor your daily completion percentage in real time with a clean visual indicator.",
      icon: Sparkles,
      color: "bg-gradient-primary",
    },
    {
      id: "stats",
      title: "Quick Stats",
      desc: "See your current streak, longest streak, and completion rate metrics at a glance.",
      icon: BarChart3,
      color: "bg-gradient-accent",
    },
  ];

  const arrowPaths = [
    { id: "habits", d: "M 250,150 Q 380,200 558,320" },
    { id: "graph", d: "M 250,450 Q 300,500 392,510" },
    { id: "streak", d: "M 750,150 Q 570,180 392,267" },
    { id: "stats", d: "M 750,450 Q 570,450 392,390" },
  ];

  return (
    <section id="dashboard" className="relative px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Your dashboard"
          title="A command center for your best self."
          subtitle="See every habit, streak, and milestone in one elegant view. Clarity at a glance."
        />

        <div className="relative mt-16 max-w-5xl mx-auto">
          <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl" />

          {/* Desktop Layout (lg) */}
          <div className="hidden lg:grid grid-cols-12 gap-8 items-center relative py-8">
            {/* SVG Pointers */}
            <svg
              className="absolute inset-0 pointer-events-none z-20 w-full h-full"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--primary)" />
                </marker>
                <marker
                  id="arrow-static"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" opacity="0.35" />
                </marker>
              </defs>
              {arrowPaths.map((p) => {
                const isActive = activeSection === p.id;
                return (
                  <motion.path
                    key={p.id}
                    d={p.d}
                    stroke={isActive ? "var(--primary)" : "currentColor"}
                    strokeWidth={isActive ? "3.5" : "1.5"}
                    strokeOpacity={isActive ? 1.0 : 0.25}
                    strokeDasharray={isActive ? "none" : "4 4"}
                    fill="none"
                    markerEnd={isActive ? "url(#arrow)" : "url(#arrow-static)"}
                    animate={{
                      strokeWidth: isActive ? 3.5 : 1.5,
                      strokeOpacity: isActive ? 1.0 : 0.25,
                    }}
                    transition={{ duration: 0.25 }}
                  />
                );
              })}
            </svg>

            {/* Left Column (Habits & Graph) */}
            <div className="col-span-3 flex flex-col gap-10 justify-center z-30">
              {cardData.slice(0, 2).map((c) => {
                const Icon = c.icon;
                const isActive = activeSection === c.id;
                const isSelected = selectedSection === c.id;
                return (
                  <div
                    key={c.id}
                    onMouseEnter={() => setActiveSection(c.id)}
                    onMouseLeave={() => setActiveSection(selectedSection)}
                    onClick={() => {
                      setSelectedSection(c.id);
                      setActiveSection(c.id);
                    }}
                    className={`glass cursor-pointer p-5 rounded-3xl transition-all duration-300 relative border ${
                      isActive || isSelected
                        ? "glass-strong border-primary/50 shadow-lg shadow-primary/10 scale-105"
                        : "border-transparent hover:border-foreground/10 hover:scale-[1.02]"
                    }`}
                  >
                    <div
                      className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${c.color} text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">{c.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Center Column (Mockup + Hotspots) */}
            <div className="col-span-6 relative flex justify-center z-10 rotate-[-1deg]">
              <div className="relative w-full max-w-md">
                <DashboardMockup highlightSection={activeSection} />

                {/* Hotspots */}
                <Hotspot
                  active={activeSection === "streak"}
                  className="top-[44.5%] left-[26%]"
                  onClick={() => {
                    setSelectedSection("streak");
                    setActiveSection("streak");
                  }}
                />
                <Hotspot
                  active={activeSection === "stats"}
                  className="top-[64%] left-[26%]"
                  onClick={() => {
                    setSelectedSection("stats");
                    setActiveSection("stats");
                  }}
                />
                <Hotspot
                  active={activeSection === "habits"}
                  className="top-[54.5%] left-[63%]"
                  onClick={() => {
                    setSelectedSection("habits");
                    setActiveSection("habits");
                  }}
                />
                <Hotspot
                  active={activeSection === "graph"}
                  className="top-[87%] left-[26%]"
                  onClick={() => {
                    setSelectedSection("graph");
                    setActiveSection("graph");
                  }}
                />
              </div>
            </div>

            {/* Right Column (Streak & Stats) */}
            <div className="col-span-3 flex flex-col gap-10 justify-center z-30">
              {cardData.slice(2).map((c) => {
                const Icon = c.icon;
                const isActive = activeSection === c.id;
                const isSelected = selectedSection === c.id;
                return (
                  <div
                    key={c.id}
                    onMouseEnter={() => setActiveSection(c.id)}
                    onMouseLeave={() => setActiveSection(selectedSection)}
                    onClick={() => {
                      setSelectedSection(c.id);
                      setActiveSection(c.id);
                    }}
                    className={`glass cursor-pointer p-5 rounded-3xl transition-all duration-300 relative border ${
                      isActive || isSelected
                        ? "glass-strong border-primary/50 shadow-lg shadow-primary/10 scale-105"
                        : "border-transparent hover:border-foreground/10 hover:scale-[1.02]"
                    }`}
                  >
                    <div
                      className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${c.color} text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">{c.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile & Tablet Layout (stacked) */}
          <div className="lg:hidden flex flex-col gap-8">
            <div className="relative mx-auto w-full max-w-md rotate-[-1deg]">
              <DashboardMockup highlightSection={activeSection} />

              {/* Hotspots */}
              <Hotspot
                active={activeSection === "streak"}
                className="top-[44.5%] left-[26%]"
                onClick={() => {
                  setSelectedSection("streak");
                  setActiveSection("streak");
                }}
              />
              <Hotspot
                active={activeSection === "stats"}
                className="top-[64%] left-[26%]"
                onClick={() => {
                  setSelectedSection("stats");
                  setActiveSection("stats");
                }}
              />
              <Hotspot
                active={activeSection === "habits"}
                className="top-[54.5%] left-[63%]"
                onClick={() => {
                  setSelectedSection("habits");
                  setActiveSection("habits");
                }}
              />
              <Hotspot
                active={activeSection === "graph"}
                className="top-[87%] left-[26%]"
                onClick={() => {
                  setSelectedSection("graph");
                  setActiveSection("graph");
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cardData.map((c) => {
                const Icon = c.icon;
                const isActive = activeSection === c.id;
                const isSelected = selectedSection === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedSection(c.id);
                      setActiveSection(c.id);
                    }}
                    className={`glass cursor-pointer p-5 rounded-3xl transition-all duration-300 relative border ${
                      isActive || isSelected
                        ? "glass-strong border-primary/50 shadow-md scale-102"
                        : "border-transparent hover:border-foreground/10"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${c.color} text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">{c.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Helper Hotspot Component */
function Hotspot({
  active,
  className = "",
  onClick,
}: {
  active: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute z-30 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 ${
        active
          ? "bg-primary text-white scale-125 shadow-lg shadow-primary/60"
          : "bg-white/95 text-primary shadow-lg border border-primary/20 hover:scale-110"
      } ${className}`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${active ? "bg-white scale-110" : "bg-primary animate-ping"}`}
      />
    </button>
  );
}

/* ───────────────────────── TESTIMONIALS ───────────────────────── */
const testimonials = [
  {
    name: "Maya Chen",
    role: "Product Designer",
    text: "HabitFlow helped me read every single day for 3 months straight. The streaks are addictive in the best way.",
    avatar: "M",
  },
  {
    name: "Jordan Patel",
    role: "Engineer",
    text: "My productivity improved dramatically. The analytics finally made me understand my own patterns.",
    avatar: "J",
  },
  {
    name: "Sara Okonkwo",
    role: "Writer",
    text: "It feels less like an app and more like a tiny coach in my pocket. Beautiful, calm, effective.",
    avatar: "S",
  },
  {
    name: "Leo Martin",
    role: "Founder",
    text: "I've tried every habit tracker. This one finally stuck — because using it feels like a reward.",
    avatar: "L",
  },
  {
    name: "Aiko Tanaka",
    role: "Student",
    text: "I built a meditation streak of 120 days. HabitFlow changed how I show up for myself.",
    avatar: "A",
  },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 2000);
    return () => clearInterval(t);
  }, []);
  const get = (offset: number) =>
    testimonials[(idx + offset + testimonials.length) % testimonials.length];

  return (
    <section id="testimonials" className="relative px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Testimonials"
          title="Stories from the journey."
          subtitle="Real people. Real habits. Real change."
        />

        <div className="relative mt-16 h-[420px] sm:h-[380px]">
          <AnimatePresence mode="popLayout">
            {[-1, 0, 1].map((offset) => {
              const t = get(offset);
              const isCenter = offset === 0;
              return (
                <motion.article
                  key={`${idx}-${offset}`}
                  initial={{ opacity: 0, scale: 0.8, x: offset * 280 }}
                  animate={{
                    opacity: isCenter ? 1 : 0.4,
                    scale: isCenter ? 1 : 0.85,
                    x: offset * 320,
                    y: isCenter ? 0 : 20,
                    rotate: offset * 3,
                  }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  className={`absolute left-1/2 top-0 w-[88vw] max-w-md -translate-x-1/2 rounded-[2rem] p-7 ${
                    isCenter ? "glass-strong z-20" : "glass z-10 hidden sm:block"
                  }`}
                >
                  <Quote className="h-8 w-8 text-primary/60" />
                  <p className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">
                    "{t.text}"
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary font-bold text-white shadow-lg">
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FINAL CTA ───────────────────────── */
function FinalCTA() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.25,
    });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <section id="cta" className="relative px-5 py-28">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] p-10 sm:p-16"
      >
        <img
          src={ctaSunset}
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/80 via-black/50 to-accent/80" />
        <Particles count={20} />

        <div className="relative text-center">
          <h2 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Ready to transform <br className="hidden sm:block" /> your routine?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            Join thousands of users building better habits every day. Free to start. No credit card
            needed.
          </p>

          <div className="mt-10 flex justify-center" onMouseMove={onMove} onMouseLeave={reset}>
            <Link
              ref={btnRef}
              to="/app"
              className="btn-primary px-8 py-4 text-base sm:text-lg"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: "transform 0.25s cubic-bezier(0.2,0.8,0.2,1)",
              }}
            >
              Start Building Habits <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── FOOTER ───────────────────────── */
function Footer() {
  return (
    <footer className="relative px-5 pb-10 pt-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 rounded-[2rem] glass p-8 sm:grid-cols-4">
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg">HabitFlow</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            A magical journey through your habits. Build the life you want, one day at a time.
          </p>
        </div>
        {[
          { title: "Product", items: ["Features", "Dashboard", "Mobile", "Pricing"] },
          { title: "Company", items: ["About", "Blog", "Careers", "Contact"] },
        ].map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-bold text-foreground">{col.title}</p>
            <ul className="space-y-2">
              {col.items.map((it) => (
                <li key={it}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © 2026 HabitFlow. Crafted with care.
      </p>
    </footer>
  );
}

/* ───────────────────────── SECTION HEADER ───────────────────────── */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass mx-auto inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-5xl"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-base text-muted-foreground sm:text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
