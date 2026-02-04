# FingerTypos - Advanced Touch Typing Tutor

[![Live Demo](https://img.shields.io/badge/Live_Demo-Click_Here-blue?style=for-the-badge)](https://fingertypos.pro-grammer.de/)

![App Screenshot](https://github.com/AlexsdeG/FingerTypos/blob/main/FingerTypos.jpg)

FingerTypos is a modular, privacy-first web application designed to help users master touch typing through adaptive learning, gamification, and advanced visualization techniques.

Built with **React**, **TypeScript**, and **Zustand**.

## 🚀 Features **([Demo](https://fingertypos.pro-grammer.de/))**

### 🧠 Adaptive Learning Engine
*   **Procedural Generation:** Lessons are generated on-the-fly based on your skill level.
*   **Intelligent Heatmap:** The engine tracks your error rate for every key and generates future lessons that specifically target your weak points.
*   **Dynamic Difficulty:** Ranging from basic characters to complex sentences and code snippets.

### 🎮 Gamified Experience
*   **Campaign Mode:** A structured Tier system (1-5) taking you from "Home Row" basics to "Mastery".
*   **Boss Battles:** Fight the "Glitch Monster" by typing quickly to deal damage.
*   **Ghost Replay:** Race against your previous Personal Best with a real-time ghost cursor.
*   **XP & Ranks:** Earn experience, level up, and unlock titles from *Novice* to *FingerTypos*.

### 👁️ Visual Guidance
*   **Finger Paths:** Animated lines draw connections from the home row to the target key, teaching the correct finger movement.
*   **Virtual Keyboard:** Real-time highlighting of key presses and target keys.
*   **Hands-Free Mode:** Toggle visuals on/off to test your muscle memory.

### 📊 Analytics & Privacy
*   **Local-First:** All data is stored in your browser's `localStorage`. No accounts, no tracking.
*   **Data Portability:** Export/Import your profile as a JSON file to transfer progress between devices.
*   **Detailed Stats:** WPM Trends, Accuracy Graphs, and Error Heatmaps.

### 🛠️ Customization
*   **Layouts:** Support for **QWERTY** and **QWERTZ** with auto-detection.
*   **Training Modes:**
    *   **Classic:** Standard text.
    *   **Code:** JavaScript/React syntax practice.
    *   **Numbers:** Numpad/Digit practice.

## 📦 Tech Stack

*   **Frontend Framework:** [React 18](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with Persist middleware)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Charts:** [Recharts](https://recharts.org/)
*   **Audio:** [Howler.js](https://howlerjs.com/)

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js (v16+)
*   pnpm (recommended) or npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/FingerTypos.git
    cd FingerTypos
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Start the development server:
    ```bash
    pnpm dev
    ```

4.  Open `http://localhost:5173` in your browser.

## 📖 How to Play

1.  **Create a Profile:** Enter your name and select your keyboard layout.
2.  **Select a Mode:**
    *   **Campaign:** Follow the structured path to learn touch typing from scratch.
    *   **Training:** Practice specific skills (Code, Numbers) or difficulty levels.
3.  **Type:**
    *   Place your fingers on the Home Row (F and J have bumps).
    *   Follow the **Finger Guides** (colored lines) to hit the keys.
    *   Do not look at your physical keyboard!
4.  **Review:** Check your stats after every session and watch your WPM grow.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License.
