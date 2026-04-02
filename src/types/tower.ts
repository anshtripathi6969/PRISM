export interface TowerTile {
  id: number;
  row: number;
  col: number;
  isSafe: boolean;
  isRevealed: boolean;
}

export type TowerDifficulty = "easy" | "medium" | "hard";

export type TowerStatus = "idle" | "playing" | "won" | "lost";

export interface TowerConfig {
  label: string;
  tilesPerRow: number;
  safeTilesPerRow: number;
  totalRows: number;
  rowMultiplier: number;
}

export interface TowerRound {
  id: string;
  difficulty: TowerDifficulty;
  bet: number;
  result: "won" | "lost";
  payout: number;
  rowsClimbed: number;
  timestamp: number;
}
