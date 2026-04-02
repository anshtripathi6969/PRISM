"use client";

import { motion } from "framer-motion";
import Tile from "./Tile";
import { useGameStore } from "@/store/gameStore";
import { GRID_COLS } from "@/lib/constants";
import { soundManager } from "@/lib/sounds";

export default function GameBoard() {
  const tiles = useGameStore((s) => s.tiles);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const revealTile = useGameStore((s) => s.revealTile);
  const focusedTile = useGameStore((s) => s.focusedTile);
  const setFocusedTile = useGameStore((s) => s.setFocusedTile);
  const cashOut = useGameStore((s) => s.cashOut);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const isPlaying = gameStatus === "playing";
  const gameOver = gameStatus === "lost" || gameStatus === "won";

  function handleClick(id: number) {
    if (!isPlaying) return;
    if (soundEnabled) soundManager.play("click");

    const tile = tiles[id];
    if (tile?.isMine) {
      if (soundEnabled) setTimeout(() => soundManager.play("explosion"), 100);
    } else {
      if (soundEnabled) setTimeout(() => soundManager.play("gem"), 50);
    }
    revealTile(id);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isPlaying) return;
    const col = focusedTile % GRID_COLS;
    const row = Math.floor(focusedTile / GRID_COLS);

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        if (col < GRID_COLS - 1) setFocusedTile(focusedTile + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (col > 0) setFocusedTile(focusedTile - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (row < GRID_COLS - 1) setFocusedTile(focusedTile + GRID_COLS);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (row > 0) setFocusedTile(focusedTile - GRID_COLS);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleClick(focusedTile);
        break;
      case "c":
      case "C":
        e.preventDefault();
        cashOut();
        break;
    }
  }

  if (gameStatus === "idle") {
    return (
      <div className="game-board-container">
        <div className="game-board-wrapper">
          <div
            className="grid gap-2.5 sm:gap-3 relative z-10"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            }}
          >
            {Array.from({ length: 25 }, (_, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-xl tile-idle"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.025, type: "spring", stiffness: 280, damping: 22 }}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              className="text-center px-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="text-4xl mb-3">💎</div>
              <p className="text-base sm:text-lg font-bold text-white/50 mb-1">
                Ready to Play?
              </p>
              <p className="text-xs sm:text-sm text-white/30">
                Set your bet & mines, then hit start
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-board-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="game-board-wrapper">
        <div
          className="grid gap-2.5 sm:gap-3 relative z-10"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          }}
        >
          {tiles.map((tile, i) => (
            <Tile
              key={tile.id}
              tile={tile}
              onClick={handleClick}
              gameOver={gameOver}
              disabled={!isPlaying}
              index={i}
              isFocused={isPlaying && focusedTile === tile.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
