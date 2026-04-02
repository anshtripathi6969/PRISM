"use client";

import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function StatsPanel() {
  const stats = useGameStore((s) => s.stats);
  const [isOpen, setIsOpen] = useState(false);

  const winRate =
    stats.totalGames > 0
      ? Math.round((stats.wins / stats.totalGames) * 100)
      : 0;

  return (
    <div className="relative">
      <button
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold text-white/50 flex items-center gap-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>📊</span>
        <span className="hidden sm:inline">Stats</span>
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
              className="stats-dropdown absolute right-0 top-full mt-2 w-64 z-50 rounded-xl p-4"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
                Your Stats
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total Games" value={stats.totalGames.toString()} />
                <StatCard
                  label="Win Rate"
                  value={`${winRate}%`}
                  color={winRate >= 50 ? "text-emerald-400" : "text-red-400"}
                />
                <StatCard
                  label="Best Streak"
                  value={stats.bestStreak.toString()}
                  color="text-yellow-400"
                />
                <StatCard
                  label="Current Streak"
                  value={stats.currentStreak.toString()}
                  color="text-cyan-400"
                />
              </div>

              <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[10px] text-white/30 uppercase">Total Earnings</div>
                <div
                  className={`text-lg font-bold ${
                    stats.totalEarnings >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {stats.totalEarnings >= 0 ? "+" : ""}🪙{" "}
                  {stats.totalEarnings.toLocaleString()}
                </div>
              </div>

              {stats.totalGames > 0 && (
                <div className="mt-3">
                  <div className="text-[10px] text-white/30 uppercase mb-1">Win/Loss</div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
                    <div
                      className="bg-emerald-500 transition-all duration-500"
                      style={{ width: `${winRate}%` }}
                    />
                    <div
                      className="bg-red-500 transition-all duration-500"
                      style={{ width: `${100 - winRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/30 mt-1">
                    <span>{stats.wins}W</span>
                    <span>{stats.losses}L</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
      <div className="text-[10px] text-white/30 uppercase">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}
