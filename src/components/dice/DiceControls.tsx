"use client";

import { useDiceStore } from "@/store/diceStore";
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { MIN_BET, MAX_BET } from "@/lib/constants";
import { Coins, ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuthStore } from "@/store/authStore";

export default function DiceControls() {
  const { user } = useAuthStore();
  const updateScore = useMutation(api.users.updateScore);
  const { bet, setBet, roll, status, target, setTarget, condition, setCondition } = useDiceStore();
  const coins = useGameStore((s) => s.coins);

  const isPlaying = status === "playing";
  const multiplier = condition === "over" ? 99 / (100 - target) : 99 / target;

  const handleBetChange = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ""));
    if (!isNaN(num)) setBet(Math.min(MAX_BET, Math.max(0, num)));
  };

  const adjustBet = (factor: number) => {
    setBet(Math.min(MAX_BET, Math.max(MIN_BET, Math.floor(bet * factor))));
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d1a]/80">
      <div className="flex-1 p-6 space-y-6">
        {/* Bet Amount */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20 px-1">
            <span>Bet Amount</span>
            <span className="text-[9px] text-white/10">🪙 {coins.toLocaleString()}</span>
          </div>

          <div className="relative flex items-center bg-black/40 border border-white/10 rounded-xl p-1 focus-within:border-cyan-500/40 transition-all">
            <input
              type="text"
              value={bet}
              onChange={(e) => handleBetChange(e.target.value)}
              disabled={isPlaying}
              className="flex-1 bg-transparent px-4 py-2 text-sm font-black text-white focus:outline-none placeholder:text-white/10 disabled:opacity-50"
              placeholder="0.00"
            />
            <div className="flex gap-1 h-full pl-3 border-l border-white/5 pr-1">
              <button
                onClick={() => adjustBet(0.5)}
                disabled={isPlaying}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase transition-all disabled:opacity-30"
              >
                1/2
              </button>
              <button
                onClick={() => adjustBet(2)}
                disabled={isPlaying}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase transition-all disabled:opacity-30"
              >
                2x
              </button>
            </div>
          </div>
        </div>

        {/* Profit on Win */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20 px-1">
            <span>Profit on Win</span>
          </div>
          <div className="relative bg-black/20 border border-white/5 rounded-xl p-3.5 flex items-center justify-between group">
            <span className="text-emerald-400 font-black text-sm">
              +{(bet * (multiplier - 1)).toFixed(2)}
            </span>
            <span className="text-[10px] font-black text-emerald-400/20 group-hover:text-emerald-400/40 transition-colors uppercase tracking-widest">Token</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <motion.button
            onClick={() => roll((payout) => {
              if (user) {
                updateScore({ userId: user._id as any, amount: payout - bet });
              }
            })}
            disabled={isPlaying || bet <= 0 || bet > coins}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`
              w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.4em]
              transition-all duration-300 relative overflow-hidden group
              ${isPlaying
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:shadow-[0_0_60px_rgba(34,211,238,0.3)]"}
            `}
          >
            <span className="relative z-10">{isPlaying ? "ROLLING..." : "BET"}</span>
            {!isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            )}
          </motion.button>

          {bet > coins && (
            <p className="mt-3 text-[9px] font-black text-red-500/60 text-center uppercase tracking-widest animate-pulse border-t border-red-500/5 pt-3">
              Insufficient Tokens
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
