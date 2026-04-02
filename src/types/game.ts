export interface Tile {
  id: number;
  isMine: boolean;
  isRevealed: boolean;
}

export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface GameRound {
  id: string;
  mines: number;
  bet: number;
  result: "won" | "lost";
  payout: number;
  revealedCount: number;
  timestamp: number;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  bestStreak: number;
  currentStreak: number;
  totalEarnings: number;
}
