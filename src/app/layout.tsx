import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HabitFlow — Build better habits. Live a better life.",
  description: "Beautiful habit tracking platform to stay consistent and achieve your goals.",
  authors: [{ name: "HabitFlow" }],
  openGraph: {
    title: "HabitFlow",
    description: "Beautiful habit tracking platform to stay consistent and achieve your goals.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@habitflow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
