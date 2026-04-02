"use client";

import CoinBalance from "./CoinBalance";
import SoundToggle from "./SoundToggle";
import { motion } from "framer-motion";
import ResetPopup from "./ResetPopup";

export default function Header() {
  return (
    <>
      <ResetPopup />
      <header className="header-bar flex items-center justify-between px-4 sm:px-8 py-3.5">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="logo-text text-2xl sm:text-3xl font-black tracking-tight">
            <span className="text-cyan-400">P</span>
            <span className="text-violet-400">R</span>
            <span className="text-fuchsia-400">I</span>
            <span className="text-cyan-400">S</span>
            <span className="text-violet-400">M</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-px h-5 bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold">

            </span>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 sm:gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <CoinBalance />
          <div className="flex items-center gap-1">
            <SoundToggle />
          </div>
        </motion.div>
      </header>
    </>
  );
}
