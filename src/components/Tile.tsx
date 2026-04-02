"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Tile as TileType } from "@/types/game";

interface TileProps {
  tile: TileType;
  onClick: (id: number) => void;
  gameOver: boolean;
  disabled: boolean;
  index: number;
  isFocused: boolean;
}

function GemIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2L28 12L16 30L4 12L16 2Z"
        fill="url(#gem-grad)"
        stroke="rgba(0,255,200,0.5)"
        strokeWidth="0.8"
      />
      <path d="M4 12H28L16 30L4 12Z" fill="url(#gem-grad2)" opacity="0.6" />
      <path d="M8 6L16 2L24 6L28 12H4L8 6Z" fill="rgba(255,255,255,0.2)" />
      <path d="M16 2L16 30" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <path d="M4 12L16 18L28 12" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <defs>
        <linearGradient id="gem-grad" x1="16" y1="2" x2="16" y2="30">
          <stop stopColor="#00ffd0" />
          <stop offset="0.5" stopColor="#00e6b0" />
          <stop offset="1" stopColor="#00b894" />
        </linearGradient>
        <linearGradient id="gem-grad2" x1="16" y1="12" x2="16" y2="30">
          <stop stopColor="#00d2a0" />
          <stop offset="1" stopColor="#006b5a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MineIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" fill="url(#mine-grad)" />
      <circle cx="16" cy="16" r="6.5" fill="#2a0000" opacity="0.6" />
      <circle cx="16" cy="16" r="3" fill="#ff4757" opacity="0.4" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#ff4757" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="26" x2="16" y2="30" stroke="#ff4757" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="2" y1="16" x2="6" y2="16" stroke="#ff4757" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="26" y1="16" x2="30" y2="16" stroke="#ff4757" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6.3" y1="6.3" x2="9" y2="9" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="23" x2="25.7" y2="25.7" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" />
      <line x1="6.3" y1="25.7" x2="9" y2="23" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="9" x2="25.7" y2="6.3" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.25)" />
      <defs>
        <radialGradient id="mine-grad" cx="0.35" cy="0.35" r="0.65">
          <stop stopColor="#ff7675" />
          <stop offset="1" stopColor="#b71c1c" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function Tile({
  tile,
  onClick,
  gameOver,
  disabled,
  index,
  isFocused,
}: TileProps) {
  const isClickable = !tile.isRevealed && !disabled && !gameOver;

  const tileClass = tile.isRevealed
    ? tile.isMine
      ? "tile-mine"
      : "tile-gem"
    : isClickable
    ? "tile-default cursor-pointer"
    : "tile-disabled cursor-not-allowed";

  return (
    <motion.button
      className={`
        relative aspect-square rounded-xl overflow-hidden
        flex items-center justify-center
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        ${tileClass}
        ${isFocused && isClickable ? "ring-2 ring-cyan-400/70" : ""}
      `}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          delay: index * 0.025,
          type: "spring",
          stiffness: 280,
          damping: 22,
        },
      }}
      whileHover={
        isClickable
          ? { scale: 1.07, transition: { type: "spring", stiffness: 400, damping: 15 } }
          : undefined
      }
      whileTap={
        isClickable
          ? { scale: 0.92, transition: { type: "spring", stiffness: 500, damping: 20 } }
          : undefined
      }
      onClick={() => isClickable && onClick(tile.id)}
      aria-label={
        tile.isRevealed
          ? tile.isMine
            ? "Mine revealed"
            : "Gem revealed"
          : `Tile ${tile.id + 1}, unrevealed`
      }
      disabled={!isClickable}
    >
      {!tile.isRevealed && (
        <div className="tile-question-mark font-bold select-none">?</div>
      )}

      <AnimatePresence>
        {tile.isRevealed && !tile.isMine && (
          <motion.div
            key="gem"
            initial={{ scale: 0.3, opacity: 0, rotate: -30 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: 0,
              transition: { type: "spring", stiffness: 350, damping: 16 },
            }}
            className="gem-glow"
          >
            <GemIcon />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tile.isRevealed && tile.isMine && (
          <motion.div
            key="mine"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.4, 1],
              opacity: 1,
              transition: { duration: 0.45, times: [0, 0.55, 1] },
            }}
            className="mine-glow"
          >
            <MineIcon />
          </motion.div>
        )}
      </AnimatePresence>

      {isClickable && (
        <div className="absolute inset-0 tile-hover-overlay opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
      )}
    </motion.button>
  );
}
