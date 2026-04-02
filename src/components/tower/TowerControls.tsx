"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTowerStore } from "@/store/towerStore";
import { useGameStore } from "@/store/gameStore";
import {
  TOWER_CONFIGS,
  getNextTowerMultiplier,
} from "@/lib/towerMultipliers";
import { MIN_BET, MAX_BET } from "@/lib/constants";
import { soundManager } from "@/lib/sounds";
import type { TowerDifficulty } from "@/types/tower";

const betPresets = [10, 25, 50, 100];
const difficulties: TowerDifficulty[] = ["easy", "medium", "hard"];

export default function TowerControls() {
  const difficulty = useTowerStore((s) => s.difficulty);
  const bet = useTowerStore((s) => s.bet);
  const coins = useGameStore((s) => s.coins);
  const towerStatus = useTowerStore((s) => s.towerStatus);
  const currentRow = useTowerStore((s) => s.currentRow);
  const currentMultiplier = useTowerStore((s) => s.currentMultiplier);
  const setDifficulty = useTowerStore((s) => s.setDifficulty);
  const setBet = useTowerStore((s) => s.setBet);
  const startGame = useTowerStore((s) => s.startGame);
  const cashOut = useTowerStore((s) => s.cashOut);
  const resetGame = useTowerStore((s) => s.resetGame);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const isPlaying = towerStatus === "playing";
  const isIdle = towerStatus === "idle";
  const isGameOver = towerStatus === "lost" || towerStatus === "won";
  const canCashOut = isPlaying && currentRow >= 0;
  const potentialPayout = Math.round(bet * currentMultiplier);
  const nextMultiplier = getNextTowerMultiplier(difficulty, currentRow + 1);
  const config = TOWER_CONFIGS[difficulty];

  function handleStart() {
    if (soundEnabled) soundManager.play("start");
    startGame();
  }

  function handleCashOut() {
    if (soundEnabled) soundManager.play("cashout");
    cashOut();
  }

  return (
    <div className="controls-panel flex flex-col gap-5 p-5 sm:p-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
          Difficulty
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {difficulties.map((d) => {
            const cfg = TOWER_CONFIGS[d];
            const isActive = difficulty === d && isIdle;
            return (
              <button
                key={d}
                className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    : difficulty === d
                    ? "bg-cyan-500/10 text-cyan-400/60 border border-cyan-500/20"
                    : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60"
                }`}
                onClick={() => setDifficulty(d)}
                disabled={!isIdle}
              >
                <div>{cfg.label}</div>
                <div className="text-[9px] text-white/25 mt-0.5">
                  {cfg.safeTilesPerRow}/{cfg.tilesPerRow} safe
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/8 text-xs text-white/40">
        <span>🗼</span>
        <span>{config.totalRows} rows · {config.tilesPerRow} tiles per row · {config.safeTilesPerRow} safe</span>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
          Bet Amount
        </label>
        <div className="flex items-center gap-2 mb-2">
          <button
            className="bet-adjust-btn"
            onClick={() => setBet(Math.max(MIN_BET, bet - 10))}
            disabled={!isIdle}
          >
            −
          </button>
          <div className="flex-1 relative">
            <input
              type="number"
              min={MIN_BET}
              max={Math.min(MAX_BET, coins)}
              value={bet}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= MIN_BET && v <= Math.min(MAX_BET, coins)) setBet(v);
              }}
              className="bet-input w-full"
              disabled={!isIdle}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-yellow-400/60">
              🪙
            </span>
          </div>
          <button
            className="bet-adjust-btn"
            onClick={() => setBet(Math.min(Math.min(MAX_BET, coins), bet + 10))}
            disabled={!isIdle}
          >
            +
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {betPresets.map((preset) => (
            <button
              key={preset}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                bet === preset
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/50"
                  : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
              }`}
              onClick={() => setBet(preset)}
              disabled={!isIdle || preset > coins}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isIdle && (
          <motion.button
            key="start"
            className="start-btn w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider"
            onClick={handleStart}
            disabled={bet > coins || bet < MIN_BET}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Climbing
          </motion.button>
        )}

        {isPlaying && (
          <motion.div
            key="playing"
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="multiplier-display text-center p-4 rounded-xl">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                Floor {currentRow + 2} of {config.totalRows}
              </div>
              <motion.div
                className="text-3xl font-black text-cyan-400"
                key={currentMultiplier}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {currentMultiplier.toFixed(2)}×
              </motion.div>
              <div className="text-xs text-white/30 mt-1">
                Next: {nextMultiplier.toFixed(2)}×
              </div>
            </div>

            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/40 mb-1">Potential Payout</div>
              <div className="text-lg font-bold text-yellow-400">
                🪙 {potentialPayout}
              </div>
            </div>

            <motion.button
              className="cashout-btn w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider"
              onClick={handleCashOut}
              disabled={!canCashOut}
              whileHover={canCashOut ? { scale: 1.02 } : {}}
              whileTap={canCashOut ? { scale: 0.98 } : {}}
            >
              {canCashOut
                ? `Cash Out — 🪙 ${potentialPayout}`
                : "Climb a floor first"}
            </motion.button>
          </motion.div>
        )}

        {isGameOver && (
          <motion.div
            key="gameover"
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              className={`text-center p-4 rounded-xl ${
                towerStatus === "won"
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : "bg-red-500/10 border border-red-500/30"
              }`}
            >
              <div className="text-2xl font-black mb-1">
                {towerStatus === "won" ? "🏆 You Reached the Top!" : "💀 You Fell!"}
              </div>
              {towerStatus === "won" && (
                <div className="text-lg text-emerald-400 font-semibold">
                  +🪙 {potentialPayout}
                </div>
              )}
              {towerStatus === "lost" && (
                <div className="text-sm text-red-400">
                  Lost 🪙 {bet} · Reached floor {currentRow + 1}
                </div>
              )}
            </div>

            <motion.button
              className="start-btn w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider"
              onClick={resetGame}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
