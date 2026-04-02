"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDiceStore } from "@/store/diceStore";

export default function DiceBoard() {
  const { status, lastRoll, target, condition } = useDiceStore();
  
  const isWin = status === "won";
  const isLoss = status === "lost";
  const isPlaying = status === "playing";

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0d0d1a]/50 backdrop-blur-xl border border-white/5 rounded-3xl min-h-[200px] relative overflow-hidden">
      {/* Background Glow */}
      <AnimatePresence>
        {isWin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-emerald-500/5 blur-[100px] -z-10"
          />
        )}
        {isLoss && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-500/5 blur-[100px] -z-10"
          />
        )}
      </AnimatePresence>

      <div className="text-center relative z-10 w-full">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-4">
          The Outcome
        </h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={isPlaying ? "rolling" : lastRoll}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -10 }}
              className={`text-6xl sm:text-7xl font-black tracking-tighter tabular-nums ${
                isPlaying ? "text-white/10 blur-[2px]" : 
                isWin ? "text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]" : 
                isLoss ? "text-red-400" : "text-white/20"
              }`}
            >
              {isPlaying ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                >
                  ??.??
                </motion.span>
              ) : (
                lastRoll.toFixed(2)
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {!isPlaying && status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-2 text-[10px] font-black uppercase tracking-[0.3em] ${isWin ? "text-emerald-400" : "text-red-400"}`}
              >
                {isWin ? "CONGRATULATIONS" : "TRY AGAIN"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-10">
          <div className="text-center">
            <div className="text-[10px] font-black text-white/10 uppercase tracking-widest mb-0.5">Target</div>
            <div className="text-lg font-black text-white/50">
              {condition === "over" ? ">" : "<"} {target}
            </div>
          </div>
          <div className="w-px h-6 bg-white/5" />
          <div className="text-center">
            <div className="text-[10px] font-black text-white/10 uppercase tracking-widest mb-0.5">Chance</div>
            <div className="text-lg font-black text-white/50">
              {condition === "over" ? (100 - target).toFixed(1) : target.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/5 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/5 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/5 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/5 rounded-br-lg" />
    </div>
  );
}
