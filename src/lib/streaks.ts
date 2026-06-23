import { subDays, format, parseISO, isSameDay, differenceInCalendarDays } from "date-fns";

export interface Habit {
  id: string;
  name: string;
  schedule: number[]; // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  color: string; // custom color token or hex
  icon: string; // Lucide icon identifier
  createdAt: string;
  history: { [dateStr: string]: boolean };
}

/**
 * Calculates current and longest streaks for a habit based on its schedule.
 * Streaks only walk through scheduled days. Missed unscheduled days (like weekends
 * on a Mon-Fri habit) do NOT break streaks.
 */
export function calculateStreaks(habit: Habit, todayDateStr: string) {
  const scheduleSet = new Set(habit.schedule);
  const createdDate = parseISO(habit.createdAt.split("T")[0]);
  const endCompareDate = parseISO(todayDateStr);

  const isScheduled = (date: Date) => scheduleSet.has(date.getDay());
  const isCompleted = (dateStr: string) => !!habit.history[dateStr];

  // If there are no scheduled days, streaks are 0
  if (habit.schedule.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // --- 1. CURRENT STREAK ---
  let currentStreak = 0;
  const checkDate = endCompareDate;

  const dateStr = format(checkDate, "yyyy-MM-dd");
  const isTodayScheduled = isScheduled(checkDate);
  const isTodayCompleted = isCompleted(dateStr);

  let walkStart = checkDate;

  if (isTodayScheduled) {
    if (isTodayCompleted) {
      currentStreak = 1;
      walkStart = subDays(checkDate, 1);
    } else {
      // Today is scheduled but not completed yet.
      // The streak remains alive if they completed the previous scheduled day.
      walkStart = subDays(checkDate, 1);
    }
  } else {
    // Today is not scheduled. The streak is determined by past scheduled days.
    walkStart = subDays(checkDate, 1);
  }

  let currentDate = walkStart;

  // Walk back day-by-day (up to 365 days)
  for (let i = 0; i < 365; i++) {
    if (currentDate < createdDate) break;

    const currStr = format(currentDate, "yyyy-MM-dd");
    if (isScheduled(currentDate)) {
      if (isCompleted(currStr)) {
        if (isTodayScheduled && !isTodayCompleted && currentStreak === 0) {
          // If today is scheduled and uncompleted, we found the first scheduled completed day.
          // This means the streak is alive up to this point.
          currentStreak = 1;
        } else {
          currentStreak++;
        }
      } else {
        // Streak breaks at the first missed scheduled day
        break;
      }
    }
    currentDate = subDays(currentDate, 1);
  }

  // --- 2. LONGEST STREAK ---
  let longestStreak = 0;
  let runningStreak = 0;

  // Walk forward from creation date up to todayDateStr
  const iterDate = new Date(createdDate);

  while (iterDate <= endCompareDate) {
    const iterStr = format(iterDate, "yyyy-MM-dd");
    if (isScheduled(iterDate)) {
      if (isCompleted(iterStr)) {
        runningStreak++;
        if (runningStreak > longestStreak) {
          longestStreak = runningStreak;
        }
      } else {
        // If it's today and it's not completed, the running streak is NOT reset
        // until today is officially missed (tomorrow).
        const isToday = isSameDay(iterDate, endCompareDate);
        if (!isToday) {
          runningStreak = 0;
        }
      }
    }
    // Increment day safely
    iterDate.setDate(iterDate.getDate() + 1);
  }

  return { currentStreak, longestStreak };
}

/**
 * Generates realistic seed habits with history for the last 15 days,
 * relative to the current local date.
 */
export function generateSeedHabits(today: Date = new Date()): Habit[] {
  const habits: Habit[] = [
    {
      id: "seed-water",
      name: "Drink 3L Water",
      schedule: [0, 1, 2, 3, 4, 5, 6], // Every day
      color: "#9C6644", // Accent/Walnut
      icon: "GlassWater",
      createdAt: format(subDays(today, 15), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      history: {},
    },
    {
      id: "seed-read",
      name: "Read 20 Minutes",
      schedule: [1, 3, 5], // Mon/Wed/Fri
      color: "#556B2F", // Primary/Olive
      icon: "BookOpen",
      createdAt: format(subDays(today, 15), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      history: {},
    },
    {
      id: "seed-meditate",
      name: "Morning Meditation",
      schedule: [2, 4], // Tue/Thu
      color: "#C9A227", // Gold
      icon: "Brain",
      createdAt: format(subDays(today, 15), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      history: {},
    },
    {
      id: "seed-workout",
      name: "Workout 30 Min",
      schedule: [1, 2, 4, 5], // Mon/Tue/Thu/Fri
      color: "#EF4444", // Crimson Red
      icon: "Dumbbell",
      createdAt: format(subDays(today, 15), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      history: {},
    },
  ];

  // Seed completions for the past 15 days
  for (let i = 15; i >= 0; i--) {
    const checkDate = subDays(today, i);
    const dateStr = format(checkDate, "yyyy-MM-dd");
    const dayOfWeek = checkDate.getDay();

    habits.forEach((habit) => {
      // Only complete if it's scheduled on this weekday
      if (habit.schedule.includes(dayOfWeek)) {
        let isDone = false;

        // Custom realistic patterns:
        if (habit.id === "seed-water") {
          // Missed only day 4 and day 10 ago
          isDone = i !== 4 && i !== 10;
        } else if (habit.id === "seed-read") {
          // Perfect reading streak
          isDone = true;
        } else if (habit.id === "seed-meditate") {
          // Missed 7 days ago
          isDone = i !== 7;
        } else if (habit.id === "seed-workout") {
          // Gym: missed day 2, 8 and 12 ago
          isDone = i !== 2 && i !== 8 && i !== 12;
        }

        if (isDone) {
          habit.history[dateStr] = true;
        }
      }
    });
  }

  return habits;
}

/**
 * Returns a humanized relative text string representing the last completion date.
 * (e.g. "Today", "Yesterday", "3 days ago", "Never")
 */
export function getLastCompletedText(habit: Habit, todayDateStr: string): string {
  const completedDates = Object.keys(habit.history).filter(
    (dateStr) => habit.history[dateStr] === true,
  );

  if (completedDates.length === 0) {
    return "Never";
  }

  // Sort descending to find the latest completed date
  completedDates.sort((a, b) => b.localeCompare(a));
  const lastDateStr = completedDates[0];

  const today = parseISO(todayDateStr);
  const lastDate = parseISO(lastDateStr);

  const diff = differenceInCalendarDays(today, lastDate);

  if (diff <= 0) {
    return "Today";
  } else if (diff === 1) {
    return "Yesterday";
  } else {
    return `${diff} days ago`;
  }
}
