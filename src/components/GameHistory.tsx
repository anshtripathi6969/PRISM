"use client";

import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function GameHistory() {
  const history = useGameStore((s) => s.history);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold text-white/50 flex items-center gap-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📜</span>
        <span className="hidden sm:inline">History</span>
        {history.length > 0 && (
          <span className="bg-violet-500/30 text-violet-300 px-1.5 py-0.5 rounded-full text-[10px]">
            {history.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="history-dropdown absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto z-50 rounded-xl p-3"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                Game History
              </h3>
              {history.length === 0 ? (
                <p className="text-xs text-white/30 text-center py-4">
                  No games played yet
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {history.slice(0, 20).map((round) => (
                    <div
                      key={round.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs ${
                        round.result === "won"
                          ? "bg-emerald-500/10 border border-emerald-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{round.result === "won" ? "💎" : "💥"}</span>
                        <div>
                          <div className="font-semibold text-white/70">
                            {round.mines} mines · {round.revealedCount} revealed
                          </div>
                          <div className="text-white/30 text-[10px]">
                            Bet: 🪙 {round.bet}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-bold ${
                          round.result === "won"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {round.result === "won"
                          ? `+🪙 ${round.payout}`
                          : `-🪙 ${round.bet}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
