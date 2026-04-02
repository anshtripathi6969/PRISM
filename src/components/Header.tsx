"use client";

import { useAuthStore } from "@/store/authStore";
import LoginModal from "./LoginModal";
import { LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import CoinBalance from "./CoinBalance";
import SoundToggle from "./SoundToggle";
import { motion } from "framer-motion";
import ResetPopup from "./ResetPopup";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <ResetPopup />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <header className="header-bar flex items-center justify-between px-4 sm:px-8 py-3.5">
        <Link href="/">
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="flex items-center gap-2.5 group transition-transform duration-300 hover:scale-105">
              <img 
                src="/logo.png?v=1" 
                alt="Logo" 
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
              />
              <div className="logo-text text-xl sm:text-2xl font-black tracking-tight pt-0.5">
                <span className="text-cyan-400">P</span>
                <span className="text-violet-400">R</span>
                <span className="text-fuchsia-400">I</span>
                <span className="text-cyan-400">S</span>
                <span className="text-violet-400">M</span>
              </div>
            </div>
          </motion.div>
        </Link>

        <motion.div
          className="flex items-center gap-2 sm:gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <CoinBalance />
          
          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest font-black text-white/40 leading-none mb-1">Authenticated</span>
                <span className="text-xs font-bold text-white tracking-wide">{user.username}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                <UserIcon size={20} />
              </div>
              <button 
                onClick={() => logout()}
                className="p-2.5 hover:bg-red-500/10 rounded-xl text-white/30 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              Login
            </button>
          )}

          <div className="flex items-center gap-1 ml-1 sm:ml-2">
            <SoundToggle />
          </div>
        </motion.div>
      </header>
    </>
  );
}
