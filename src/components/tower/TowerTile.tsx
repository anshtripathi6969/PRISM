"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { TowerTile as TowerTileType } from "@/types/tower";

interface TowerTileProps {
  tile: TowerTileType;
  onClick: (row: number, col: number) => void;
  isActiveRow: boolean;
  isAboveActive: boolean;
  gameOver: boolean;
  rowIndex: number;
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="url(#check-grad)" opacity="0.9" />
      <path
        d="M8 12.5L10.5 15L16 9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <radialGradient id="check-grad" cx="0.4" cy="0.4" r="0.6">
          <stop stopColor="#00ffc8" />
          <stop offset="1" stopColor="#00b894" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function SkullIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="11" r="9" fill="url(#skull-grad)" opacity="0.9" />
      <circle cx="9" cy="10" r="2" fill="#1a0000" />
      <circle cx="15" cy="10" r="2" fill="#1a0000" />
      <path
        d="M9.5 15.5L10.5 14.5L11.5 15.5L12.5 14.5L13.5 15.5L14.5 14.5"
        stroke="#1a0000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <defs>
        <radialGradient id="skull-grad" cx="0.4" cy="0.4" r="0.6">
          <stop stopColor="#ff7675" />
          <stop offset="1" stopColor="#c0392b" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function TowerTile({
  tile,
  onClick,
  isActiveRow,
  isAboveActive,
  gameOver,
  rowIndex,
}: TowerTileProps) {
  const isClickable = isActiveRow && !tile.isRevealed && !gameOver;
  const isFuture = isAboveActive && !gameOver;

  let tileClass = "tower-tile-locked";
  if (tile.isRevealed) {
    tileClass = tile.isSafe ? "tower-tile-safe" : "tower-tile-danger";
  } else if (isClickable) {
    tileClass = "tower-tile-active";
  } else if (isFuture) {
    tileClass = "tower-tile-future";
  }

  return (
    <motion.button
      className={`
        relative rounded-xl overflow-hidden
        flex items-center justify-center
        h-14 sm:h-16
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        ${tileClass}
        ${isClickable ? "cursor-pointer" : "cursor-default"}
      `}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          delay: rowIndex * 0.04,
          type: "spring",
          stiffness: 280,
          damping: 22,
        },
      }}
      whileHover={
        isClickable
          ? { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 15 } }
          : undefined
      }
      whileTap={
        isClickable
          ? { scale: 0.93, transition: { type: "spring", stiffness: 500, damping: 20 } }
          : undefined
      }
      onClick={() => isClickable && onClick(tile.row, tile.col)}
      disabled={!isClickable}
      aria-label={
        tile.isRevealed
          ? tile.isSafe ? "Safe tile" : "Danger tile"
          : isClickable ? `Row ${tile.row + 1} tile ${tile.col + 1}` : "Locked tile"
      }
    >
      <AnimatePresence>
        {tile.isRevealed && tile.isSafe && (
          <motion.div
            key="safe"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 350, damping: 16 } }}
            className="gem-glow"
          >
            <CheckIcon />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tile.isRevealed && !tile.isSafe && (
          <motion.div
            key="danger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.3, 1],
              opacity: 1,
              transition: { duration: 0.4, times: [0, 0.55, 1] },
            }}
            className="mine-glow"
          >
            <SkullIcon />
          </motion.div>
        )}
      </AnimatePresence>

      {isClickable && !tile.isRevealed && (
        <motion.div
          className="text-sm font-bold text-cyan-400/60"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ?
        </motion.div>
      )}
    </motion.button>
  );
}
