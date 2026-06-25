import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — HabitFlow",
  description: "Track your habits, build streaks, and monitor progress beautifully.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
