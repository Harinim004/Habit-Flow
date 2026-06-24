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

One of the biggest challenges I faced during this project was not a single feature, but rather learning and applying Next.js effectively while building a complete application from scratch.

As someone relatively new to Next.js and modern frontend development, I had to learn several concepts simultaneously, including project structure, routing, component organization, state management, localStorage persistence, responsive design, and UI composition. Initially, understanding how different parts of the application should communicate with each other while keeping the code maintainable was challenging.

Another challenge was designing a habit-tracking system that could support different schedules while remaining flexible enough for future enhancements. I needed a data structure that could store habit information, schedules, completion history, and streak-related data in a way that was easy to manage and persist locally.

To solve these challenges, I approached development incrementally. Rather than building everything at once, I first focused on creating a working foundation and then gradually added features and refinements. I spent time studying documentation, experimenting with smaller components, and continuously refactoring the code as my understanding improved.

Throughout the project, I learned how to break complex features into reusable components, manage application state more effectively, and create a cleaner project structure. I also gained practical experience in building responsive user interfaces and persisting data using localStorage.

This project became both a development challenge and a learning experience, significantly improving my understanding of Next.js, modern frontend workflows, and real-world application development.



## 🤖 AI Integration & Collaboration Notes

AI was used extensively throughout the development process as both a learning resource and a development assistant.

Since I am still building my expertise with Next.js and modern frontend technologies, AI helped me understand unfamiliar concepts, explore implementation approaches, and accelerate development. It was particularly useful for generating initial code structures, explaining framework-specific concepts, suggesting UI ideas, debugging issues, and providing alternative solutions when I encountered roadblocks.

However, the project was not created through direct copy-and-paste development. The overall product vision, feature selection, application flow, layout planning, visual direction, and user experience decisions were driven by my own ideas and understanding of the project requirements.

AI-generated outputs frequently required modifications before they could be integrated into the project. I reviewed the generated code, adjusted logic, simplified overly complex implementations, fixed bugs, improved responsiveness, and adapted components to match the design and behavior I wanted to achieve. In many cases, AI provided a starting point, while the final implementation involved significant customization and refinement.

I also used AI as a learning tool to better understand concepts that were new to me. Rather than treating AI as a replacement for development, I used it as a collaborative assistant that helped me learn, experiment, and improve my implementation decisions.

Overall, AI played an important supporting role in the project, while the planning, decision-making, customization, testing, and final integration remained my responsibility.

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
