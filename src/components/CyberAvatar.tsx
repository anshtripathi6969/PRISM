"use client";

import { User, Zap, Star, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface CyberAvatarProps {
  totalWinnings: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CyberAvatar({ totalWinnings, size = "md", className = "" }: CyberAvatarProps) {
  // Determine Tier and Aura Class
  let auraClass = "aura-bronze text-white/20";
  let TierIcon = User;
  let iconSize = 16;
  let bgClass = "bg-white/5";

  if (totalWinnings >= 100000) {
    auraClass = "aura-lightning text-white";
    TierIcon = Zap;
    bgClass = "bg-black";
  } else if (totalWinnings >= 10000) {
    auraClass = "aura-violet-pulse text-violet-400";
    TierIcon = Shield;
    bgClass = "bg-violet-950/20";
  } else if (totalWinnings >= 1000) {
    auraClass = "aura-cyan text-cyan-400";
    TierIcon = Star;
    bgClass = "bg-cyan-950/10";
  }

  // Size mapping
  const sizeMap = {
    sm: { container: "w-8 h-8 rounded-lg", icon: 14 },
    md: { container: "w-10 h-10 rounded-xl", icon: 18 },
    lg: { container: "w-14 h-14 rounded-2xl", icon: 24 }
  };

  const { container: containerSize, icon: mappedIconSize } = sizeMap[size];

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <motion.div
        initial={false}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`
          ${containerSize} ${bgClass} ${auraClass}
          flex items-center justify-center transition-all duration-500
        `}
      >
        <TierIcon size={mappedIconSize} />
        
        {/* Level Indicator (Subtle) */}
        {totalWinnings >= 1000 && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background border border-white/10 rounded-full flex items-center justify-center">
            <div className={`w-1.5 h-1.5 rounded-full ${
              totalWinnings >= 100000 ? "bg-white animate-ping" : 
              totalWinnings >= 10000 ? "bg-violet-400" : "bg-cyan-400"
            }`} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
