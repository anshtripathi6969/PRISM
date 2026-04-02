export const GRID_SIZE = 25;
export const GRID_COLS = 5;
export const MIN_MINES = 1;
export const MAX_MINES = 10;
export const DEFAULT_COINS = 500;
export const MIN_BET = 10;
export const MAX_BET = 5000;
export const HOUSE_EDGE = 0.03;

export const DIFFICULTY_PRESETS = {
  easy: { mines: 1, label: "Easy" },
  medium: { mines: 3, label: "Medium" },
  hard: { mines: 7, label: "Hard" },
  extreme: { mines: 10, label: "Extreme" },
} as const;

export type DifficultyKey = keyof typeof DIFFICULTY_PRESETS;
