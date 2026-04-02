"use client";

import { useDiceStore } from "@/store/diceStore";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { RefreshCcw, Percent } from "lucide-react";

export default function DiceSlider() {
  const { target, setTarget, status, lastRoll, condition, setCondition } = useDiceStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isPlaying = status === "playing";

  // Calculate stats
  const winChance = condition === "over" ? 100 - target : target;
  const multiplier = 99 / winChance;

  const handleSliderChange = (clientX: number) => {
    if (isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
    const percentage = Math.round((x / rect.width) * 100);
    
    // Clamp between 2 and 98 to keep house edge/payouts sane
    setTarget(Math.min(98, Math.max(2, percentage)));
  };

  const toggleCondition = () => {
    if (isPlaying) return;
    setCondition(condition === "over" ? "under" : "over");
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-5 select-none">
      
      {/* Upper Slider Container */}
      <div className="relative pt-8 pb-4 px-6 bg-[#0d0d1a]/40 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl">
        
        {/* Markers Labels */}
        <div className="absolute top-2 inset-x-12 flex justify-between px-2">
            {[0, 25, 50, 75, 100].map((val) => (
                <span key={val} className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">{val}</span>
            ))}
        </div>

        <div 
          ref={containerRef}
          className="relative w-full h-11 bg-black/60 rounded-xl cursor-pointer flex items-center group/slider overflow-hidden border border-white/5 shadow-inner"
          onMouseDown={(e) => handleSliderChange(e.clientX)}
          onMouseMove={(e) => e.buttons === 1 && handleSliderChange(e.clientX)}
        >
          {/* Dual Color Track Segments */}
          <div className="absolute inset-x-0 inset-y-0 flex">
            {/* Left side of handle */}
            <div 
              className={`h-full transition-all duration-300 ${
                condition === "under" ? "bg-emerald-500 shadow-[inset_-10px_0_20px_rgba(16,185,129,0.2)]" : "bg-red-500 shadow-[inset_10px_0_20px_rgba(239,68,68,0.2)]"
              }`}
              style={{ width: `${target}%` }}
            />
            {/* Right side of handle */}
            <div 
              className={`h-full transition-all duration-300 ${
                condition === "over" ? "bg-emerald-500 shadow-[inset_10px_0_20px_rgba(16,185,129,0.2)]" : "bg-red-500 shadow-[inset_-10px_0_20px_rgba(239,68,68,0.2)]"
              }`}
              style={{ width: `${100 - target}%` }}
            />
          </div>

          {/* The Handle (Stake Style) */}
          <motion.div
              className={`absolute w-9 h-9 rounded-lg border-2 border-[#2b2b47] shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform
                  ${isPlaying ? "bg-white/10 opacity-50" : "bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]"}`}
              style={{ left: `calc(${target}% - 1.125rem)` }}
              animate={{ left: `calc(${target}% - 1.125rem)` }}
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
          >
              <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-white/40 rounded-full" />
                  <div className="w-0.5 h-3 bg-white/40 rounded-full" />
                  <div className="w-0.5 h-3 bg-white/40 rounded-full" />
              </div>
          </motion.div>

          {/* Result Indicator (Lands on the track) */}
          <AnimatePresence>
            {!isPlaying && status !== "idle" && (
                <motion.div
                    initial={{ y: -30, scale: 0, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    className={`absolute h-9 w-9 top-1 -mt-px border-2 border-[#0d0d1a] z-30 rounded-xl shadow-2xl flex flex-col items-center justify-center backdrop-blur-xl ${
                        status === "won" ? "bg-emerald-500 text-white shadow-emerald-500/50" : "bg-white/90 text-black shadow-white/20"
                    }`}
                    style={{ left: `calc(${lastRoll}% - 1.125rem)` }}
                >
                    <span className="text-[9px] font-black leading-none">{lastRoll.toFixed(2)}</span>
                    <div className={`absolute -top-0.5 w-1 h-1 rounded-full ${status === "won" ? "bg-white shadow-[0_0_5px_white]" : "bg-red-500 shadow-[0_0_5px_red]"}`} />
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0d0d1a]/60 backdrop-blur-3xl border border-white/5 p-2 rounded-2xl shadow-2xl relative">
        {/* Multiplier */}
        <div className="group flex flex-col gap-1.5 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-cyan-500/20 transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 px-1">Multiplier</span>
            <div className="relative flex items-center bg-black/40 rounded-lg px-3 py-2 border border-white/5">
                <span className="flex-1 text-xs font-black text-white">{multiplier.toFixed(4)}</span>
                <span className="text-[10px] font-black text-white/20 ml-2">×</span>
            </div>
        </div>

        {/* Target Value */}
        <div className="group flex flex-col gap-1.5 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-cyan-500/20 transition-all">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{condition === "over" ? "Roll Over" : "Roll Under"}</span>
                <button 
                  onClick={toggleCondition}
                  disabled={isPlaying}
                  className="p-1 hover:text-cyan-400 text-white/20 transition-colors disabled:opacity-0"
                >
                    <RefreshCcw size={10} />
                </button>
            </div>
            <div className="relative flex items-center bg-black/40 rounded-lg px-3 py-2 border border-white/5">
                <span className="flex-1 text-xs font-black text-white">{target.toFixed(2)}</span>
            </div>
        </div>

        {/* Win Chance */}
        <div className="group flex flex-col gap-1.5 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-cyan-500/20 transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 px-1">Win Chance</span>
            <div className="relative flex items-center bg-black/40 rounded-lg px-3 py-2 border border-white/5">
                <span className="flex-1 text-xs font-black text-white">{winChance.toFixed(4)}</span>
                <Percent size={10} className="text-white/20 ml-2" />
            </div>
        </div>

        {/* Decorative shadow line */}
        <div className="absolute -bottom-1 inset-x-8 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-sm" />
      </div>

    </div>
  );
}
