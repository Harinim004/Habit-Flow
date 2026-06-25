import { motion } from "framer-motion";
import dashboardScreenshot from "@/assets/dashboard-screenshot.png";

export function DashboardMockup({
  highlightSection,
}: {
  highlightSection?: "streak" | "stats" | "habits" | "graph" | null;
}) {
  return (
    <div className="glass-strong relative w-full rounded-[2rem] p-2 transition-all duration-300 overflow-hidden shadow-2xl border border-border/10 bg-white/20 dark:bg-white/5 backdrop-blur-xl">
      {/* 1. Mock Browser Window Header */}
      <div className="mb-2 flex items-center justify-between border-b border-border/10 pb-2 px-2">
        {/* Browser control dots */}
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
          <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
          <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
        </div>
        {/* Mock address bar */}
        <div className="rounded bg-white/20 dark:bg-white/5 border border-border/5 px-3 py-0.5 text-[8px] font-medium text-muted-foreground/70 tracking-wide select-none">
          habitflow.app/dashboard
        </div>
        {/* Dummy spacer */}
        <div className="w-10" />
      </div>

      {/* 2. Main Content Area displaying the screenshot */}
      <div className="relative overflow-hidden rounded-xl border border-border/5 bg-background/20 select-none">
        <img
          src={dashboardScreenshot.src}
          alt="HabitFlow App Dashboard Screenshot"
          className="w-full h-auto object-cover"
        />

        {/* Progress highlight overlay (Today's Progress Widget) */}
        <div
          className={`absolute pointer-events-none transition-all duration-300 rounded-xl border-2 border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.4)] ${
            highlightSection === "streak" ? "opacity-100 scale-[1.01]" : "opacity-0 scale-100"
          }`}
          style={{
            top: "37.5%",
            left: "13.5%",
            width: "25.5%",
            height: "14%",
          }}
        />

        {/* Stats highlight overlay (Quick Stats Card) */}
        <div
          className={`absolute pointer-events-none transition-all duration-300 rounded-xl border-2 border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.4)] ${
            highlightSection === "stats" ? "opacity-100 scale-[1.01]" : "opacity-0 scale-100"
          }`}
          style={{
            top: "52%",
            left: "13.5%",
            width: "25.5%",
            height: "24%",
          }}
        />

        {/* Habits Checklist highlight overlay (Checklist Column) */}
        <div
          className={`absolute pointer-events-none transition-all duration-300 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.4)] ${
            highlightSection === "habits" ? "opacity-100 scale-[1.01]" : "opacity-0 scale-100"
          }`}
          style={{
            top: "13%",
            left: "40.5%",
            width: "46%",
            height: "83%",
          }}
        />

        {/* Graph / Calendar highlight overlay (Calendar Date Selector) */}
        <div
          className={`absolute pointer-events-none transition-all duration-300 rounded-xl border-2 border-accent bg-accent/10 shadow-[0_0_20px_rgba(var(--accent),0.4)] ${
            highlightSection === "graph" ? "opacity-100 scale-[1.01]" : "opacity-0 scale-100"
          }`}
          style={{
            top: "78%",
            left: "13.5%",
            width: "25.5%",
            height: "18%",
          }}
        />
      </div>
    </div>
  );
}
