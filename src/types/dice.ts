import { GameStatus, GameStats } from "./game";

export type DiceStatus = GameStatus;

export interface DiceRound {
  id: string;
  bet: number;
  roll: number;
  target: number;
  condition: "over" | "under";
  multiplier: number;
  result: "won" | "lost";
  payout: number;
  timestamp: number;
}

export interface DiceState {
  status: DiceStatus;
  bet: number;
  target: number;
  condition: "over" | "under";
  history: DiceRound[];
  stats: GameStats;
}
