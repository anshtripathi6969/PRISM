"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import Header from "@/components/Header";
import GameBoard from "@/components/GameBoard";
import ControlsPanel from "@/components/ControlsPanel";
import GameHistory from "@/components/GameHistory";
import StatsPanel from "@/components/StatsPanel";
import { precomputeAll } from "@/lib/multipliers";
import { soundManager } from "@/lib/sounds";

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
            ? "rgba(0, 240, 255, 0.2)"
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

export default function MinesPage() {
  const darkMode = useGameStore((s) => s.darkMode);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    precomputeAll();
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
    <div className="flex flex-col min-h-screen relative">
      <div className="bg-pattern" />
      <div className="bg-grid" />
      <Particles />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GameHistory />
            <StatsPanel />
          </div>

          <div className="game-layout w-full max-w-[1100px]">
            <div className="game-layout-controls">
              <ControlsPanel />
            </div>
            <div className="game-layout-board">
              <GameBoard />
            </div>
          </div>
        </main>

        <footer className="text-center py-3 text-[10px] text-white/20 relative z-10">
          PRISM Premium Gaming · The ultimate high-stakes simulation
        </footer>
      </div>
    </div>
  );
}
