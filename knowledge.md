## 1. Project Overview: "FingerTypos"

**Concept:** A highly modular, secure, and fast web application designed to teach touch typing (10-finger system) through adaptive learning and gamification.
**Core Philosophy:** "Privacy First (Local Only), Procedural Generation, and Modular Design."

### Key Features
*   **Engine-UI Separation:** The typing logic is separate from the visual representation, allowing you to swap the "Virtual Keyboard" for a "Space Shooter" game later easily.
*   **Adaptive Intelligence:** Mimics "Tipp10" logic—if you miss 'R' often, the procedural generator creates more words containing 'R'.
*   **Visual Cues:** Dynamic SVG paths showing *which* finger moves to *which* key (as seen in your reference image).
*   **Data Portability:** Full JSON import/export of profiles and history.

---

## 2. Technology Stack & Packages

We will use **pnpm** for package management, **Vite** for the build tool, and **React** for the UI.

### Core Framework
*   **Vite + React + TypeScript:** For a lightning-fast build and strict type safety (crucial for mapping keyboard codes).
*   **Tailwind CSS:** For rapid, modern styling.

### State & Storage
*   **Zustand:** A lightweight state manager.
    *   *Why?* It has built-in `persist` middleware to automatically save state to `localStorage`. It is much simpler than Redux for this scope.
*   **idb-keyval** (Optional but recommended): A promise-based wrapper for IndexedDB if `localStorage` (5MB limit) becomes too small for long-term history data.

### Logic & Utilities
*   **Framer Motion:** For smooth animations (the finger path arrow, key press animations, level-up effects).
*   **Recharts:** For the analytics dashboard (WPM graphs, accuracy heatmaps).
*   **faker.js (or @faker-js/faker):** To generate random words for the procedural text engine.
*   **clsx / tailwind-merge:** For conditional class merging (coloring keys red/green).

---

## 3. Data Architecture (The "Local" Backend)

Since there is no backend, the Data Schema in TypeScript is critical.

### Profile Structure
```typescript
interface UserProfile {
  id: string;
  name: string;
  xp: number;
  rank: string; // e.g., "Novice", "Scribe", "Cyber-Typist"
  settings: {
    keyboardLayout: 'qwertz' | 'qwerty' | 'dvorak' | 'colemak';
    showVirtualKeyboard: boolean;
    showHands: boolean;
    difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  };
  stats: {
    charsTyped: number;
    errorHeatmap: Record<string, number>; // e.g., { "a": 0.1, "z": 5.0 } - higher number = more errors
  };
}
```

### Procedural Generation Config
Instead of static text files, we use **Rulesets**:
```typescript
interface LevelConfig {
  allowedChars: string[]; // e.g., Level 1 is just ['f', 'j', 'd', 'k']
  minWordLength: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
  adaptiveWeight: number; // 0 to 1 (how much to favor weak keys)
}
```

---

## 4. Implementation Details & Logic

### A. The "Modular" Core Engine (Hooks)
Create a custom hook `useTypingEngine`. This is your "Controller".

1.  **Input Handling:** Do *not* use a standard `<textarea>`. Use `window.addEventListener('keydown')`. This captures the `event.code` (Physical Key, e.g., `KeyQ`) and `event.key` (Character, e.g., `@`).
2.  **Comparison Logic:** Compare input against the `targetString`.
    *   *Match:* Advance cursor, play "click" sound, update WPM.
    *   *Miss:* Record error in `errorHeatmap`, play "thud" sound, highlight red.

### B. The Virtual Keyboard & Visual Guidelines
This is the most complex part of your reference image.

1.  **Grid Layout:** Use CSS Grid to draw the keyboard.
2.  **Key Component:** Each key is a React component.
    ```tsx
    <Key 
       char="f" 
       finger="index-left" 
       isActive={currentTarget === 'f'} 
       isPressed={pressedKeys.includes('KeyF')} 
    />
    ```
3.  **The "Finger Path" (The Arrow):**
    *   **Concept:** To draw a line from the resting position (e.g., 'F') to the target key (e.g., 'T'), you need the X/Y coordinates of both keys.
    *   **Implementation:** Use a React `ref` on every Key component. When the `targetChar` changes, calculate the center position of the *Resting Key* and the *Target Key*.
    *   **SVG Overlay:** Render an absolute positioned SVG on top of the keyboard. Draw a `<line>` or `<path>` with an arrowhead marker between those two coordinates. Animate it using `Framer Motion`.

### C. The Adaptive Text Generator (The "Tipp10" Logic)
When generating a lesson:
1.  Look at the `errorHeatmap` in the profile.
2.  Create a "weighted bucket" of characters.
    *   If 'P' has a high error rate, put 'P' into the bucket 10 times.
    *   If 'A' has a low error rate, put 'A' into the bucket 1 time.
3.  Pull characters/words from this weighted bucket to construct the sentence. This ensures the user practices what they are bad at.

---

## 5. UI/UX Flow

### 1. Start Page
*   **Profile Selector:** Cards showing User Name, Rank Icon, and Total XP.
*   **Mode Selection:**
    *   *Campaign (Learning Path):* "Level 1: Home Row", "Level 2: Index Fingers", etc. (Unlocks based on XP).
    *   *Arcade (Free Play):* Select difficulty, duration, or "Endless".
    *   *Settings:* Layout selection (Auto-detect button using `navigator.keyboard.getLayoutMap()` API where supported).

### 2. The Game Interface (The Reference Image)
*   **Top Bar:** Progress bar (Level progress), WPM counter, Error counter.
*   **Text Area:**
    *   Use a "Tape" style or "Page" style.
    *   *CSS Tip:* Use `white-space: pre-wrap;` to handle spaces correctly.
    *   *Rendering:* Map the text string to `<span>` elements. `span.correct` (green), `span.wrong` (red), `span.current` (cursor block).
    *   **New Line Logic:** When the user hits `<Enter>` (represented by `↵` symbol in text), scroll the view up.
*   **Keyboard Area:**
    *   The keyboard layout updates dynamically based on the Profile setting (QWERTZ vs QWERTY).
    *   Color coding: Index fingers (Red/Cyan), Middle (Green), etc.

### 3. Post-Round Analytics
*   **Calculation:**
    *   `WPM = (Characters / 5) / Minutes`
    *   `Accuracy = (Total - Errors) / Total * 100`
*   **Graph:** Use `Recharts` to show speed over the duration of the lesson (did they get tired at the end?).
*   **Percentile:** Since we don't have a backend, hardcode a "Global Average" distribution curve (Bell curve) to tell the user "You are in the top 10%!" based on statistical averages.

---

## 6. Extra Ideas for "Advanced" Features

1.  **Rhythm Mode:** Background music plays. The user must type to the beat of the song (detect BPM, pulse the cursor).
2.  **"Boss Fight" (Visual Module):** instead of the keyboard, switch the "View Component". A monster appears. Words fly at the player. Typing the word damages the monster.
3.  **Code Mode:** Specific lessons for programmers generating `function()`, `{}`, `[]`, `;` heavily.
4.  **Ghost Replay:** Save the timestamp of every keystroke in a run. In the future, the user can race against their own "Ghost" (visualized as a second caret moving on the text). - only save one copy in each rank, the last best run you had, if got worse dont save. so you can chase your pb
5.  **Multi-Layout Training:** A specific mode for users trying to learn Dvorak or Colemak while coming from QWERTY.
