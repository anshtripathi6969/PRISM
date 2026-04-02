"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import Header from "@/components/Header";
import DiceBoard from "@/components/dice/DiceBoard";
import DiceControls from "@/components/dice/DiceControls";
import DiceSlider from "@/components/dice/DiceSlider";
import { soundManager } from "@/lib/sounds";
import { motion } from "framer-motion";

function Particles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 1.5,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 20,
        color:
          i % 3 === 0
            ? "rgba(34, 211, 238, 0.2)"
            : i % 3 === 1
            ? "rgba(139, 92, 246, 0.18)"
            : "rgba(217, 70, 239, 0.15)",
      }))
    );
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

export default function DicePage() {
  const darkMode = useGameStore((s) => s.darkMode);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
    }
  }, [darkMode]);

  if (!isMounted) return <div className="min-h-screen bg-[#0a0a0f]" />;

  return (
    <div className="flex flex-col min-h-screen relative text-white">
      <div className="bg-pattern" />
      <div className="bg-grid" />
      <Particles />

      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-1">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4 bg-[#0a0a0f]/60 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
            >
                {/* Left side: Navigation & Controls */}
                <div className="bg-[#0f0f1a]/80 border-r border-white/5">
                    <DiceControls />
                </div>

                {/* Right side: Game Display */}
                <div className="flex flex-col items-center justify-center p-4 lg:p-6">
                    <DiceSlider />
                </div>
            </motion.div>
        </main>
      </div>
    </div>
  );
}
