# Product Requirements Document (PRD): Jesse Itzler Life Resume Planner

## 1. Project Overview
**Product Name:** Itzler Planner (Life Resume)
**Vision:** A high-performance planning application inspired by Jesse Itzler’s philosophies (Living Uncommon, Kevin’s Rule, The Misogi). The app shifts the focus from "Work-First" to "Life-First" planning, helping users build a "Life Resume" they are proud of.

## 2. Core Philosophies (The Itzler Way)
*   **The Misogi (The Anchor):** One event every year that has a 50% chance of failure and makes you feel alive.
*   **Kevin’s Rule:** One unique, out-of-the-norm experience every 8 weeks (6 per year).
*   **The Big 4:** Daily/weekly focus on Health, Wealth, Relationships, and Self.
*   **Life-First Calendar:** Scheduling non-negotiable life events (vacations, family rituals) *before* work.
*   **No Negotiation:** Once it’s on the calendar, the debate is over.

---

## 3. Feature Breakdown (Current MVP)

### 3.1. Start Here (The Manifesto)
*   **Purpose:** Introduce the user to the "Living Uncommon" philosophy and provide a roadmap for the app.
*   **Features:**
    *   Premium "Mission Briefing" hero section.
    *   Breakdown of core philosophies (Misogi, Kevin's Rule, Big 4).
    *   Phased roadmap to guide users through the planning process.

### 3.2. Year Prep (The Pre-Game)
*   **Purpose:** Set the foundation before the year begins.
*   **Features:**
    *   Interactive checklist of 9 "Itzler-style" prep tasks (e.g., Life Resume Audit, Friction Purge).
    *   Persistence of completion status.

### 3.3. Dynamic Dashboard (The Control Center)
*   **Purpose:** Real-time visibility into the year's progress and core standards.
*   **Features:**
    *   **Progress Metrics:** Visual "Year Progress" bar and "Weekly Win Rate" score.
    *   **The Anchor (Misogi):** A prominent card showing the main goal for the year.
        *   Editable title, description, and status (Planned, In-Progress, Completed).
        *   **AI Suggestion:** Integrated Gemini AI to brainstorm Misogi ideas based on user interests.
    *   **8-Week Clock:** Summary view of the 6 Kevin's Rule slots.
    *   **The Big 4 Standards:** Management of standards across the 4 pillars (Health, Wealth, Relationship, Self).
        *   Add/Remove specific standards for each category.

### 3.4. The Big Annual Calendar (BAC)
*   **Purpose:** A full-year visualization to own your territory.
*   **Features:**
    *   **12-Month Grid:** Modern, premium layout with Mon-Sun alignment and week numbers.
    *   **Sharpie Effect:** Automatic "crossing out" of past days and today’s date to create urgency.
    *   **Interactive Edit Mode:**
        *   Ability to paint dates as **Foundation** (Non-negotiables), **Misogi**, or **Kevin's Rule** events.
        *   **Event Editor:** Detailed planning for the 6 Kevin's Rule slots.
        *   **AI Planner:** AI suggestions for unique experiences to fill "Kevin's Rule" slots.
    *   **Countdown Timer:** Real-time countdown to the next scheduled Kevin's Rule adventure.

### 3.5. Weekly Wins
*   **Purpose:** Granular tracking of daily/weekly standards.
*   **Features:**
    *   Checklist of the "Big 4" standards for the current week.
    *   Reflection section and scoring system (0-100%).
    *   Historical tracking of wins.

### 3.6. AI Integration (The Coach)
*   **Core Logic:** Powered by Google Gemini.
*   **Capabilities:**
    *   Suggesting Misogis based on interests and theme.
    *   Brainstorming unique 8-week experiences (Kevin's Rule).
    *   Refining goals and standards.

---

## 4. Technical Stack
*   **Frontend:** React (Vite), TypeScript.
*   **Styling:** Tailwind CSS (Custom "Black & Red" premium aesthetic).
*   **Animations:** Framer Motion (for smooth transitions and the "Sharpie" effect).
*   **AI:** Google Generative AI (Gemini 1.5 Flash).
*   **State Management:** React `useState` / `useEffect` with `localStorage` persistence.
*   **Deployment:** Vercel (Optimized for performance).

---

## 5. Upcoming Roadmap (Planning)
*   [ ] **Habit Streaks:** Visual representation of Big 4 consistency.
*   [ ] **Export Functionality:** Export the BAC to PDF or Apple/Google Calendar.
*   [ ] **Social Accountability:** Shared buckets or leaderboards for "Living Uncommon".
*   [ ] **Voice Input for AI Coach:** Dictate wins and reflections.
*   [ ] **Mobile Optimization:** Native-feel PWA for on-the-go tracking.
