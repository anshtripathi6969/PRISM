"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const darkMode = useGameStore((s) => s.darkMode);
  const toggleTheme = useGameStore((s) => s.toggleTheme);

  return (
    <motion.button
      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.span
        className="text-lg block"
        key={darkMode ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {darkMode ? "🌙" : "☀️"}
      </motion.span>
    </motion.button>
  );
}
