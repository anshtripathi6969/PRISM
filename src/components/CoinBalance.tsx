"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useRef, useState } from "react";

export default function CoinBalance() {
  const coins = useGameStore((s) => s.coins);
  const [displayCoins, setDisplayCoins] = useState(coins);
  const prevCoins = useRef(coins);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const diff = coins - prevCoins.current;
    if (diff !== 0) {
      setFlash(diff > 0 ? "up" : "down");
      setDisplayCoins(coins);
      prevCoins.current = coins;
      const timeout = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(timeout);
    }
  }, [coins]);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`coin-balance flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
          flash === "up"
            ? "ring-2 ring-emerald-400/50"
            : flash === "down"
            ? "ring-2 ring-red-400/50"
            : ""
        }`}
        animate={
          flash
            ? { scale: [1, 1.05, 1] }
            : {}
        }
        transition={{ duration: 0.3 }}
      >
        <span className="text-lg">🪙</span>
        <motion.span
          className={`tabular-nums ${
            flash === "up"
              ? "text-emerald-400"
              : flash === "down"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
          initial={false}
          animate={{ color: flash === "up" ? "#34d399" : flash === "down" ? "#f87171" : "#facc15" }}
        >
          {displayCoins.toLocaleString()}
        </motion.span>
      </motion.div>
    </div>
  );
}
