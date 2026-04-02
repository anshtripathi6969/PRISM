"use client";

import { motion } from "framer-motion";
import TowerTile from "./TowerTile";
import { useTowerStore } from "@/store/towerStore";
import { TOWER_CONFIGS } from "@/lib/towerMultipliers";
import { soundManager } from "@/lib/sounds";
import { useGameStore } from "@/store/gameStore";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuthStore } from "@/store/authStore";

export default function TowerBoard() {
  const { user } = useAuthStore();
  const updateScore = useMutation(api.users.updateScore);
  const rows = useTowerStore((s) => s.rows);
  const towerStatus = useTowerStore((s) => s.towerStatus);
  const currentRow = useTowerStore((s) => s.currentRow);
  const difficulty = useTowerStore((s) => s.difficulty);
  const bet = useTowerStore((s) => s.bet);
  const revealTile = useTowerStore((s) => s.revealTile);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const config = TOWER_CONFIGS[difficulty];

  const isPlaying = towerStatus === "playing";
  const gameOver = towerStatus === "lost" || towerStatus === "won";

  function handleClick(row: number, col: number) {
    if (!isPlaying) return;
    if (soundEnabled) soundManager.play("click");

    const tile = rows[row]?.[col];
    if (tile && !tile.isSafe) {
      if (soundEnabled) setTimeout(() => soundManager.play("explosion"), 100);
    } else {
      if (soundEnabled) setTimeout(() => soundManager.play("gem"), 50);
    }
    revealTile(row, col, (payout) => {
      if (user) {
        updateScore({ userId: user._id as any, amount: payout - bet });
      }
    });
  }

  if (towerStatus === "idle") {
    return (
      <div className="tower-board-container w-full max-w-[440px] mx-auto">
        <div className="game-board-wrapper">
          <div className="flex flex-col-reverse gap-2.5 sm:gap-3 relative z-10">
            {Array.from({ length: config.totalRows }, (_, r) => (
              <div
                key={r}
                className="grid gap-2.5 sm:gap-3"
                style={{ gridTemplateColumns: `repeat(${config.tilesPerRow}, 1fr)` }}
              >
                {Array.from({ length: config.tilesPerRow }, (_, c) => (
                  <motion.div
                    key={c}
                    className="h-14 sm:h-16 rounded-xl tower-tile-locked"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: r * 0.04 + c * 0.02, type: "spring", stiffness: 280 }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              className="text-center px-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-4xl mb-3">🗼</div>
              <p className="text-base font-bold text-white/50 mb-1">
                Climb the Tower
              </p>
              <p className="text-xs text-white/30">
                Set difficulty & bet, then start climbing
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tower-board-container w-full max-w-[440px] mx-auto" onKeyDown={() => {}} tabIndex={0}>
      <div className="game-board-wrapper">
        <div className="flex flex-col-reverse gap-2.5 sm:gap-3 relative z-10">
          {rows.map((row, r) => (
            <div
              key={r}
              className="grid gap-2.5 sm:gap-3 relative"
              style={{ gridTemplateColumns: `repeat(${config.tilesPerRow}, 1fr)` }}
            >
              {/* Row number indicator */}
              <div className="absolute -left-9 sm:-left-12 top-1/2 -translate-y-1/2 text-xs font-bold text-white/20 w-6 text-right">
                {r + 1}
              </div>
              {row.map((tile) => (
                <TowerTile
                  key={tile.id}
                  tile={tile}
                  onClick={handleClick}
                  isActiveRow={isPlaying && r === currentRow + 1}
                  isAboveActive={r > currentRow + 1}
                  gameOver={gameOver}
                  rowIndex={r}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
