import { GRID_SIZE, HOUSE_EDGE, MAX_MINES } from "./constants";

const multiplierCache: Map<string, number> = new Map();

export function getMultiplier(mines: number, revealed: number): number {
  const key = `${mines}-${revealed}`;
  if (multiplierCache.has(key)) return multiplierCache.get(key)!;

  const safeTiles = GRID_SIZE - mines;
  if (revealed <= 0) return 1;
  if (revealed > safeTiles) return 0;

  let multiplier = 1;
  for (let i = 0; i < revealed; i++) {
    multiplier *= (GRID_SIZE - i) / (safeTiles - i);
  }

  multiplier *= 1 - HOUSE_EDGE;
  multiplier = Math.max(1, Math.round(multiplier * 100) / 100);

  multiplierCache.set(key, multiplier);
  return multiplier;
}

export function getMultiplierTable(mines: number): number[] {
  const safeTiles = GRID_SIZE - mines;
  const table: number[] = [];
  for (let i = 1; i <= safeTiles; i++) {
    table.push(getMultiplier(mines, i));
  }
  return table;
}

export function getNextMultiplier(mines: number, revealed: number): number {
  return getMultiplier(mines, revealed + 1);
}

export function precomputeAll(): void {
  for (let m = 1; m <= MAX_MINES; m++) {
    getMultiplierTable(m);
  }
}
