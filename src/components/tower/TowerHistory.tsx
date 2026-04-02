"use client";

import { useTowerStore } from "@/store/towerStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ScrollText } from "lucide-react";

export default function TowerHistory() {
  const history = useTowerStore((s) => s.history);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold text-white/50 flex items-center gap-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ScrollText size={14} className="text-amber-400" />
        <span className="hidden sm:inline italic">History</span>
        {history.length > 0 && (
          <span className="bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded-full text-[10px]">
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
              className="history-dropdown absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto z-50 rounded-xl p-3 border border-white/10"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/30 mb-3 ml-1">
                Tower History
              </h3>
              {history.length === 0 ? (
                <p className="text-xs text-white/15 text-center py-6">
                  No towers built yet
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {history.slice(0, 20).map((round) => (
                    <div
                      key={round.id}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs relative overflow-hidden group/item ${
                        round.result === "won"
                          ? "bg-emerald-500/10 border border-emerald-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 relative z-10">
                        <span className="text-base">
                          {round.result === "won" ? "🗼" : "💥"}
                        </span>
                        <div>
                          <div className="font-bold text-white/80 capitalize">
                            {round.difficulty} · Floor {round.rowsClimbed}
                          </div>
                          <div className="text-white/30 text-[10px] tabular-nums tracking-tight">
                            Bet: 🪙 {round.bet.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-black text-right relative z-10 tabular-nums ${
                          round.result === "won"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {round.result === "won"
                          ? `+🪙 ${round.payout.toLocaleString()}`
                          : `-🪙 ${round.bet.toLocaleString()}`}
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
