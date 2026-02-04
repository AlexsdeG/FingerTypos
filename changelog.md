
# Changelog

## [0.0.22] - Strict Error Counting

### Improvements
- **Gross Accuracy Tracking**: Updated the error detection engine to use strict "Gross Accuracy" logic.
  - Previously, fixing a typo (via auto-correction or alignment fix) would remove the error from the stats.
  - Now, **every mistake counts**. If you type an extra character and the engine auto-aligns it for you, that extra character remains as an error in your session stats.
  - Accuracy is now calculated as `(Total Keystrokes - Total Errors) / Total Keystrokes`.

## [0.0.21] - Smart Error Correction

### Improvements
- **Intelligent Error Correction**:
  - **Retroactive Fix (Lookbehind)**: The engine now detects when you type an extra character that shifts your text alignment (e.g., typing `hellox world`). If the *next* character you type matches the position you *should* have been in, the engine automatically replaces the extra character with the correct one. This prevents the frustrating "cascading error" effect where one extra letter marks the entire subsequent sentence as wrong.
  - **Lookahead Logic**: Retained the logic for detecting missed spaces. If you skip a space but type the next letter correctly, a placeholder space is inserted to keep alignment.

## [0.0.20] - Stats & Game Logic Improvements

### Improvements
- **Stats Dashboard**:
  - **Enhanced Graph Tooltip**: Hovering over the performance graph now displays detailed match information, including Level ID, Mode, Text Length, Errors, and Accuracy alongside WPM.
  - **Recent Activity Log**: Now clearly displays the **Length Mode** (Short/Medium/Long) for training sessions.
- **Game Engine**:
  - **Abort Logic**: Leaving a match prematurely (using the back button or navigation) now correctly aborts the session. Aborted matches are **not** saved to history, and do not award XP or affect stats.

## [0.0.19] - Rendering Fixes

### Fixed
- **Text Display**: Fixed an issue where the Enter symbol (`↵`) did not correctly cause a line break for the subsequent text. Updated the rendering logic to use `inline` display for newline tokens, ensuring the `<br/>` tag affects the layout flow correctly.
- **Firefox Shortcut**: Prevented the browser's "Quick Find" ( `/` key) from interrupting typing sessions.

## [0.0.18] - Engine Logic & Generator Overhaul

### Improvements
- **Text Generation Engine 2.0**:
  - **Context-Aware Elite Mode**: Replaced random character injection with smart replacements (e.g., `for` -> `4`, `you` -> `u`, `to` -> `2`) and meaningful patterns (`$100`, `24/7`, `C++`).
  - **Smart Sentence Generation**: Sentences now always start with a capital letter, include randomized names from a new dictionary, and prevent immediate word repetition.
  - **Length Selection**: Added Short, Medium, and Long toggle buttons to Training Cards, allowing users to customize session duration (Short = 50% length, Long = 200% length).
- **Error Detection Algorithm**:
  - **Smart Space Skipping**: If a user misses a space but types the correct next character (e.g., typing `hellohere` instead of `hello here`), the engine now detects this. It marks the missing space as an error but accepts the correct character, preventing the frustrating cascading error effect where the rest of the word would be marked wrong.

## [0.0.17] - Final Polish & Documentation

### Added
- **Game Controls**: Players can now start the game session by pressing `Spacebar` instead of clicking the "Start" button.
- **Help System**: Added a comprehensive **Help Modal** accessible from the main header. It explains:
  - Finger Guide colors and mechanics.
  - Ghost Replay system.
  - Scoring and XP.
- **Documentation**: Added a full `README.md` with features, installation instructions, and tech stack details.
- **UX Polish**:
  - Added tooltips and detailed descriptions to settings toggles (Finger Guides, Virtual Keyboard, etc.).
  - Added "Press Space to Start" visual cue in the Game Stage.

## [0.0.16] - Phase 6 Step 3 & 4 Implementation

### Added
- **Stats Page**:
  - Implemented a comprehensive `StatsPage.tsx` using Recharts.
  - Features a **WPM Trend Graph** (last 20 games), **Error Heatmap** (top 10 worst keys), and lifetime stats summary.
  - Added "Recent Activity" log detailing past match performance.
  - Visual Profile Summary header with Rank, Level, and XP progress.
- **Auto-Layout Detection**:
  - Created `src/utils/keyboardDetection.ts` to detect QWERTY vs QWERTZ using the `navigator.keyboard` API.
  - Integrated detection into **Profile Creation**: Users can now select or auto-detect their layout when creating a profile.
  - Integrated detection into **Settings**: Added auto-detect button to the Settings Modal.
- **Profile Store**: Updated `createProfile` to accept an initial keyboard layout preference.

## [0.0.15] - Phase 6 Step 3 Implementation

### Added
- **Alternative Training Modes**: Added 3 new procedural training modes to the Training Menu.
  - **Code Syntax**: Generates random JavaScript/React code snippets (indentation, brackets, keywords) to train special character usage.
  - **Numbers**: Generates random groups of digits for pure numpad/number-row practice.
  - **Boss Rush**: A new gamified "Boss Battle" visualization.
- **Boss Battle View**: 
  - Created `BossBattle.tsx`, a specialized view component that replaces the standard text display and keyboard.
  - Visualizes the typing session as a battle against a "Glitch Monster".
  - **Mechanics**: Typing correctly deals damage to the boss HP bar. Errors damage the player's HP. The "Command Stream" displays the active word in a game-like HUD.
- **Dictionaries**: Added `CODE_SNIPPETS` to `dictionaries.ts`.

## [0.0.14] - Phase 6 Step 2 Fix

### Fixed
- **Text Rendering**: Fixed an issue where spaces were invisible in the text display by correctly applying `inline-block` to character spans. This ensures `min-w-[1ch]` is respected for whitespace characters.

## [0.0.13] - Phase 6 Step 2 Implementation

### Improvements
- **Text Display Engine**:
  - **Word Wrapping**: Refactored rendering to use word-based tokens (`inline-block`), ensuring words are never split across lines.
  - **Auto-Scrolling**: The active typing line now automatically scrolls to the top of the view, creating a "Focus Mode" effect.
  - **Visual Clarity**: Untyped "future" text is now darker (Slate-700) to reduce distraction, while the active line remains bright.
  - **Enter Symbol**: Added support for multi-line text. The Enter symbol (`↵`) is now displayed for newline characters.
- **Content Updates**:
  - **Harder Challenges**: "Mixed" and "Sentence" generation modes (Training Elite / Campaign Mastery) now occasionally generate multi-line text containing `\n`.
  - **Engine Logic**: Updated `useTypingEngine` to correctly handle the `Enter` key when a newline is expected.

## [0.0.12] - Phase 6 Step 1 Implementation

### Added
- **Ghost Replay System**: 
  - The game now saves a full timestamped replay of your keystrokes when you achieve a new Personal Best (PB) in any Campaign Level or Training Difficulty.
  - A "Ghost Cursor" (semi-transparent caret) replays your previous best run in real-time, allowing you to race against yourself.
  - Implemented `useGhostCursor` hook to handle timeline synchronization efficiently using `requestAnimationFrame`.
- **Settings Update**: Added a toggle to enable/disable "Ghost Replay" in the settings modal.
- **Visuals**: Updated the game HUD to indicate when a Ghost is active.

## [0.0.11] - Phase 5 Step 3 Implementation

### Added
- **Profile Import/Export**: Users can now backup and restore their profiles (including history and settings) via JSON. Added controls to the Settings modal.
- **Enhanced Text Engine**:
  - Implemented `generationMode` ('chars', 'words', 'mixed', 'sentence').
  - Added rich dictionaries (`dictionaries.ts`) containing common words, complex tech/science words, and motivational sentences.
  - "Mixed" mode now intelligently mutates words to include numbers (leet speak or suffixes) and punctuation for higher difficulties.
- **Content Expansion**:
  - **Campaign**: Added Tier 4 (Real World - Caps & Punctuation) and Tier 5 (Mastery - Full Sentences).
  - **Training**: Updated "Easy", "Medium", "Hard", and "Elite" difficulties to use real words and sentences instead of random character strings.
    - Easy: Common lowercase words.
    - Medium: Mixed case complex words.
    - Hard: Full sentences with punctuation.
    - Elite: Complex words mixed with numbers and symbols (e.g. `P@ssw0rd`).

## [0.0.10] - Phase 5 Step 2 Implementation

### Added
- **Campaign Mode**: Complete structured learning path with Tiers. 
  - Levels unlock sequentially.
  - Higher tiers require specific Rank/Level to unlock.
  - Star rating system (1-3 stars) based on performance.
- **Free Training Mode**: Dedicated section for procedural practice with 4 difficulties (Easy, Medium, Hard, Elite).
- **Dynamic Layout Generation**: Level content is now generated on-the-fly based on the user's active keyboard layout (QWERTY vs QWERTZ). This ensures "Pinky Right" lessons correctly target `ö` on QWERTZ and `;` on QWERTY.
- **Progress Tracking**: Profile now stores campaign stars and training personal bests.

## [0.0.9] - Phase 4 Step 3 Implementation

### Added
- **XP System**: Implemented XP calculation based on speed and accuracy.
- **Match History**: Saves detailed match logs (WPM, Accuracy, Errors, XP) to the local user profile.
- **Leveling**: Implemented dynamic rank titles ("Novice" -> "FingerTypos") based on accumulated XP.
- **Dashboard Updates**: Results screen now displays XP earned and calculates global rank based on effective WPM (penalized by accuracy).
- **Engine Improvements**: 
  - Enhanced keystroke logging to track "expected" characters for better heatmap generation.
  - Fixed issue where backspace wasn't handled correctly in history logs.

## [0.0.8] - Phase 3 Step 3 Implementation

### Added
- **Dynamic Finger Paths**: Implemented visual guide system.
  - `FingerPath.tsx`: Renders an animated SVG arrow from the "Resting Key" to the "Target Key".
  - `homeKeys.ts`: Defined standard home row positions for all 10 fingers.
  - Updated `Key.tsx` to support `forwardRef` for coordinate calculation.
  - Updated `VirtualKeyboard.tsx` to manage key refs and render the overlay.
  - Added support for `showHands` setting from user profile.

## [0.0.7] - Phase 3 Step 2 Implementation

### Added
- **Virtual Keyboard Components**: `Key.tsx`, `VirtualKeyboard.tsx`, `fingerColors.ts`.
- **Game UI Update**: Integrated Keyboard into Game view.

## [0.0.6] - Phase 3 Step 1 Implementation

### Added
- **Keyboard Layouts**: Defined QWERTY/QWERTZ.
- **Type Definitions**: Updated KeyMap.

## [0.0.5] - Phase 2 Step 3 Implementation

### Added
- **Audio System**: Implemented `src/utils/sound.ts`.

## [0.0.4] - Phase 2 Step 2 Implementation

### Added
- **Typing Engine Hook**: Implemented `useTypingEngine.ts`.

## [0.0.3] - Phase 2 Step 1 Implementation

### Added
- **Procedural Text Generator**.

## [0.0.2] - Phase 1 Fixes

### Fixed
- **Module Resolution**.

## [0.0.1] - Phase 1 Foundation Evaluation

### Added
- Initial project setup.
