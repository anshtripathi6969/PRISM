"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1.2;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-[#050508] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Pulsing Aura */}
          <motion.div
            className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full scale-150"
            animate={{
              scale: [1.2, 1.6, 1.2],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <img
            src="/logo.png?v=1"
            alt="PRISM"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          />

          {/* Cyber-Scan Line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 z-20 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Text Branding */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black tracking-[0.3em] uppercase text-white mb-2">
            <span className="text-cyan-400">P</span>
            <span className="text-violet-400">R</span>
            <span className="text-fuchsia-400">I</span>
            <span className="text-cyan-400">S</span>
            <span className="text-violet-400">M</span>
          </h1>
          <div className="flex items-center gap-3 justify-center">
            <span className="w-8 h-px bg-white/10" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30">Go and lose the money...</p>
            <span className="w-8 h-px bg-white/10" />
          </div>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="w-64 sm:w-80 h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
          {/* Animated Stream */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-600 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            style={{ width: `${progress}%` }}
          />

          {/* Moving Light Point */}
          <motion.div
            className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ left: ["-20%", "120%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Progress Percentage */}
        <motion.p
          className="mt-3 text-[10px] font-mono font-bold text-cyan-400/60 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Math.round(progress)}% Optimized
        </motion.p>
      </div>

      {/* Decorative Grid Over */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </motion.div>
  );
}
