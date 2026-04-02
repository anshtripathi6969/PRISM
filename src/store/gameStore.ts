import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tile, GameStatus, GameRound, GameStats } from "@/types/game";
import { GRID_SIZE, DEFAULT_COINS, MIN_BET } from "@/lib/constants";
import { getMultiplier } from "@/lib/multipliers";

interface GameStore {
  tiles: Tile[];
  gameStatus: GameStatus;
  mines: number;
  bet: number;
  revealedCount: number;
  currentMultiplier: number;
  coins: number;
  history: GameRound[];
  stats: GameStats;
  darkMode: boolean;
  soundEnabled: boolean;
  focusedTile: number;

  setMines: (n: number) => void;
  setBet: (n: number) => void;
  startGame: () => void;
  revealTile: (id: number) => void;
  cashOut: () => void;
  resetGame: () => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  setFocusedTile: (id: number) => void;
  showResetPopup: boolean;
  setShowResetPopup: (show: boolean) => void;
  adjustCoins: (amount: number) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createTiles(mineCount: number): Tile[] {
  const minePositions = new Set<number>();
  while (minePositions.size < mineCount) {
    minePositions.add(Math.floor(Math.random() * GRID_SIZE));
  }
  return Array.from({ length: GRID_SIZE }, (_, i) => ({
    id: i,
    isMine: minePositions.has(i),
    isRevealed: false,
  }));
}

const defaultStats: GameStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  bestStreak: 0,
  currentStreak: 0,
  totalEarnings: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      tiles: [],
      gameStatus: "idle",
      showResetPopup: false,
      mines: 3,
      bet: MIN_BET,
      revealedCount: 0,
      currentMultiplier: 1,
      coins: DEFAULT_COINS,
      history: [],
      stats: defaultStats,
      darkMode: true,
      soundEnabled: true,
      focusedTile: 0,

      setMines: (n) => set({ mines: n }),
      setBet: (n) => set({ bet: n }),
      setFocusedTile: (id) => set({ focusedTile: id }),
      setShowResetPopup: (show) => set({ showResetPopup: show }),

      adjustCoins: (amount) => {
        set((state) => {
          let newCoins = state.coins + amount;
          if (newCoins < 0) newCoins = 0;
          return { coins: newCoins };
        });
      },

      startGame: () => {
        const { bet, coins, mines, adjustCoins } = get();
        if (bet > coins || bet <= 0) return;
        const tiles = createTiles(mines);
        adjustCoins(-bet);
        set({
          tiles,
          gameStatus: "playing",
          revealedCount: 0,
          currentMultiplier: 1,
          focusedTile: 0,
        });
      },

      revealTile: (id) => {
        const { tiles, gameStatus, mines, revealedCount, bet } = get();
        if (gameStatus !== "playing") return;
        const tile = tiles[id];
        if (!tile || tile.isRevealed) return;

        const newTiles = tiles.map((t) =>
          t.id === id ? { ...t, isRevealed: true } : t
        );

        if (tile.isMine) {
          const revealedAll = newTiles.map((t) =>
            t.isMine ? { ...t, isRevealed: true } : t
          );
          const { stats, history } = get();
          const round: GameRound = {
            id: Date.now().toString(36),
            mines,
            bet,
            result: "lost",
            payout: 0,
            revealedCount,
            timestamp: Date.now(),
          };
          set({
            tiles: revealedAll,
            gameStatus: "lost",
            history: [round, ...history].slice(0, 50),
            stats: {
              ...stats,
              totalGames: stats.totalGames + 1,
              losses: stats.losses + 1,
              currentStreak: 0,
              totalEarnings: stats.totalEarnings - bet,
            },
          });
        } else {
          const newRevealed = revealedCount + 1;
          const newMultiplier = getMultiplier(mines, newRevealed);
          set({
            tiles: newTiles,
            revealedCount: newRevealed,
            currentMultiplier: newMultiplier,
          });
        }
      },

      cashOut: () => {
        const { gameStatus, bet, currentMultiplier, mines, revealedCount, stats, history, adjustCoins } = get();
        if (gameStatus !== "playing" || revealedCount === 0) return;
        const payout = Math.round(bet * currentMultiplier);
        adjustCoins(payout);
        const round: GameRound = {
          id: Date.now().toString(36),
          mines,
          bet,
          result: "won",
          payout,
          revealedCount,
          timestamp: Date.now(),
        };
        const newStreak = stats.currentStreak + 1;
        set({
          gameStatus: "won",
          history: [round, ...history].slice(0, 50),
          stats: {
            ...stats,
            totalGames: stats.totalGames + 1,
            wins: stats.wins + 1,
            currentStreak: newStreak,
            bestStreak: Math.max(stats.bestStreak, newStreak),
            totalEarnings: stats.totalEarnings + (payout - bet),
          },
        });
      },

      resetGame: () => {
        set({
          tiles: [],
          gameStatus: "idle",
          revealedCount: 0,
          currentMultiplier: 1,
          focusedTile: 0,
        });
      },

      toggleTheme: () => set((s) => ({ darkMode: !s.darkMode })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
    }),
    {
      name: "mines-game-storage",
      partialize: (state) => ({
        coins: state.coins,
        history: state.history,
        stats: state.stats,
        darkMode: state.darkMode,
        soundEnabled: state.soundEnabled,
        mines: state.mines,
        bet: state.bet,
      }),
    }
  )
);
