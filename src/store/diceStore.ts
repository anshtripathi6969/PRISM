import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DiceState, DiceRound, DiceStatus } from "@/types/dice";
import { useGameStore } from "./gameStore";
import { MIN_BET } from "@/lib/constants";

interface DiceActions {
  setBet: (bet: number) => void;
  setTarget: (target: number) => void;
  setCondition: (condition: "over" | "under") => void;
  roll: () => void;
  reset: () => void;
}

// Extend DiceState to use lastRoll instead of shadowing 'roll' function name
interface ExtendedDiceState extends Omit<DiceState, 'roll'> {
  lastRoll: number;
}

const INITIAL_STATS = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  bestStreak: 0,
  currentStreak: 0,
  totalEarnings: 0,
};

export const useDiceStore = create<ExtendedDiceState & DiceActions>()(
  persist(
    (set, get) => ({
      status: "idle",
      bet: MIN_BET,
      target: 50,
      condition: "over",
      lastRoll: 0,
      history: [],
      stats: INITIAL_STATS,

      setBet: (bet) => set({ bet }),
      setTarget: (target) => set({ target }),
      setCondition: (condition) => set({ condition }),

      roll: () => {
        const { status, bet, target, condition, stats, history } = get();
        if (status === "playing") return;

        const { coins, adjustCoins } = useGameStore.getState();
        if (bet > coins || bet <= 0) return;

        set({ status: "playing" });
        adjustCoins(-bet);

        // Simulate roll
        setTimeout(() => {
          const rollResult = parseFloat((Math.random() * 100).toFixed(2));
          const isWin = condition === "over" ? rollResult > target : rollResult < target;
          
          let multiplier = 1;
          if (condition === "over") {
            multiplier = 99 / (100 - target);
          } else {
            multiplier = 99 / target;
          }
          
          const payout = isWin ? Math.floor(bet * multiplier) : 0;
          if (isWin) adjustCoins(payout);

          const round: DiceRound = {
            id: Math.random().toString(36).substr(2, 9),
            bet,
            roll: rollResult,
            target,
            condition,
            multiplier: parseFloat(multiplier.toFixed(2)),
            result: isWin ? "won" : "lost",
            payout,
            timestamp: Date.now(),
          };

          const newStreak = isWin ? stats.currentStreak + 1 : 0;
          set({
            status: isWin ? "won" : "lost",
            lastRoll: rollResult,
            history: [round, ...history].slice(0, 50),
            stats: {
              ...stats,
              totalGames: stats.totalGames + 1,
              wins: isWin ? stats.wins + 1 : stats.wins,
              losses: isWin ? stats.losses : stats.losses + 1,
              currentStreak: newStreak,
              bestStreak: Math.max(stats.bestStreak, newStreak),
              totalEarnings: stats.totalEarnings + (payout - bet),
            },
          });
        }, 600);
      },

      reset: () => set({ status: "idle" }),
    }),
    {
      name: "dice-game-storage",
      partialize: (state) => ({
        history: state.history,
        stats: state.stats,
      }),
    }
  )
);
