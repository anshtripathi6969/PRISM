import type { TowerConfig, TowerDifficulty } from "@/types/tower";
import { HOUSE_EDGE } from "./constants";

export const TOWER_CONFIGS: Record<TowerDifficulty, TowerConfig> = {
  easy: {
    label: "Easy",
    tilesPerRow: 4,
    safeTilesPerRow: 3,
    totalRows: 8,
    rowMultiplier: 4 / 3,
  },
  medium: {
    label: "Medium",
    tilesPerRow: 3,
    safeTilesPerRow: 2,
    totalRows: 8,
    rowMultiplier: 3 / 2,
  },
  hard: {
    label: "Hard",
    tilesPerRow: 3,
    safeTilesPerRow: 1,
    totalRows: 8,
    rowMultiplier: 3 / 1,
  },
};

export function getTowerMultiplier(
  difficulty: TowerDifficulty,
  rowsClimbed: number
): number {
  if (rowsClimbed <= 0) return 1;
  const config = TOWER_CONFIGS[difficulty];
  const raw = Math.pow(config.rowMultiplier, rowsClimbed);
  const adjusted = raw * (1 - HOUSE_EDGE);
  return Math.max(1, Math.round(adjusted * 100) / 100);
}

export function getNextTowerMultiplier(
  difficulty: TowerDifficulty,
  rowsClimbed: number
): number {
  return getTowerMultiplier(difficulty, rowsClimbed + 1);
}
