"use client";

import { useTowerStore } from "@/store/towerStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function TowerStats() {
  const stats = useTowerStore((s) => s.stats);
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
        <TrendingUp size={14} className="text-amber-400" />
        <span className="hidden sm:inline italic">Stats</span>
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
              className="stats-dropdown absolute right-0 top-full mt-2 w-64 z-50 rounded-xl p-4 border border-white/10 shadow-2xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/30 mb-4 ml-1">
                Tower Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total Builds" value={stats.totalGames.toString()} />
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
                  label="Streak"
                  value={stats.currentStreak.toString()}
                  color="text-cyan-400"
                />
              </div>

              <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 overflow-hidden relative group/earnings">
                <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Total Payouts</div>
                <div
                  className={`text-lg font-black tabular-nums transition-colors ${
                    stats.totalEarnings >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {stats.totalEarnings >= 0 ? "+" : ""}🪙{" "}
                  {stats.totalEarnings.toLocaleString()}
                </div>
                {/* Decorative background glow */}
                <div className={`absolute -right-4 -bottom-4 w-12 h-12 blur-2xl opacity-20 transition-colors ${
                    stats.totalEarnings >= 0 ? "bg-emerald-500" : "bg-red-500"
                  }`} 
                />
              </div>

              {stats.totalGames > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] text-white/30 uppercase font-black mb-1.5 px-0.5">
                    <span>Performance</span>
                    <span className="text-white/50">{winRate}%</span>
                  </div>
                  <div className="flex h-1.5 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/5">
                    <div
                      className="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-700"
                      style={{ width: `${winRate}%` }}
                    />
                    <div
                      className="bg-red-500/50 transition-all duration-700"
                      style={{ width: `${100 - winRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-white/20 mt-2 px-1">
                    <span>{stats.wins} Won</span>
                    <span>{stats.losses} Smashed</span>
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
    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 transition-colors hover:bg-white/[0.07]">
      <div className="text-[9px] text-white/20 uppercase font-bold tracking-wider">{label}</div>
      <div className={`text-base font-black tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
