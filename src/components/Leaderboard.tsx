"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, User } from "lucide-react";
import CyberAvatar from "./CyberAvatar";

export default function Leaderboard() {
  const leaders = useQuery(api.users.getLeaderboard);

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 sm:mt-24 p-6 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500" />
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full" />

      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            <Trophy className="text-white fill-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-1">Global Scoreboard</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Real-time Performance Ranking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
          <TrendingUp size={12} /> Live Updates Active
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="grid grid-cols-12 px-4 mb-4 text-[10px] font-black uppercase tracking-widest text-white/20">
          <div className="col-span-1">Rank</div>
          <div className="col-span-6 ml-6">User</div>
          <div className="col-span-3 text-right">Rounds</div>
          <div className="col-span-2 text-right">Winnings</div>
        </div>

        <div className="space-y-2">
          {!leaders ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-20 text-white/20 font-bold uppercase tracking-widest text-xs italic">
              No champions yet. Be the first to win!
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {leaders.map((user, index) => (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    grid grid-cols-12 items-center px-4 py-4 rounded-xl border transition-all duration-300
                    ${index === 0 ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/20' :
                      index === 1 ? 'bg-gradient-to-r from-zinc-400/10 to-transparent border-zinc-400/20' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400/10 to-transparent border-orange-400/20' :
                          'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}
                  `}
                >
                  <div className="col-span-1 flex items-center justify-center font-black text-lg italic text-white/40">
                    {index === 0 ? <Crown className="text-amber-400 fill-amber-400" size={20} /> :
                      index === 1 ? <Medal className="text-zinc-400 fill-zinc-400" size={18} /> :
                        index === 2 ? <Medal className="text-orange-400 fill-orange-400" size={18} /> :
                          `#${index + 1}`}
                  </div>

                    <div className="col-span-6 flex items-center gap-3 ml-6 overflow-hidden">
                      <CyberAvatar totalWinnings={user.totalWinnings} size="sm" />
                      <span className={`font-bold truncate ${index === 0 ? 'text-amber-100' : 'text-white/80'}`}>
                      {user.username}
                    </span>
                  </div>

                  <div className="col-span-3 text-right font-medium text-white/40 text-sm">
                    {user.gamesPlayed}
                  </div>

                  <div className="col-span-2 text-right">
                    <span className={`font-black text-sm ${index === 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {user.totalWinnings.toFixed(0)} 🪙
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
