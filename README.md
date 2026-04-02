# 💎 PRISM | Cyberpunk Casino Platform

![PRISM Logo](https://img.shields.io/badge/PRISM-Casino-cyan?style=for-the-badge&logo=probot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=for-the-badge&logo=framer&logoColor=white)

> **Experience the ultimate high-fidelity, cyberpunk-themed gaming ecosystem. Strategy meets aesthetic.**

PRISM is a state-of-the-art interactive gaming platform featuring strategy games, real-time balance management, and a seamless, integrated music experience designed to keep you in the flow.

---

## 🕹️ The Games

### 💎 Mines
The ultimate test of nerves and strategy.
- **5×5 High-Voltage Grid**: Uncover deep-sea gems while avoiding volatile mines.
- **Scaling Multipliers**: Every successful pick increases your potential payout exponentially.
- **Difficulty Presets**: Switch between Easy, Medium, Hard, and Extreme modes instantly.
- **Smart Odds**: Real-time multiplier calculation for maximal transparency.

### 🗼 Tower
Ascend to the summit for legendary rewards.
- **Multi-Level Ascent**: Each floor increases the difficulty but doubles the stakes.
- **Risk Control**: Choose how many mines are hidden on each floor.
- **Cinematic Transitions**: High-performance animations for every floor reached.

---

## 🎵 Integrated Multi-Media

PRISM features a built-in **YouTube Music Player** directly in the dashboard.
- **Remote Streaming**: Search and stream any track from the world's largest music library.
- **Background Playback**: Keep the beats dropping while you're clearing the grid.
- **Zero-Latency Search**: Powered by server-side YouTube Data API integration.
- **Cyber-Audio Control**: Floating translucent UI with minimalist playback controls.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Glassmorphism
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for ultra-smooth UI interactions
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with Persistent Middleware
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: YouTube Data API v3 for high-speed music retrieval

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- A YouTube Data API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anshtripathi6969/PRISM.git
   cd PRISM
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_key_here
   ```

4. **Run in Development:**
   ```bash
   npm run dev
   ```

---

## 🌌 Core Features

- **Automatic Persistence**: Your balance, history, and settings are saved automatically to `localStorage` – play across sessions seamlessly.
- **Dynamic Theming**: Dark-mode optimized with a high-contrast cyan-fuchsia cyberpunk palette.
- **Responsive Architecture**: Fully responsive layout designed for both high-end desktop setups and mobile play.
- **Deterministic Randomness**: Fair-play algorithms for mine placements and tower floors.

---

## 📜 License
This project is for educational and portfolio demonstration purposes. All rights reserved by the PRISM development team.

---

*Built with passion and neon light. PRISM – Play the Future.*
