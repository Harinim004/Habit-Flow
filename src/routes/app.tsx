import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar as CalendarIcon,
  BarChart2,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  ArrowLeft,
  TrendingUp,
  LayoutDashboard,
  Check,
  Settings,
  Upload,
  Download,
  RefreshCw,
  Trophy,
  Target,
} from "lucide-react";
import {
  format,
  subDays,
  addDays,
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  startOfWeek,
} from "date-fns";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { Habit, calculateStreaks, generateSeedHabits, getLastCompletedText } from "@/lib/streaks";

export const Route = createFileRoute("/app")({
  head: () => ({
    title: "Dashboard — HabitFlow",
    meta: [
      { title: "Dashboard — HabitFlow" },
      {
        name: "description",
        content: "Track your habits, build streaks, and monitor progress beautifully.",
      },
    ],
  }),
  component: HabitTrackerDashboard,
});

const COLOR_OPTIONS = [
  { name: "Olive", hex: "#556B2F" },
  { name: "Walnut", hex: "#9C6644" },
  { name: "Stone", hex: "#D8D2C2" },
  { name: "Gold", hex: "#C9A227" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Sky Blue", hex: "#0EA5E9" },
  { name: "Crimson", hex: "#EF4444" },
  { name: "Warm Amber", hex: "#F59E0B" },
];

const ICON_OPTIONS = [
  { name: "GlassWater", label: "Hydration" },
  { name: "BookOpen", label: "Reading" },
  { name: "Coffee", label: "Morning Routine" },
  { name: "Flame", label: "Streak/Exercise" },
  { name: "Dumbbell", label: "Workout" },
  { name: "Brain", label: "Mindfulness/Meditation" },
  { name: "Target", label: "Focus/Goals" },
  { name: "Heart", label: "Health/Self-care" },
];

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function HabitIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const props = { className };
  switch (name) {
    case "GlassWater":
      return <span className="text-xl">💧</span>;
    case "BookOpen":
      return <span className="text-xl">📚</span>;
    case "Coffee":
      return <span className="text-xl">☕</span>;
    case "Flame":
      return <span className="text-xl">🔥</span>;
    case "Dumbbell":
      return <span className="text-xl">💪</span>;
    case "Brain":
      return <span className="text-xl">🧘</span>;
    case "Target":
      return <span className="text-xl">🎯</span>;
    case "Heart":
      return <span className="text-xl">❤️</span>;
    default:
      return <span className="text-xl">✨</span>;
  }
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

function HabitTrackerDashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<
    "today" | "overview" | "calendar" | "analytics" | "settings"
  >("today");
  const [isMounted, setIsMounted] = useState(false);

  // Active day selection for the Today Checklist
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const selectedDayStr = useMemo(() => format(selectedDay, "yyyy-MM-dd"), [selectedDay]);

  // Selected day for the GitHub contribution heatmap
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<Date>(new Date());
  const selectedCalendarDayStr = useMemo(
    () => format(selectedCalendarDay, "yyyy-MM-dd"),
    [selectedCalendarDay],
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSchedule, setFormSchedule] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default
  const [formColor, setFormColor] = useState("#556B2F");
  const [formIcon, setFormIcon] = useState("Flame");

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("habitflow-habits");
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch (e) {
        const seed = generateSeedHabits();
        setHabits(seed);
        localStorage.setItem("habitflow-habits", JSON.stringify(seed));
      }
    } else {
      const seed = generateSeedHabits();
      setHabits(seed);
      localStorage.setItem("habitflow-habits", JSON.stringify(seed));
    }
  }, []);

  // Save to localStorage whenever habits change
  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem("habitflow-habits", JSON.stringify(updatedHabits));
  };

  // Streaks for all habits computed dynamically based on history
  const habitsWithStats = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    return habits.map((h) => {
      const { currentStreak, longestStreak } = calculateStreaks(h, todayStr);
      const totalCompletions = Object.values(h.history).filter(Boolean).length;
      return {
        ...h,
        currentStreak,
        longestStreak,
        totalCompletions,
      };
    });
  }, [habits]);

  // Overall statistics for the quick stats widget
  const overallStats = useMemo(() => {
    if (habits.length === 0) return { bestStreak: 0, longestStreak: 0, overallCompletionRate: 0 };

    const bestStreak = Math.max(...habitsWithStats.map((h) => h.currentStreak), 0);
    const longestStreak = Math.max(...habitsWithStats.map((h) => h.longestStreak), 0);

    // Calculate overall completion rate across last 30 days
    let totalScheduled = 0;
    let totalCompleted = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const d = subDays(today, i);
      const dStr = format(d, "yyyy-MM-dd");
      const weekday = d.getDay();

      habits.forEach((h) => {
        const createdDate = parseISO(h.createdAt.split("T")[0]);
        if (d >= createdDate && h.schedule.includes(weekday)) {
          totalScheduled++;
          if (h.history[dStr]) {
            totalCompleted++;
          }
        }
      });
    }

    const overallCompletionRate =
      totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

    return { bestStreak, longestStreak, overallCompletionRate };
  }, [habits, habitsWithStats]);

  // Determine greeting based on current time
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Selected day checklist for the Heatmap sidebar details
  const selectedCalendarDayOfWeek = selectedCalendarDay.getDay();
  const habitsDueOnSelectedCalendarDay = useMemo(() => {
    return habitsWithStats.filter((h) => h.schedule.includes(selectedCalendarDayOfWeek));
  }, [habitsWithStats, selectedCalendarDayOfWeek]);

  // Heatmap generation: last 12 weeks of dates
  const heatmapWeeks = useMemo(() => {
    const today = new Date();
    // Start of week for 11 weeks ago
    const startDate = startOfWeek(subDays(today, 11 * 7));
    const grid = [];

    for (let w = 0; w < 12; w++) {
      const weekDaysList = [];
      const weekStart = addDays(startDate, w * 7);
      for (let d = 0; d < 7; d++) {
        weekDaysList.push(addDays(weekStart, d));
      }
      grid.push(weekDaysList);
    }
    return grid;
  }, []);

  // Export Data
  const exportBackup = () => {
    try {
      const dataStr = JSON.stringify(habits, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = `habitflow-backup-${format(new Date(), "yyyy-MM-dd")}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      toast.success("Backup exported successfully! 💾", {
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      });
    } catch (e) {
      toast.error("Failed to export backup.");
    }
  };

  // Import Data
  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);

          if (
            Array.isArray(parsed) &&
            parsed.every((h) => h.id && h.name && Array.isArray(h.schedule))
          ) {
            saveHabits(parsed);
            toast.success("Backup restored successfully! 🔄", {
              style: {
                background: "var(--card)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            });
            e.target.value = "";
          } else {
            toast.error("Invalid file format. Backup must be a list of valid habits.");
          }
        } catch (err) {
          toast.error("Failed to parse JSON file.");
        }
      };
    }
  };

  // Reset Database
  const resetDatabase = () => {
    if (
      confirm(
        "Are you sure you want to reset all your data? This will delete all custom habits and restore default templates.",
      )
    ) {
      const seeds = generateSeedHabits();
      saveHabits(seeds);
      setSelectedCalendarDay(new Date());
      toast.success("Database restored to demo seeds! 🍃", {
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      });
    }
  };

  // Get past 7 days for the Today horizontal bar
  const weekDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
  }, []);

  // Toggle habit done status for the selected day
  const toggleHabit = (habitId: string, dateStr: string) => {
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const history = { ...h.history };
        const currentlyDone = !!history[dateStr];
        if (currentlyDone) {
          delete history[dateStr];
        } else {
          history[dateStr] = true;
        }

        // Fire toast for streak gains!
        if (!currentlyDone && dateStr === format(new Date(), "yyyy-MM-dd")) {
          const stats = calculateStreaks({ ...h, history }, dateStr);
          if (stats.currentStreak > 0) {
            toast.success(`Completed "${h.name}"! ${stats.currentStreak} day streak 🔥`, {
              style: {
                background: "var(--card)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            });
          }
        }

        return { ...h, history };
      }
      return h;
    });
    saveHabits(updated);
  };

  // Delete a habit
  const deleteHabit = (id: string) => {
    if (confirm("Are you sure you want to delete this habit? This cannot be undone.")) {
      const updated = habits.filter((h) => h.id !== id);
      saveHabits(updated);
      toast.error("Habit deleted", {
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      });
    }
  };

  // Open modal in Create mode
  const openCreateModal = () => {
    setModalMode("create");
    setEditingHabit(null);
    setFormName("");
    setFormSchedule([1, 2, 3, 4, 5]); // default Mon-Fri
    setFormColor("#556B2F");
    setFormIcon("Flame");
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (habit: Habit) => {
    setModalMode("edit");
    setEditingHabit(habit);
    setFormName(habit.name);
    setFormSchedule(habit.schedule);
    setFormColor(habit.color);
    setFormIcon(habit.icon);
    setIsModalOpen(true);
  };

  // Submit Habit Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Habit name is required.");
      return;
    }

    if (modalMode === "create") {
      const newHabit: Habit = {
        id: "habit-" + Date.now(),
        name: formName.trim(),
        schedule: [...formSchedule].sort(),
        color: formColor,
        icon: formIcon,
        createdAt: new Date().toISOString(),
        history: {},
      };
      saveHabits([...habits, newHabit]);
      toast.success("New habit created! 🎯", {
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      });
    } else if (modalMode === "edit" && editingHabit) {
      const updated = habits.map((h) => {
        if (h.id === editingHabit.id) {
          return {
            ...h,
            name: formName.trim(),
            schedule: [...formSchedule].sort(),
            color: formColor,
            icon: formIcon,
          };
        }
        return h;
      });
      saveHabits(updated);
      toast.success("Habit updated successfully", {
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      });
    }

    setIsModalOpen(false);
  };

  const toggleDayInSchedule = (dayIndex: number) => {
    if (formSchedule.includes(dayIndex)) {
      setFormSchedule(formSchedule.filter((d) => d !== dayIndex));
    } else {
      setFormSchedule([...formSchedule, dayIndex]);
    }
  };

  // Filter habits due on selected day
  const selectedDayOfWeek = selectedDay.getDay();
  const habitsDueSelectedDay = useMemo(() => {
    return habitsWithStats.filter((h) => h.schedule.includes(selectedDayOfWeek));
  }, [habitsWithStats, selectedDayOfWeek]);

  const todayCompletedCount = useMemo(() => {
    return habitsDueSelectedDay.filter((h) => !!h.history[selectedDayStr]).length;
  }, [habitsDueSelectedDay, selectedDayStr]);

  const todayCompletionPercentage = useMemo(() => {
    if (habitsDueSelectedDay.length === 0) return 0;
    return Math.round((todayCompletedCount / habitsDueSelectedDay.length) * 100);
  }, [todayCompletedCount, habitsDueSelectedDay]);

  // Analytics helper calculations
  const analyticsDataLast14Days = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = subDays(today, i);
      const str = format(d, "yyyy-MM-dd");
      const weekday = d.getDay();

      const due = habits.filter((h) => h.schedule.includes(weekday));
      const completed = due.filter((h) => !!h.history[str]);

      result.push({
        date: format(d, "MMM dd"),
        rate: due.length > 0 ? Math.round((completed.length / due.length) * 100) : 0,
      });
    }
    return result;
  }, [habits]);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Sparkles className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-semibold">Loading HabitFlow Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-hero text-foreground relative overflow-x-hidden">
      <Toaster position="top-right" />

      {/* Floating Background Floral Scenery */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06] dark:opacity-[0.03] select-none -z-10">
        <svg
          className="h-full w-full min-h-screen"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden
        >
          <SVGFlower x={80} y={150} scale={1.8} color="var(--primary)" delay={0} />
          <SVGFlower x={120} y={220} scale={1.2} color="var(--accent)" delay={1} />
          <SVGFlower x={900} y={400} scale={2} color="var(--accent)" delay={0.5} />
          <SVGFlower x={850} y={480} scale={1.3} color="var(--primary)" delay={1.5} />
          <SVGFlower x={100} y={800} scale={1.6} color="var(--primary)" delay={0.7} />
          <SVGFlower x={880} y={850} scale={1.8} color="var(--accent)" delay={1.2} />
        </svg>
      </div>

      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-40 w-full glass border-b border-border/10 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-foreground transition"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 font-bold text-foreground">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="text-base tracking-tight">HabitFlow</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={openCreateModal}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" /> Create Habit
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT CONTAINER --- */}
      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        {/* --- TABS --- */}
        <div className="mb-6 flex overflow-x-auto rounded-2xl glass p-1 gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(
            [
              { id: "today", label: "Today", icon: LayoutDashboard },
              { id: "overview", label: "Overview", icon: Award },
              { id: "calendar", label: "Heatmap", icon: CalendarIcon },
              { id: "analytics", label: "Insights", icon: BarChart2 },
              { id: "settings", label: "Settings", icon: Settings },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/75 hover:bg-white/20 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* --- CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          {activeTab === "today" && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {/* Daily Progress Widget, Welcome Card & Day Selector */}
              <div className="flex flex-col gap-6 md:col-span-1">
                {/* Welcome Card */}
                <div className="rounded-[2rem] glass p-6 flex flex-col justify-between relative overflow-hidden group">
                  {/* Subtle background glow */}
                  <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

                  <div>
                    <h3 className="text-xl font-black text-foreground">{greeting},</h3>
                    <p className="text-xs text-foreground/80 mt-2 font-medium">
                      {habitsDueSelectedDay.length > 0 ? (
                        <>
                          You have{" "}
                          <span className="font-extrabold text-primary">
                            {habitsDueSelectedDay.length} habits
                          </span>{" "}
                          scheduled for {isSameDay(selectedDay, new Date()) ? "today" : "this day"}.
                        </>
                      ) : (
                        "No habits scheduled for today."
                      )}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-border/10">
                    <div>
                      <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {todayCompletedCount}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Completed
                      </span>
                    </div>
                    <div>
                      <span className="block text-2xl font-black text-foreground/75">
                        {Math.max(0, habitsDueSelectedDay.length - todayCompletedCount)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Remaining
                      </span>
                    </div>
                  </div>
                </div>

                {/* Today's Progress */}
                <div className="rounded-[2rem] glass p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Today's Progress
                    </h3>
                    <span className="text-sm font-black text-primary">
                      {todayCompletionPercentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-border/10 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${todayCompletionPercentage}%` }}
                    />
                  </div>

                  <p className="mt-3 text-[10px] font-bold text-muted-foreground/80">
                    {todayCompletedCount} of {habitsDueSelectedDay.length} Completed
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="rounded-[2rem] glass p-5 flex flex-col gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Quick Stats
                  </h3>

                  <div className="flex flex-col gap-2.5">
                    {/* Best Current Streak */}
                    <div className="flex items-center justify-between rounded-xl bg-white/20 dark:bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4.5 w-4.5 fill-orange-500 text-orange-500" />
                        <span className="text-xs font-bold text-foreground">Current Streak</span>
                      </div>
                      <span className="text-xs font-black text-foreground">
                        {overallStats.bestStreak} {overallStats.bestStreak === 1 ? "day" : "days"}
                      </span>
                    </div>

                    {/* Best Longest Streak */}
                    <div className="flex items-center justify-between rounded-xl bg-white/20 dark:bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4.5 w-4.5 text-primary" />
                        <span className="text-xs font-bold text-foreground">Longest Streak</span>
                      </div>
                      <span className="text-xs font-black text-foreground">
                        {overallStats.longestStreak}{" "}
                        {overallStats.longestStreak === 1 ? "day" : "days"}
                      </span>
                    </div>

                    {/* Completion Rate */}
                    <div className="flex items-center justify-between rounded-xl bg-white/20 dark:bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4.5 w-4.5 text-accent" />
                        <span className="text-xs font-bold text-foreground">Completion Rate</span>
                      </div>
                      <span className="text-xs font-black text-foreground">
                        {overallStats.overallCompletionRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 7-Day Horizontal Bar */}
                <div className="rounded-[2rem] glass p-5">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select Tracking Date
                  </h3>
                  <div className="flex justify-between gap-1.5">
                    {weekDays.map((d) => {
                      const isToday = isSameDay(d, new Date());
                      const isSelected = isSameDay(d, selectedDay);
                      const dStr = format(d, "yyyy-MM-dd");
                      const weekday = d.getDay();

                      // Calculate completion rate for this day
                      const dueOnDay = habits.filter((h) => h.schedule.includes(weekday));
                      const compOnDay = dueOnDay.filter((h) => !!h.history[dStr]);
                      const percent =
                        dueOnDay.length > 0
                          ? Math.round((compOnDay.length / dueOnDay.length) * 100)
                          : 0;

                      return (
                        <button
                          key={dStr}
                          onClick={() => setSelectedDay(d)}
                          className={`flex flex-1 flex-col items-center rounded-2xl py-3 transition-all relative ${
                            isSelected
                              ? "bg-primary text-primary-foreground shadow shadow-primary/30 scale-105"
                              : "glass text-foreground hover:scale-102"
                          }`}
                        >
                          <span className="text-[10px] font-medium uppercase opacity-75">
                            {format(d, "eee").substring(0, 1)}
                          </span>
                          <span className="mt-1 text-base font-black">{format(d, "d")}</span>
                          {dueOnDay.length > 0 ? (
                            <span
                              className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${
                                isSelected
                                  ? "bg-white"
                                  : percent === 100
                                    ? "bg-emerald-500"
                                    : percent > 0
                                      ? "bg-primary"
                                      : "bg-border/30"
                              }`}
                            />
                          ) : (
                            <span className="absolute bottom-1.5 text-[8px] opacity-40">·</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setSelectedDay(new Date())}
                      disabled={isSameDay(selectedDay, new Date())}
                      className="text-[10px] font-semibold text-primary underline decoration-primary/40 underline-offset-4 disabled:opacity-40 disabled:no-underline"
                    >
                      Jump to Today
                    </button>
                  </div>
                </div>
              </div>

              {/* Today Checklist */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="rounded-[2rem] glass p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-foreground">
                        {isSameDay(selectedDay, new Date())
                          ? "Today's Checklist"
                          : format(selectedDay, "MMMM d, yyyy")}
                      </h2>
                      <p className="text-xs text-muted-foreground font-medium">
                        Due habits for {format(selectedDay, "EEEE")}
                      </p>
                    </div>
                    {habitsDueSelectedDay.length > 0 && todayCompletionPercentage === 100 && (
                      <span className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="h-3 w-3" /> All done
                      </span>
                    )}
                  </div>

                  {habitsDueSelectedDay.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-border/5 text-muted-foreground text-3xl">
                        🍃
                      </div>
                      <h3 className="mt-4 text-base font-bold text-foreground">Rest Day!</h3>
                      <p className="mx-auto mt-2 max-w-sm text-xs text-muted-foreground">
                        No habits are scheduled for this day. You can take a break or add a new
                        habit to your routine.
                      </p>
                      <button
                        onClick={openCreateModal}
                        className="btn-primary mt-6 text-xs px-4 py-2"
                      >
                        Create a Habit
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {habitsDueSelectedDay.map((h) => {
                        const isDone = !!h.history[selectedDayStr];
                        return (
                          <div
                            key={h.id}
                            className={`flex items-center justify-between rounded-2xl p-4 transition-all duration-300 border ${
                              isDone
                                ? "glass border-emerald-500/10 opacity-75"
                                : "glass hover:border-foreground/10"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Habit Check Action */}
                              <button
                                onClick={() => toggleHabit(h.id, selectedDayStr)}
                                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-all duration-300 border-2 ${
                                  isDone
                                    ? "bg-emerald-500 border-emerald-500 text-white shadow shadow-emerald-500/30 scale-102"
                                    : "border-border/30 hover:border-primary/50 hover:bg-white/5"
                                }`}
                              >
                                {isDone && <Check className="h-5 w-5 stroke-[3px]" />}
                              </button>
                              <div className="min-w-0">
                                <span
                                  className={`block text-base font-bold truncate ${
                                    isDone
                                      ? "text-muted-foreground line-through decoration-emerald-500/50"
                                      : "text-foreground"
                                  }`}
                                >
                                  {h.name}
                                </span>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: h.color }}
                                  />
                                  <span>
                                    {h.schedule.length === 7
                                      ? "Every day"
                                      : `${h.schedule.length} days/week`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Flame Streak Indicator */}
                            <div className="flex items-center gap-1.5">
                              {h.currentStreak > 0 ? (
                                <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-500">
                                  <Flame className="h-3.5 w-3.5 fill-orange-500" />
                                  {h.currentStreak}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 rounded-full bg-border/5 px-3 py-1.5 text-xs font-bold text-muted-foreground/60">
                                  <Flame className="h-3.5 w-3.5 opacity-40" />0
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="rounded-[2.5rem] glass p-6"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Habits List</h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    Configure schedules, monitor streak milestones, or perform updates.
                  </p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="btn-primary flex items-center gap-1.5 text-xs px-4 py-2"
                >
                  <Plus className="h-4 w-4" /> Add Habit
                </button>
              </div>

              {habitsWithStats.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm text-muted-foreground font-semibold">
                    No habits created yet.
                  </p>
                  <button onClick={openCreateModal} className="btn-primary mt-4 text-xs px-4 py-2">
                    Add Your First Habit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {habitsWithStats.map((h) => (
                    <div
                      key={h.id}
                      className="group flex flex-col justify-between rounded-2xl glass p-5 border border-transparent hover:border-foreground/10 transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className="grid h-10 w-10 place-items-center rounded-xl shadow-md text-white"
                              style={{
                                backgroundColor: h.color,
                                boxShadow: `0 4px 12px ${h.color}30`,
                              }}
                            >
                              <HabitIcon name={h.icon} />
                            </span>
                            <div>
                              <h3 className="text-base font-bold text-foreground">{h.name}</h3>
                              <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">
                                {h.schedule.length === 7
                                  ? "Everyday"
                                  : h.schedule.map((dayIdx) => WEEKDAY_NAMES[dayIdx]).join(", ")}
                              </span>
                            </div>
                          </div>

                          {/* Quick action buttons */}
                          <div className="flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(h)}
                              className="glass hover:bg-white/35 grid h-8 w-8 place-items-center rounded-full text-foreground/80 hover:text-foreground transition"
                              aria-label="Edit habit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteHabit(h.id)}
                              className="glass hover:bg-red-500/10 grid h-8 w-8 place-items-center rounded-full text-foreground/80 hover:text-red-500 transition"
                              aria-label="Delete habit"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Streak stats grid */}
                        <div className="mt-5 grid grid-cols-3 gap-2">
                          <div className="rounded-xl bg-white/20 dark:bg-white/5 p-2.5 text-center flex flex-col justify-between">
                            <Flame className="mx-auto h-4 w-4 fill-orange-500 text-orange-500" />
                            <span className="block mt-1 text-sm font-black text-foreground">
                              {h.currentStreak} {h.currentStreak === 1 ? "Day" : "Days"}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">
                              Current
                            </span>
                          </div>

                          <div className="rounded-xl bg-white/20 dark:bg-white/5 p-2.5 text-center flex flex-col justify-between">
                            <Trophy className="mx-auto h-4 w-4 text-primary" />
                            <span className="block mt-1 text-sm font-black text-foreground">
                              {h.longestStreak} {h.longestStreak === 1 ? "Day" : "Days"}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">
                              Longest
                            </span>
                          </div>

                          <div className="rounded-xl bg-white/20 dark:bg-white/5 p-2.5 text-center flex flex-col justify-between">
                            <div className="text-xs text-accent">📅</div>
                            <span className="block mt-0.5 text-[10px] font-black text-foreground leading-tight truncate">
                              {getLastCompletedText(h, format(new Date(), "yyyy-MM-dd"))}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">
                              Last Done
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-4"
            >
              {/* Heatmap day details sidebar */}
              <div className="md:col-span-1 rounded-[2.5rem] glass p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Day Details
                  </h3>
                  <h4 className="text-base font-black text-foreground mt-1 leading-tight">
                    {format(selectedCalendarDay, "EEEE")}
                  </h4>
                  <h5 className="text-xs font-bold text-muted-foreground mt-0.5">
                    {format(selectedCalendarDay, "MMMM d, yyyy")}
                  </h5>
                  {isSameDay(selectedCalendarDay, new Date()) && (
                    <span className="inline-block mt-2 text-[9px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded">
                      Today
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  {habitsDueOnSelectedCalendarDay.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      <span className="text-xl">🍃</span>
                      <p className="mt-2 font-medium">No habits scheduled</p>
                      <p className="text-[10px] opacity-75">for this weekday.</p>
                    </div>
                  ) : (
                    habitsDueOnSelectedCalendarDay.map((h) => {
                      const dayStr = format(selectedCalendarDay, "yyyy-MM-dd");
                      const isDone = !!h.history[dayStr];
                      return (
                        <button
                          key={h.id}
                          onClick={() => toggleHabit(h.id, dayStr)}
                          className={`flex items-center gap-2.5 rounded-xl p-3 text-left transition-all border ${
                            isDone
                              ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                              : "glass border-transparent hover:border-foreground/10 text-foreground"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white text-xs ${
                              isDone ? "bg-emerald-500 shadow-sm" : ""
                            }`}
                            style={{ backgroundColor: isDone ? undefined : h.color }}
                          >
                            {isDone ? (
                              <Check className="h-3.5 w-3.5 stroke-[3px]" />
                            ) : (
                              <HabitIcon name={h.icon} className="h-3.5 w-3.5" />
                            )}
                          </span>
                          <span
                            className={`truncate text-xs font-bold ${isDone ? "line-through text-muted-foreground" : ""}`}
                          >
                            {h.name}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* GitHub contribution style calendar heatmap */}
              <div className="md:col-span-3 rounded-[2.5rem] glass p-6">
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-foreground">Consistency Grid</h2>
                    <p className="text-xs text-muted-foreground font-medium">
                      Automatic contribution heatmap for all scheduled routines. Select a day to
                      log.
                    </p>
                  </div>

                  <div className="flex gap-2 items-start overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Weekday labels */}
                    <div className="grid grid-rows-7 gap-1.5 text-[9px] font-bold text-muted-foreground uppercase pt-6">
                      <div className="h-7 flex items-center">Sun</div>
                      <div className="h-7 flex items-center">Mon</div>
                      <div className="h-7 flex items-center">Tue</div>
                      <div className="h-7 flex items-center">Wed</div>
                      <div className="h-7 flex items-center">Thu</div>
                      <div className="h-7 flex items-center">Fri</div>
                      <div className="h-7 flex items-center">Sat</div>
                    </div>

                    {/* Grid container */}
                    <div className="flex-1 min-w-[320px]">
                      {/* Month Labels row */}
                      <div className="mb-2 grid grid-cols-12 text-[9px] font-bold text-muted-foreground uppercase">
                        {heatmapWeeks.map((week, wIdx) => {
                          const midWeekDay = week[3];
                          const showLabel =
                            wIdx === 0 ||
                            week.some((d) => format(d, "d") === "1" || format(d, "d") === "01");
                          return (
                            <div
                              key={`month-lbl-${wIdx}`}
                              className="text-left font-black tracking-wide"
                            >
                              {showLabel ? format(midWeekDay, "MMM") : ""}
                            </div>
                          );
                        })}
                      </div>

                      {/* Heatmap 7x12 Grid */}
                      <div className="grid grid-flow-col grid-rows-7 gap-1.5">
                        {heatmapWeeks.map((week) =>
                          week.map((day) => {
                            const dayStr = format(day, "yyyy-MM-dd");
                            const weekdayIdx = day.getDay();

                            // Calculate completion percentage
                            const dueHabits = habits.filter((h) => h.schedule.includes(weekdayIdx));
                            const completedHabits = dueHabits.filter((h) => !!h.history[dayStr]);

                            const totalDue = dueHabits.length;
                            const totalCompleted = completedHabits.length;
                            const ratio = totalDue > 0 ? totalCompleted / totalDue : 0;
                            const isToday = isSameDay(day, new Date());
                            const isSelected = isSameDay(day, selectedCalendarDay);
                            const isFuture = day > new Date();

                            // Get styles based on ratio
                            let cellStyle: React.CSSProperties = {};
                            let cellClass = "rounded-[6px] transition-all relative border ";

                            if (isFuture) {
                              cellClass +=
                                "bg-border/5 border-transparent text-muted-foreground/20 cursor-not-allowed";
                            } else if (totalDue === 0) {
                              cellClass += "border-transparent";
                              cellStyle = {
                                backgroundColor:
                                  "color-mix(in oklab, var(--muted) 20%, transparent)",
                              };
                            } else if (totalCompleted === 0) {
                              cellClass +=
                                "hover:border-foreground/30 border-border/10 cursor-pointer";
                              cellStyle = {
                                backgroundColor:
                                  "color-mix(in oklab, var(--muted) 40%, transparent)",
                              };
                            } else if (ratio < 0.5) {
                              cellClass +=
                                "hover:border-foreground/40 border-transparent cursor-pointer";
                              cellStyle = {
                                backgroundColor:
                                  "color-mix(in oklab, var(--primary) 25%, transparent)",
                                borderColor: "color-mix(in oklab, var(--primary) 40%, transparent)",
                              };
                            } else if (ratio < 1) {
                              cellClass +=
                                "hover:border-foreground/50 border-transparent cursor-pointer";
                              cellStyle = {
                                backgroundColor:
                                  "color-mix(in oklab, var(--primary) 60%, transparent)",
                                borderColor: "color-mix(in oklab, var(--primary) 80%, transparent)",
                              };
                            } else {
                              cellClass +=
                                "hover:scale-105 border-transparent cursor-pointer text-white";
                              cellStyle = {
                                backgroundColor: "var(--primary)",
                                borderColor: "var(--primary)",
                                boxShadow:
                                  "0 2px 8px color-mix(in oklab, var(--primary) 20%, transparent)",
                              };
                            }

                            if (isSelected) {
                              cellClass +=
                                " ring-2 ring-primary ring-offset-2 ring-offset-background z-10";
                            } else if (isToday) {
                              cellClass +=
                                " ring-2 ring-accent/60 ring-offset-1 ring-offset-background";
                            }

                            return (
                              <button
                                key={dayStr}
                                onClick={() => !isFuture && setSelectedCalendarDay(day)}
                                disabled={isFuture}
                                className={`h-7 w-7 flex items-center justify-center text-[10px] font-black ${cellClass}`}
                                style={cellStyle}
                                title={`${format(day, "EEEE, MMMM d, yyyy")}: ${totalCompleted}/${totalDue} completed`}
                              >
                                {format(day, "d")}
                              </button>
                            );
                          }),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground font-semibold">
                    <span>Less</span>
                    <span
                      className="h-3 w-3 rounded bg-white/20 border border-border/10"
                      style={{
                        backgroundColor: "color-mix(in oklab, var(--muted) 40%, transparent)",
                      }}
                    />
                    <span
                      className="h-3 w-3 rounded border border-transparent"
                      style={{
                        backgroundColor: "color-mix(in oklab, var(--primary) 25%, transparent)",
                      }}
                    />
                    <span
                      className="h-3 w-3 rounded border border-transparent"
                      style={{
                        backgroundColor: "color-mix(in oklab, var(--primary) 60%, transparent)",
                      }}
                    />
                    <span
                      className="h-3 w-3 rounded"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                    <span>More</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {/* Analytics: 14 Day Completion Rate */}
              <div className="rounded-[2.5rem] glass p-6">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-foreground">Completion History</h3>
                  <p className="text-xs text-muted-foreground">
                    Due completion rate percentage over the last 14 days.
                  </p>
                </div>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsDataLast14Days}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="date"
                        stroke="var(--muted-foreground)"
                        fontSize={10}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="var(--muted-foreground)"
                        fontSize={10}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "12px",
                          color: "var(--foreground)",
                          fontSize: "11px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Analytics: Completions by Habit */}
              <div className="rounded-[2.5rem] glass p-6">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-foreground">Completions by Habit</h3>
                  <p className="text-xs text-muted-foreground">
                    Total successful tracking counts historically.
                  </p>
                </div>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={habitsWithStats}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="name"
                        stroke="var(--muted-foreground)"
                        fontSize={10}
                        tickLine={false}
                      />
                      <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "12px",
                          color: "var(--foreground)",
                          fontSize: "11px",
                        }}
                      />
                      <Bar dataKey="totalCompletions" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl mx-auto flex flex-col gap-6"
            >
              {/* Header */}
              <div className="rounded-[2rem] glass p-6">
                <h2 className="text-2xl font-black text-foreground">Settings</h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Manage database backups, restore previous history, or modify settings.
                </p>
              </div>

              {/* Theme Selector */}
              <div className="rounded-[2.5rem] glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    Theme Mode
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Switch between Olive & Stone (Light) and Charcoal & Gold (Dark) styling.
                  </p>
                </div>
                <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-foreground/80">Active Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Data Actions */}
              <div className="rounded-[2.5rem] glass p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-base font-bold text-foreground">Data Management</h3>
                  <p className="text-xs text-muted-foreground">
                    Export your custom routines to JSON or restore from an existing file.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export */}
                  <button
                    onClick={exportBackup}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl glass hover:bg-white/20 dark:hover:bg-white/5 border border-transparent hover:border-foreground/10 text-center transition-all group"
                  >
                    <Download className="h-6 w-6 text-primary group-hover:scale-110 transition-transform mb-3" />
                    <span className="text-sm font-bold text-foreground">Export Backup</span>
                    <span className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">
                      Download your habits and history as a backup JSON file.
                    </span>
                  </button>

                  {/* Import */}
                  <label className="flex flex-col items-center justify-center p-6 rounded-2xl glass hover:bg-white/20 dark:hover:bg-white/5 border border-transparent hover:border-foreground/10 text-center transition-all cursor-pointer group">
                    <Upload className="h-6 w-6 text-accent group-hover:scale-110 transition-transform mb-3" />
                    <span className="text-sm font-bold text-foreground">Import Backup</span>
                    <span className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">
                      Upload a previously exported JSON file to restore settings.
                    </span>
                    <input type="file" accept=".json" onChange={importBackup} className="hidden" />
                  </label>
                </div>

                <hr className="border-border/10" />

                {/* Reset Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-red-500/5 dark:bg-red-500/10 p-5 rounded-2xl border border-red-500/10">
                  <div>
                    <h4 className="text-sm font-bold text-red-600 dark:text-red-400">
                      Reset Application Database
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Wipe all custom habits and history, and load default seed templates.
                    </p>
                  </div>
                  <button
                    onClick={resetDatabase}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold transition shadow-sm hover:shadow-red-600/20 hover:scale-102"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Reset Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- FORM DIALOG MODAL (PORTAL OVERLAY) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-[2.5rem] glass-strong border border-border/20 p-6 shadow-2xl z-10"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-black text-foreground">
                  {modalMode === "create" ? "Add New Habit" : "Edit Habit"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="glass hover:bg-white/20 p-1.5 rounded-full transition"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Habit Name */}
                <div>
                  <label
                    htmlFor="habit-name"
                    className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
                  >
                    Habit Name
                  </label>
                  <input
                    id="habit-name"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Drink water, Read books"
                    className="w-full rounded-2xl border border-border/20 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Weekday Schedule Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Schedule Weekdays
                  </label>
                  <div className="flex gap-1.5 justify-between">
                    {WEEKDAY_NAMES.map((w, idx) => {
                      const active = formSchedule.includes(idx);
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => toggleDayInSchedule(idx)}
                          className={`flex-1 rounded-xl py-2 text-center text-xs font-bold tracking-tight border transition-all ${
                            active
                              ? "bg-primary border-primary text-primary-foreground shadow shadow-primary/20 scale-102"
                              : "glass border-border/20 text-foreground hover:bg-white/10"
                          }`}
                        >
                          {w.substring(0, 2)}
                        </button>
                      );
                    })}
                  </div>
                  {formSchedule.length === 0 && (
                    <p className="mt-1.5 text-[10px] text-red-500 font-bold">
                      Please select at least one day of the week.
                    </p>
                  )}
                </div>

                {/* Custom Color Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Theme Color
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_OPTIONS.map((c) => {
                      const isSelected = formColor === c.hex;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setFormColor(c.hex)}
                          className={`h-7 w-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center border ${
                            isSelected ? "border-foreground scale-105" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {isSelected && <Check className="h-4 w-4 text-white stroke-[2.5px]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Icon Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Display Icon
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map((i) => {
                      const isSelected = formIcon === i.name;
                      return (
                        <button
                          key={i.name}
                          type="button"
                          onClick={() => setFormIcon(i.name)}
                          className={`flex flex-col items-center justify-center rounded-xl p-2 border transition-all ${
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground scale-102 shadow shadow-primary/25"
                              : "glass border-border/25 hover:border-foreground/15 text-foreground"
                          }`}
                        >
                          <HabitIcon name={i.name} className="h-5 w-5" />
                          <span className="mt-1 text-[8px] font-bold tracking-tight opacity-75 truncate max-w-full">
                            {i.label.substring(0, 10)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="glass flex-1 py-3 rounded-2xl text-xs font-bold transition hover:bg-white/20 text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSchedule.length === 0}
                    className="btn-primary flex-1 py-3 rounded-2xl text-xs font-bold transition disabled:opacity-40"
                  >
                    {modalMode === "create" ? "Add Habit" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
