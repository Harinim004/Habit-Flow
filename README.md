# HabitFlow — Build Better Habits, Live a Better Life

HabitFlow is a beautiful, premium habit tracking application built with React, Vite, and TailwindCSS. It features a stunning landing page showcasing a fully interactive and annotated mock dashboard walkthrough, and a functional habit tracking dashboard.

---

## 🚀 How to Run the Project Locally

Follow these steps to set up and launch the development environment:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) installed.

### Setup Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Harinim004/Habit-Flow.git
   cd habitflow-journey-main
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the local server URL (default: `http://localhost:8080/`).

4. **Build for Production**:
   To generate a minified, production-ready bundle:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🛠️ Key Decisions & Architecture

### 1. Structure
The project is built on the **Vite + React** framework with a routing setup using **TanStack Router**:
- `src/components/`: Modular widgets separated into visual layout components (`src/components/landing/`) and base UI components (`src/components/ui/` from shadcn/ui).
- `src/routes/`: Declarative pages mapping to client routes:
  - `index.tsx`: The landing page containing the Hero sections, Testimonial cards, and Interactive Showcase.
  - `app.tsx`: The fully functional dashboard application.
- `src/lib/`: Reusable TypeScript functions (e.g., helper functions for calculating streaks and generating dummy habits).

### 2. Styling & Aesthetics
- **TailwindCSS (v4)**: Used to build glassmorphism layouts (`glass`, `glass-strong`), backdrop blur filters, smooth color gradients, and micro-animations.
- **Dynamic Elements**: Smooth animations using `framer-motion` for transitions, and custom CSS timers for automatic card rotations.

### 3. Data Model
Habit data structures are defined in [streaks.ts](file:///d:/Habit%20Flow/home/habitflow-journey-main/src/lib/streaks.ts):
```typescript
export interface Habit {
  id: string;
  name: string;
  schedule: number[];        // Array of active weekdays (0 = Sunday, 1 = Monday, etc.)
  color: string;             // Active theme highlight hex color
  icon: string;              // Icon identifier
  createdAt: string;         // ISO timestamp string
  history: Record<string, boolean>; // Habit completion log. Key: "yyyy-MM-dd", Value: true
}
```
*Why this design?* Representing the completion logs using a `Record<string, boolean>` lookup table allows O(1) performance for marking, toggling, and checking completion status on any date without iterating over arrays.

---

## 🧠 Hardest Problem & Solution

### The Challenge
On the landing page showcase section, we needed to overlay interactive hotspot triggers and SVG connection arrows on top of a static screenshot of the `/app` page. The layout had to meet the following requirements:
1. The arrows had to point precisely to the correct widgets in the screenshot (Checklist, Date selector, Progress bar, and Stats).
2. Hovering/clicking cards on the side had to light up the corresponding hotspot and overlay on the screenshot.
3. The layout, SVG paths, and hotspots had to align perfectly on screens of all sizes, maintaining responsiveness despite screen stretching.

### The Solution
We implemented a responsive viewBox system for the SVG overlay:
- Rendered the SVG using `viewBox="0 0 1000 600"` and `preserveAspectRatio="none"`.
- Centered the mockup container (`col-span-6`) and limited its width using `max-w-md` (448px) inside the 1000px viewBox coordinate space.
- Calculated the exact coordinate positions of the widgets inside the screenshot by analyzing pixel boundaries.
- Set relative percentage bounds (e.g. `top: "37.5%", left: "13.5%", width: "25.5%", height: "14%"`) for the overlays in [dashboard-mockup.tsx](file:///d:/Habit%20Flow/home/habitflow-journey-main/src/components/landing/dashboard-mockup.tsx), placing hotspots on the corresponding coordinate centers.
- Mapped the SVG lines using bezier paths (e.g. `d="M 750,150 Q 570,180 392,267"`) starting at fixed cards positions on the outer boundaries and ending at calculated inner mockup centers.

---

## 🤖 AI Integration & Collaboration Notes

We paired with the AI coding agent to refine the landing page layouts and clean the repository structure.

### What We Changed / Fixed in AI Output:
- **Hotspot Correction**: The AI initially placed a "Streak Multiplier" overlay pointing to the top-right header navbar of the dashboard screenshot. However, there was no streak badge in the actual header of the `/app` view. We rejected this mapping and redirected the overlay/arrow to the **Today's Progress** circular widget at the top-left of the screenshot.
- **Responsive Adaptations**: The AI's initial layout used absolute viewport units that broke on narrow screen aspect ratios. We refined this to relative parent percentages and centered flexbox containers.
- **De-branding**: We cleaned up and rejected generic boilerplate text ("Lovable App", default descriptors) and removed the AI-specific sync packages (`.lovable/project.json`, `AGENTS.md`) and error catcher logs (`lovable-error-reporting.ts`) to deliver a fully independent repository.

---

## ⏳ Known Limitations & Future Roadmap

### Known Limitations
- **Responsive Layout Stacking**: Because the desktop layout has 3 side-by-side columns (Labels ➔ Mockup ➔ Labels), the SVG pointer curves connect them horizontally. On tablet and mobile viewports, the grid stacks vertically, making horizontal arrows visually disjointed. The design handles this by hiding the SVG overlay on mobile (`lg:hidden`) and relying on active borders directly on the card outlines.
- **Local Storage Reliance**: The habit database is currently saved in local storage. Cleared browsing data will reset habits and history.

### Future Roadmap
- **Database Synchronization**: Integrate a backend database (e.g., Supabase or SQLite) to sync habit logs persistently across multiple devices.
- **Dynamic SVG Drawing**: Implement a window listener hook that dynamically re-calculates the SVG curve endpoints based on live client bounding rectangles (`getBoundingClientRect`) instead of statically mapped coordinate assumptions.

---

## ⭐ Stretch Goals Attempted
- **Snappier Instant Loads**: Removed entry delay sequences on all Hero text headers and button nodes, ensuring the application landing page feels responsive and loads instantly.
- **Clean Repository State**: Cleaned up bun config locks, Prettier configurations, and temporary files, ensuring a lean and standardized package structure.
