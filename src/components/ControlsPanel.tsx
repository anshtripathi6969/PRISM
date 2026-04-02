"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import {
  MIN_MINES,
  MAX_MINES,
  MIN_BET,
  MAX_BET,
  DIFFICULTY_PRESETS,
  type DifficultyKey,
} from "@/lib/constants";
import { getNextMultiplier } from "@/lib/multipliers";
import { soundManager } from "@/lib/sounds";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthStore } from "@/store/authStore";

const betPresets = [100, 500, 1000, 2500];

export default function ControlsPanel() {
  const { user } = useAuthStore();
  const updateScore = useMutation(api.users.updateScore);
  const mines = useGameStore((s) => s.mines);
  const bet = useGameStore((s) => s.bet);
  const coins = useGameStore((s) => s.coins);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const revealedCount = useGameStore((s) => s.revealedCount);
  const currentMultiplier = useGameStore((s) => s.currentMultiplier);
  const setMines = useGameStore((s) => s.setMines);
  const setBet = useGameStore((s) => s.setBet);
  const startGame = useGameStore((s) => s.startGame);
  const cashOut = useGameStore((s) => s.cashOut);
  const resetGame = useGameStore((s) => s.resetGame);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const isPlaying = gameStatus === "playing";
  const isIdle = gameStatus === "idle";
  const isGameOver = gameStatus === "lost" || gameStatus === "won";
  const canCashOut = isPlaying && revealedCount > 0;
  const potentialPayout = Math.round(bet * currentMultiplier);
  const nextMultiplier = getNextMultiplier(mines, revealedCount);

  function handleStart() {
    if (soundEnabled) soundManager.play("start");
    startGame();
  }

  function handleCashOut() {
    if (soundEnabled) soundManager.play("cashout");
    if (user) {
      updateScore({ userId: user._id as any, amount: potentialPayout - bet });
    }
    cashOut();
  }

  return (
    <div className="controls-panel flex flex-col gap-5 p-5 sm:p-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
          Difficulty
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {(Object.keys(DIFFICULTY_PRESETS) as DifficultyKey[]).map((key) => {
            const preset = DIFFICULTY_PRESETS[key];
            const isActive = mines === preset.mines && isIdle;
            return (
              <button
                key={key}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60"
                }`}
                onClick={() => {
                  setMines(preset.mines);
                }}
                disabled={!isIdle}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
          Mines: <span className="text-cyan-400">{mines}</span>
        </label>
        <input
          type="range"
          min={MIN_MINES}
          max={MAX_MINES}
          value={mines}
          onChange={(e) => setMines(Number(e.target.value))}
          disabled={!isIdle}
          className="mine-slider w-full"
        />
        <div className="flex justify-between text-[10px] text-white/30 mt-1">
          <span>{MIN_MINES}</span>
          <span>{MAX_MINES}</span>
        </div>
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
          <button
            className="col-span-4 px-2 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 transition-all"
            onClick={() => setBet(Math.min(MAX_BET, coins))}
            disabled={!isIdle}
          >
            MAX ({Math.min(MAX_BET, coins)})
          </button>
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
            Start Game
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
                Current Multiplier
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
                : "Reveal a tile first"}
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
                gameStatus === "won"
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : "bg-red-500/10 border border-red-500/30"
              }`}
            >
              <div className="text-2xl font-black mb-1">
                {gameStatus === "won" ? "💎 You Won!" : "💥 Mine Hit!"}
              </div>
              {gameStatus === "won" && (
                <div className="text-lg text-emerald-400 font-semibold">
                  +🪙 {potentialPayout}
                </div>
              )}
              {gameStatus === "lost" && (
                <div className="text-sm text-red-400">
                  Lost 🪙 {bet}
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
