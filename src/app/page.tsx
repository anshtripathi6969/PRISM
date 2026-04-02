"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import Header from "@/components/Header";
import { soundManager } from "@/lib/sounds";

const games = [
  {
    id: "mines",
    title: "Mines",
    emoji: "💎",
    description: "Reveal gems, avoid mines. Each safe pick increases your multiplier.",
    href: "/mines",
    gradient: "from-cyan-500/20 via-violet-500/10 to-fuchsia-500/20",
    borderGlow: "hover:border-cyan-400/40",
    shadowGlow: "hover:shadow-[0_0_40px_rgba(0,240,255,0.15)]",
    iconBg: "bg-cyan-500/10",
    tag: "5×5 Grid",
    tagColor: "text-cyan-400 bg-cyan-500/10",
  },
  {
    id: "tower",
    title: "Tower",
    emoji: "🗼",
    description: "Climb the tower floor by floor. Higher you go, bigger the reward.",
    href: "/tower",
    gradient: "from-amber-500/20 via-orange-500/10 to-red-500/20",
    borderGlow: "hover:border-amber-400/40",
    shadowGlow: "hover:shadow-[0_0_40px_rgba(255,200,0,0.15)]",
    iconBg: "bg-amber-500/10",
    tag: "8 Floors",
    tagColor: "text-amber-400 bg-amber-500/10",
  },
];

function Particles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 1.5,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 20,
        color:
          i % 3 === 0
            ? "rgba(0, 240, 255, 0.2)"
            : i % 3 === 1
            ? "rgba(139, 92, 246, 0.18)"
            : "rgba(217, 70, 239, 0.15)",
      }))
    );
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

const jokes = [
  "99% of gamblers quit right before they hit the jackpot. Keep clicking. 💎",
  "A family can be rebuilt, but that 1,000x multiplier is once in a lifetime.",
  "Your landlord called. He said skip rent and go all-in on the middle tile.",
  "It's only a gambling problem if you're losing.",
  "We don't guarantee payouts, but we do guarantee an elevated heart rate.",
  "Math says the house always wins. Good thing you don't know math.",
  "Better odds than your crypto portfolio.",
  "The next tile is definitely safe. Probably.",
  "Just one more round. You can sleep tomorrow.",
];

function JokeCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % jokes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 relative w-full max-w-lg mx-auto flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="text-sm sm:text-base text-white/60 font-medium italic absolute w-full"
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
          transition={{ duration: 0.5 }}
        >
          "{jokes[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const darkMode = useGameStore((s) => s.darkMode);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="bg-pattern" />
      <div className="bg-grid" />
      <Particles />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16">
          {/* Hero */}
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
          >
            <motion.div
              className="text-5xl sm:text-7xl font-black tracking-tight mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <span className="logo-text">
                <span className="text-cyan-400">P</span>
                <span className="text-violet-400">R</span>
                <span className="text-fuchsia-400">I</span>
                <span className="text-cyan-400">S</span>
                <span className="text-violet-400">M</span>
              </span>
            </motion.div>
            
            <JokeCarousel />
            
          </motion.div>

          {/* Game Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full max-w-2xl">
            {games.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}
              >
                <Link href={game.href} className="block group">
                  <div
                    className={`
                      game-card relative overflow-hidden rounded-2xl p-6 sm:p-8
                      border border-white/8 bg-gradient-to-br ${game.gradient}
                      ${game.borderGlow} ${game.shadowGlow}
                      transition-all duration-500
                      hover:scale-[1.02] hover:-translate-y-1
                    `}
                  >
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent blur-2xl" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-14 h-14 rounded-xl ${game.iconBg} flex items-center justify-center text-3xl`}
                        >
                          {game.emoji}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${game.tagColor}`}
                        >
                          {game.tag}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-white transition-colors">
                        {game.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-white/35 leading-relaxed mb-5">
                        {game.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs font-semibold text-white/50 group-hover:text-white/70 transition-colors">
                        <span>Play Now</span>
                        <motion.span
                          className="inline-block"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.03]">
                      <div className="text-8xl leading-none">{game.emoji}</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon row */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-3 justify-center text-xs text-white/20">
              <div className="w-12 h-px bg-white/10" />
              <span className="uppercase tracking-widest font-semibold">More games coming soon</span>
              <div className="w-12 h-px bg-white/10" />
            </div>
            <div className="flex items-center justify-center gap-3 mt-4">
              {["🎲 Dice", "📈 Crash", "🃏 HiLo"].map((g) => (
                <span
                  key={g}
                  className="text-[10px] font-semibold text-white/15 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]"
                >
                  {g}
                </span>
              ))}
            </div>
          </motion.div>
        </main>

        <footer className="text-center py-6 text-[10px] text-white/20 relative z-10 max-w-2xl mx-auto">
          <p className="mb-2">Premium Gaming · The ultimate high-stakes simulation</p>
          <p className="opacity-50 italic">
            Disclaimer: We are not responsible for any dashed hopes, broken monitors, 
            or the sudden urge to take a second mortgage. Calm down and pick the next tile.
          </p>
        </footer>
      </div>
    </div>
  );
}
