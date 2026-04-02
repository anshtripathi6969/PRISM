"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { soundManager } from "@/lib/sounds";

export default function SoundToggle() {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  function handleToggle() {
    toggleSound();
    soundManager.setMuted(soundEnabled);
  }

  return (
    <motion.button
      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
    >
      <span className="text-lg block">
        {soundEnabled ? "🔊" : "🔇"}
      </span>
    </motion.button>
  );
}
