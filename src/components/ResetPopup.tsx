"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import { soundManager } from "@/lib/sounds";
import { useTowerStore } from "@/store/towerStore";

export default function ResetPopup() {
  const showResetPopup = useGameStore((s) => s.showResetPopup);
  const setShowResetPopup = useGameStore((s) => s.setShowResetPopup);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const coins = useGameStore((s) => s.coins);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const towerStatus = useTowerStore((s) => s.towerStatus);

  // Auto-reset when coins hit zero AND game is fully over
  useEffect(() => {
    const isPlaying = gameStatus === "playing" || towerStatus === "playing";
    if (coins <= 0 && !showResetPopup && !isPlaying) {
      const timeout = setTimeout(() => {
        useGameStore.setState({ showResetPopup: true, coins: 500 });
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [coins, showResetPopup, gameStatus, towerStatus]);

  // Hide popup after sound and time
  useEffect(() => {
    if (showResetPopup) {
      if (soundEnabled) soundManager.play("cashout"); 
      const timeout = setTimeout(() => {
        setShowResetPopup(false);
      }, 5000); 
      return () => clearTimeout(timeout);
    }
  }, [showResetPopup, setShowResetPopup, soundEnabled]);

  return (
    <AnimatePresence>
      {showResetPopup && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResetPopup(false)}
        >
          <motion.div
            className="bg-[#0f0f15] border border-cyan-500/30 shadow-[0_0_80px_rgba(0,240,255,0.15)] p-6 sm:p-10 rounded-3xl max-w-sm w-full text-center relative overflow-hidden"
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
            
            <motion.div 
              className="text-6xl mb-4"
              initial={{ rotate: -15, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              💸
            </motion.div>
            
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
              Out of Coins?
            </h2>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Don't worry, we're not a real casino! Your balance has automatically been replenished with <strong className="text-yellow-400">500 coins</strong> so you can keep playing.
            </p>

            <motion.button
              className="bg-cyan-500 text-black w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase"
              onClick={() => setShowResetPopup(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Keep Playing
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
