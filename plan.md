# Implementation Plan: FingerTypos

This plan outlines the step-by-step construction of "FingerTypos," a modular, privacy-first, advanced typing tutor web application.

**Core Stack:** Vite, React, TypeScript, Tailwind CSS, Zustand, Framer Motion.
**Package Manager:** pnpm.

---

## 📂 Proposed File Structure

```text
root/
├── public/
│   ├── sounds/               # Click, error, level-up sounds
│   └── icons/
├── src/
│   ├── assets/
│   ├── components/           # Shared UI components (Buttons, Cards, Modals)
│   │   ├── ui/
│   │   └── layout/
│   ├── features/             # Domain-specific modules
│   │   ├── engine/           # Core typing logic & hooks
│   │   │   ├── hooks/        # useTypingEngine.ts
│   │   │   ├── generators/   # textGenerator.ts (Procedural logic)
│   │   │   └── utils/        # scoring.ts
│   │   ├── keyboard/         # Virtual keyboard & Finger paths
│   │   │   ├── layouts/      # qwertz.ts, qwerty.ts
│   │   │   └── components/   # VirtualKeyboard.tsx, Key.tsx, FingerPath.tsx
│   │   ├── profile/          # User data, XP, Ranks
│   │   │   └── store/        # profileStore.ts (Zustand + Persistence)
│   │   └── analytics/        # Charts & History
│   │       └── components/   # ResultsGraph.tsx
│   ├── types/                # Global TS interfaces
│   │   ├── index.ts          # UserProfile, GameConfig, KeyMapping
│   ├── utils/                # General helpers (sounds, formatting)
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Phase 1: Foundation & Infrastructure

**Goal:** Set up the build environment, state management, and basic routing.

*   **Step 1.1: Initialization**
    *   Initialize Vite project with React + TypeScript (`pnpm create vite@latest`).
    *   Install dependencies: `zustand`, `clsx`, `tailwind-merge`, `framer-motion`, `lucide-react`, `recharts`, `@faker-js/faker`, `react-router-dom`, `idb-keyval`, `howler` (for audio).
    *   Configure Tailwind CSS and add a custom color palette (modern, focus-friendly).

*   **Step 1.2: Type Definitions**
    *   Create `src/types/index.ts`.
    *   Define `UserProfile` (id, xp, rank, stats).
    *   Define `KeyMap` interfaces (linking physical `code` to `char` and `finger`).
    *   Define `LevelConfig` (rules for procedural generation).

*   **Step 1.3: Global State Setup (Zustand)**
    *   Create `src/features/profile/store/profileStore.ts`.
    *   Implement `persist` middleware to save to `localStorage`.
    *   Add actions: `createProfile`, `updateSettings`, `addXP`.
    *   **Crucial:** Create a generic `GameStore` (transient state) for current text, cursor position, and WPM (this does not need persistence).

*   **Step 1.4: Layout Shell**
    *   Create a clean Main Layout component with a Header (Profile summary) and a Main Content area.
    *   Set up basic routing: `/` (Home/Profile Select), `/play` (The Game), `/results` (Analytics).

---

## 🧠 Phase 2: The "Modular" Core Engine

**Goal:** Build the invisible logic that handles typing, strictly separated from UI.

*   **Step 2.1: Procedural Text Generator**
    *   Create `src/features/engine/generators/textGenerator.ts`.
    *   Implement function `generateLesson(config: LevelConfig, userStats: UserStats): string`.
    *   **Logic:**
        *   Accept specific letters (e.g., "Home Row only").
        *   Check `userStats.errorHeatmap`. If 'R' has high errors, increase weight of 'R' in the generation pool.
        *   Use `faker` to fetch words containing target letters, or generate random character strings for lower levels.

*   **Step 2.2: The Typing Hook (`useTypingEngine`)**
    *   Create `src/features/engine/hooks/useTypingEngine.ts`.
    *   **Input:** Attach `window.addEventListener('keydown')`.
    *   **Logic:**
        *   Compare `event.key` vs `targetText[cursorIndex]`.
        *   Handle `Backspace` (optional, depends on difficulty).
        *   Handle `Enter` (for new lines).
        *   Update `cursorIndex`, `errorCount`, `keystrokeHistory` (timestamped for Ghost replay).
    *   **Output:** Return `currChar`, `nextChar`, `cursorIndex`, `wpm`, `accuracy`, `isFinished`.

*   **Step 2.3: Audio System**
    *   Create `src/utils/sound.ts`.
    *   Load small assets for "Click" (mechanical switch sound) and "Error" (thud/buzz).
    *   Trigger these within `useTypingEngine`.

---

## ⌨️ Phase 3: The Visual Interface (Virtual Keyboard)

**Goal:** Create the dynamic keyboard that teaches finger positioning (as per reference image).

*   **Step 3.1: Keyboard Layout Data**
    *   Create `src/features/keyboard/layouts/`.
    *   Define QWERTZ and QWERTY arrays.
    *   Structure: `[{ code: 'KeyA', char: 'a', finger: 'pinky-left', row: 2, col: 1 }, ...]`.

*   **Step 3.2: Key Component**
    *   Create `Key.tsx`.
    *   Props: `char`, `isPressed`, `isActiveTarget`, `fingerColor`.
    *   Styling:
        *   `isActiveTarget`: Highlight background with finger color (e.g., pink for 'A').
        *   `isPressed`: CSS transform (scale down) to mimic press.

*   **Step 3.3: Dynamic Finger Paths (The Arrow)**
    *   **Complex Task:** Create `FingerPath.tsx`.
    *   **Implementation:**
        *   Use a React `ref` map to store DOM elements of every key.
        *   Calculate center `(x, y)` of the "Resting Key" (e.g., 'F' for index) and "Target Key" (e.g., 'T').
        *   Draw an SVG line with an arrowhead between these points.
        *   Use `Framer Motion` to animate the line appearing/moving when the target changes.

---

## 🎮 Phase 4: Game Loop & UI Integration

**Goal:** Connect the Engine (Phase 2) with the Visuals (Phase 3).

*   **Step 4.1: Text Rendering (The "Tape")**
    *   Create `TextDisplay.tsx`.
    *   Render the generated string into `<span>` characters.
    *   Styling:
        *   Correct chars: Green/Gray.
        *   Wrong chars: Red background.
        *   Current char: Blinking block cursor.
    *   **Auto-Scroll:** Ensure the active line stays vertically centered.

*   **Step 4.2: The Main Game Stage**
    *   Combine `TextDisplay` (top), `VirtualKeyboard` (bottom), and `StatsHUD` (WPM/Errors).
    *   Connect `useTypingEngine` state to these components.
    *   **Visual Logic:**
        *   Pass `nextChar` to the Keyboard to highlight the key.
        *   Pass `nextChar`'s finger mapping to `FingerPath` to draw the arrow.

*   **Step 4.3: Post-Game Results**
    *   Create `src/features/analytics/components/ResultsDashboard.tsx`.
    *   Calculate final stats.
    *   Update `UserProfile` (Add XP, update Heatmap).
    *   Show a Recharts Graph: "Speed over time" (X=Time, Y=WPM). History

---

## 🏆 Phase 5: Gamification & Profile System

**Goal:** Make it addictive and track progress.

*   **Step 5.1: XP & Ranks**
    *   Implement leveling logic: `xpNeeded = level * 100 * 1.5`.
    *   Create rank titles: "Novice" -> "Apprentice" -> ... -> "FingerTypos".
    *   Show a progress bar on the Home screen.

*   **Step 5.2: Campaign Mode**
    *   Create `src/config/campaign.ts`.
    *   Define levels:
        *   Level 1: `allowedChars: ['f', 'j']`.
        *   Level 2: `allowedChars: ['f', 'j', 'd', 'k']`.
    *   Lock levels based on User Level/Rank.

*   **Step 5.3: Data Management**
    *   Implement "Export Profile" (Download JSON).
    *   Implement "Import Profile" (Parse JSON + Validate -> Load to LocalStorage).

---

## 🌟 Phase 6: Polish & Advanced Features

**Goal:** Add the "Advanced" features requested.

*   **Step 6.1: Ghost Replay**
    *   During game: Save `[timestamp, key]` array.
    *   End of game: If it's a High Score, save this array to the profile.
    *   Next run: Replay this array as a "Ghost Cursor" (faded caret) to race against.

*   **Step 6.2: Alternative Modes**
    *   **Code Mode:** Generator uses a dictionary of Java/JS keywords and symbols (`{ } ;`).
    *   **Boss Fight:** Create a new View Component `BossBattle.tsx` that replaces `VirtualKeyboard`.
        *   *Idea:* Monsters descend. Typing words kills them. (Reuses `useTypingEngine`, just listens to events differently).

*   **Step 6.3: Auto-Layout Detection**
    *   Use `navigator.keyboard.getLayoutMap()` (if available) in Settings to suggest the correct layout.

*   **Step 6.4: Create and design the Stats page**
    *   Create a full nice stats page that uses info from safed last games to display, improvement over time, stats, how often played, what palyed, nice modern design

*   **Step 6.5: Final Design Sweep**
    *   Ensure accessibility (Contrast).
    *   Add tooltips explaining the "Finger Path" logic (as seen in the reference text).
