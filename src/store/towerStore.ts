import { create } from "zustand";
import type {
  TowerTile,
  TowerDifficulty,
  TowerStatus,
  TowerRound,
} from "@/types/tower";
import type { GameStats } from "@/types/game";
import { TOWER_CONFIGS, getTowerMultiplier } from "@/lib/towerMultipliers";
import { MIN_BET } from "@/lib/constants";
import { useGameStore } from "./gameStore";

interface TowerStore {
  rows: TowerTile[][];
  towerStatus: TowerStatus;
  difficulty: TowerDifficulty;
  bet: number;
  currentRow: number;
  currentMultiplier: number;
  history: TowerRound[];
  stats: GameStats;

  setDifficulty: (d: TowerDifficulty) => void;
  setBet: (n: number) => void;
  startGame: () => void;
  revealTile: (row: number, col: number) => void;
  cashOut: () => void;
  resetGame: () => void;
}

function createTowerRows(difficulty: TowerDifficulty): TowerTile[][] {
  const config = TOWER_CONFIGS[difficulty];
  const rows: TowerTile[][] = [];
  let idCounter = 0;

  for (let r = 0; r < config.totalRows; r++) {
    const row: TowerTile[] = [];
    const safePositions = new Set<number>();
    while (safePositions.size < config.safeTilesPerRow) {
      safePositions.add(Math.floor(Math.random() * config.tilesPerRow));
    }
    for (let c = 0; c < config.tilesPerRow; c++) {
      row.push({
        id: idCounter++,
        row: r,
        col: c,
        isSafe: safePositions.has(c),
        isRevealed: false,
      });
    }
    rows.push(row);
  }
  return rows;
}

const defaultStats: GameStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  bestStreak: 0,
  currentStreak: 0,
  totalEarnings: 0,
};

function loadPersistedState() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("tower-game-storage");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.state || {};
    }
  } catch {}
  return {};
}

function saveState(state: Partial<TowerStore>) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadPersistedState();
    const toSave = {
      history: state.history,
      stats: state.stats,
      difficulty: state.difficulty,
      bet: state.bet,
    };
    localStorage.setItem(
      "tower-game-storage",
      JSON.stringify({ state: { ...existing, ...toSave } })
    );
  } catch {}
}

export const useTowerStore = create<TowerStore>()((set, get) => {
  const persisted = loadPersistedState();

  return {
    rows: [],
    towerStatus: "idle",
    difficulty: persisted.difficulty || "medium",
    bet: persisted.bet || MIN_BET,
    currentRow: -1,
    currentMultiplier: 1,
    history: persisted.history || [],
    stats: persisted.stats || defaultStats,

    setDifficulty: (d) => {
      set({ difficulty: d });
      saveState({ ...get(), difficulty: d });
    },

    setBet: (n) => {
      set({ bet: n });
      saveState({ ...get(), bet: n });
    },

    startGame: () => {
      const { bet, difficulty } = get();
      const adjustCoins = useGameStore.getState().adjustCoins;
      const coins = useGameStore.getState().coins;
      
      if (bet > coins || bet <= 0) return;
      const rows = createTowerRows(difficulty);
      
      adjustCoins(-bet);
      
      set({
        rows,
        towerStatus: "playing",
        currentRow: -1,
        currentMultiplier: 1,
      });
      saveState(get());
    },

    revealTile: (row, col) => {
      const { rows, towerStatus, currentRow, difficulty, bet } = get();
      if (towerStatus !== "playing") return;
      if (row !== currentRow + 1) return;

      const tile = rows[row]?.[col];
      if (!tile || tile.isRevealed) return;

      const newRows = rows.map((r, ri) =>
        ri === row
          ? r.map((t) =>
              t.col === col ? { ...t, isRevealed: true } : t
            )
          : r
      );

      if (!tile.isSafe) {
        const revealedAll = newRows.map((r, ri) =>
          ri === row
            ? r.map((t) => ({ ...t, isRevealed: true }))
            : r
        );
        const { stats, history } = get();
        const round: TowerRound = {
          id: Date.now().toString(36),
          difficulty,
          bet,
          result: "lost",
          payout: 0,
          rowsClimbed: currentRow + 1,
          timestamp: Date.now(),
        };
        const newState = {
          rows: revealedAll,
          towerStatus: "lost" as TowerStatus,
          history: [round, ...history].slice(0, 50),
          stats: {
            ...stats,
            totalGames: stats.totalGames + 1,
            losses: stats.losses + 1,
            currentStreak: 0,
            totalEarnings: stats.totalEarnings - bet,
          },
        };
        set(newState);
        saveState({ ...get(), ...newState });
      } else {
        const newRow = currentRow + 1;
        const newMultiplier = getTowerMultiplier(difficulty, newRow + 1);
        const config = TOWER_CONFIGS[difficulty];

        if (newRow + 1 >= config.totalRows) {
          const { stats, history } = get();
          const payout = Math.round(bet * newMultiplier);
          const adjustCoins = useGameStore.getState().adjustCoins;
          adjustCoins(payout);
          const round: TowerRound = {
            id: Date.now().toString(36),
            difficulty,
            bet,
            result: "won",
            payout,
            rowsClimbed: newRow + 1,
            timestamp: Date.now(),
          };
          const newStreak = stats.currentStreak + 1;
          const newState = {
            rows: newRows,
            towerStatus: "won" as TowerStatus,
            currentRow: newRow,
            currentMultiplier: newMultiplier,
            history: [round, ...history].slice(0, 50),
            stats: {
              ...stats,
              totalGames: stats.totalGames + 1,
              wins: stats.wins + 1,
              currentStreak: newStreak,
              bestStreak: Math.max(stats.bestStreak, newStreak),
              totalEarnings: stats.totalEarnings + (payout - bet),
            },
          };
          set(newState);
          saveState({ ...get(), ...newState });
        } else {
          set({
            rows: newRows,
            currentRow: newRow,
            currentMultiplier: newMultiplier,
          });
        }
      }
    },

    cashOut: () => {
      const {
        towerStatus,
        bet,
        currentMultiplier,
        difficulty,
        currentRow,
        stats,
        history,
      } = get();
      if (towerStatus !== "playing" || currentRow < 0) return;
      const payout = Math.round(bet * currentMultiplier);
      const adjustCoins = useGameStore.getState().adjustCoins;
      adjustCoins(payout);
      const round: TowerRound = {
        id: Date.now().toString(36),
        difficulty,
        bet,
        result: "won",
        payout,
        rowsClimbed: currentRow + 1,
        timestamp: Date.now(),
      };
      const newStreak = stats.currentStreak + 1;
      const newState = {
        towerStatus: "won" as TowerStatus,
        history: [round, ...history].slice(0, 50),
        stats: {
          ...stats,
          totalGames: stats.totalGames + 1,
          wins: stats.wins + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(stats.bestStreak, newStreak),
          totalEarnings: stats.totalEarnings + (payout - bet),
        },
      };
      set(newState);
      saveState({ ...get(), ...newState });
    },

    resetGame: () => {
      set({
        rows: [],
        towerStatus: "idle",
        currentRow: -1,
        currentMultiplier: 1,
      });
    },
  };
});
