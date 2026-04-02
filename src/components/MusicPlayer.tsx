"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YouTube, { YouTubePlayer } from "react-youtube";

interface Track {
  title: string;
  artist: string;
  src?: string;
  videoId?: string;
}

const DEFAULT_PLAYLIST: Track[] = [
  {
    title: "Admirin' You",
    artist: "Karan Aujla x Ikky",
    src: "/Admirin' You (Official Video) Karan Aujla _ Ikky _ Making Memories _ Latest Punjabi Songs 2023 - (320 Kbps).mp3"
  },
  {
    title: "For A Reason",
    artist: "Karan Aujla x Tania",
    src: "/For A Reason (Official Video) Karan Aujla _ Tania  _ Ikky _ Latest Punjabi Songs 2025 - (320 Kbps).mp3"
  },
  {
    title: "MI AMOR",
    artist: "Sharn x Meet",
    src: "/MI AMOR - SHARN _ MEET _ PRG (OFFICIAL VIDEO) LATEST PUNJABI SONGS 2025 - (320 Kbps).mp3"
  },
  {
    title: "Calm Down",
    artist: "Rema, Selena Gomez",
    src: "/Rema, Selena Gomez - Calm Down (Official Music Video) - (320 Kbps).mp3"
  },
  {
    title: "Baby One More Time",
    artist: "The Marías",
    src: "/The Marías - Baby One More Time - (320 Kbps).mp3"
  }
];

export default function MusicPlayer() {
  const [playerState, setPlayerState] = useState<{
    playlist: Track[];
    index: number;
    isPlaying: boolean;
  }>({
    playlist: DEFAULT_PLAYLIST,
    index: 0,
    isPlaying: false
  });

  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Persistence & Initialization
  useEffect(() => {
    setMounted(true);
    
    const savedPlaylist = localStorage.getItem("prism_playlist");
    const savedIndex = localStorage.getItem("prism_track_index");
    
    let initialPlaylist = DEFAULT_PLAYLIST;
    let initialIndex = 0;

    if (savedPlaylist) {
      try {
        initialPlaylist = JSON.parse(savedPlaylist);
      } catch (e) { console.error("Restore failed", e); }
    }
    
    if (savedIndex) {
      const idx = parseInt(savedIndex);
      if (!isNaN(idx) && idx < initialPlaylist.length) initialIndex = idx;
    }

    setPlayerState(prev => ({ 
      ...prev, 
      playlist: initialPlaylist, 
      index: initialIndex 
    }));

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.3;
    }
  }, []);

  // Save changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("prism_playlist", JSON.stringify(playerState.playlist));
    localStorage.setItem("prism_track_index", playerState.index.toString());
  }, [playerState.playlist, playerState.index, mounted]);

  const { playlist, index, isPlaying } = playerState;
  const track = playlist[index] || DEFAULT_PLAYLIST[0];

  // Atomic Track Control
  useEffect(() => {
    if (!mounted) return;

    // Local Audio Sync
    if (audioRef.current) {
      if (track.src) {
        const fullSrc = window.location.origin + track.src;
        if (audioRef.current.src !== fullSrc) {
          audioRef.current.src = track.src;
          setProgress(0);
        }
        
        if (isPlaying) {
          audioRef.current.play().catch(e => {
            if (e.name !== "AbortError") console.warn("Audio play blocked");
          });
        } else {
          audioRef.current.pause();
        }
      } else {
        audioRef.current.pause();
      }
    }

    // YouTube Play/Pause Sync
    if (track.videoId && ytPlayerRef.current) {
      try {
        if (typeof ytPlayerRef.current.playVideo === 'function' && typeof ytPlayerRef.current.pauseVideo === 'function') {
          if (isPlaying) ytPlayerRef.current.playVideo();
          else ytPlayerRef.current.pauseVideo();
        }
      } catch (e) {}
    }

    // Halt YouTube if switching to Local track
    if (track.src && ytPlayerRef.current) {
      try {
        if (typeof ytPlayerRef.current.pauseVideo === 'function') {
          ytPlayerRef.current.pauseVideo();
        }
      } catch (e) {}
    }
  }, [index, playlist, isPlaying, mounted, track.src, track.videoId]);

  // YouTube Progress Polling
  useEffect(() => {
    if (track.videoId && isPlaying && mounted) {
      progressInterval.current = setInterval(async () => {
        try {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
            const currentTime = await ytPlayerRef.current.getCurrentTime();
            const duration = await ytPlayerRef.current.getDuration();
            if (duration > 0) setProgress((currentTime / duration) * 100);
          }
        } catch (e) {}
      }, 500);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [track.videoId, isPlaying, mounted]);

  // HTML Audio Events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => playNext();
    const handleTimeUpdate = () => {
      if (audio.duration && !track.videoId) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [track.videoId, playlist, index]); // Re-bind when track type changes

  const playNext = () => {
    setPlayerState(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.playlist.length
    }));
  };

  const playPrev = () => {
    setPlayerState(prev => ({
      ...prev,
      index: prev.index === 0 ? prev.playlist.length - 1 : prev.index - 1
    }));
  };

  const togglePlay = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSeek = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    if (track.src && audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    } else if (track.videoId && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try {
        const duration = await ytPlayerRef.current.getDuration();
        ytPlayerRef.current.seekTo(percentage * duration, true);
        setProgress(percentage * 100);
      } catch (err) {}
    }
  };

  const executeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/music?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.videoId) {
        const newTrack: Track = {
          title: data.title,
          artist: data.artist || "YouTube",
          videoId: data.videoId
        };
        
        setPlayerState(prev => {
          const nextPlaylist = [...prev.playlist];
          const nextIndex = prev.index + 1;
          nextPlaylist.splice(nextIndex, 0, newTrack);
          return {
            ...prev,
            playlist: nextPlaylist,
            index: nextIndex,
            isPlaying: true
          };
        });
        
        setSearchQuery("");
        setShowSearch(false);
      }
    } catch (err) {
      console.error("Music Search Error:", err);
    } finally {
      setIsSearching(false);
    }
  };


  if (!mounted) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50 flex flex-col gap-1 bg-[#09090d]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.1)] rounded-2xl p-3 pr-4 transition-all duration-300 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ borderColor: "rgba(0, 240, 255, 0.6)", boxShadow: "0 0 60px rgba(0, 240, 255, 0.2)" }}
    >
      {/* Hidden YouTube Player (Headless Engine) */}
      <AnimatePresence mode="wait">
        {track.videoId && (
          <div key={track.videoId} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
            <YouTube 
              videoId={track.videoId}
              opts={{ 
                playerVars: { 
                  autoplay: 1, 
                  controls: 0, 
                  disablekb: 1,
                  modestbranding: 1
                } 
              }}
              onReady={(e) => {
                ytPlayerRef.current = e.target;
                e.target.setVolume(30);
                if (isPlaying) e.target.playVideo();
              }}
              onStateChange={(e) => {
                // 0 = ended, 1 = playing, 2 = paused
                if (e.data === 0) playNext();
                if (e.data === 1 && !isPlaying) setPlayerState(prev => ({ ...prev, isPlaying: true }));
                if (e.data === 2 && isPlaying) setPlayerState(prev => ({ ...prev, isPlaying: false }));
              }}
              onError={() => playNext()}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Sweeping Shimmer light effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite] pointer-events-none rounded-2xl" />

      {/* Expanded Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.form
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 8 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="overflow-hidden"
            onSubmit={executeSearch}
          >
            <div className="relative flex items-center">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search YouTube..."
                className="w-full bg-black/50 border border-white/10 rounded-lg py-1.5 pl-3 pr-8 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
                autoFocus
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="absolute right-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {/* Custom Glowing Vinyl Record */}
        <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black border border-white/10 shadow-lg shrink-0">
          <motion.div
            className="w-full h-full rounded-full border-[4px] border-black/80 flex items-center justify-center"
            style={{ 
              background: "radial-gradient(circle, rgba(30,30,30,1) 0%, rgba(10,10,10,1) 100%)",
              boxShadow: "inset 0 0 5px rgba(255,255,255,0.1)"
            }}
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute w-[85%] h-[85%] rounded-full border border-white/5" />
            <div className="absolute w-[65%] h-[65%] rounded-full border border-white/5" />
            <div className="w-[45%] h-[45%] rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500" />
            <div className="absolute w-1.5 h-1.5 bg-[#09090d] rounded-full border border-black/50" />
          </motion.div>
          {isPlaying && (
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Track Info & Animated Visualizer */}
        <div className="flex flex-col justify-center min-w-[140px] max-w-[140px]">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest leading-none mt-0.5">
              {isPlaying ? (track.videoId ? "YT STREAM" : "NOW PLAYING") : "PAUSED"}
            </span>
            {/* Audio Visualizer Bars */}
            <div className="flex items-end gap-[2px] h-[10px]">
              {[1, 2, 3].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-1 bg-cyan-400 rounded-t-sm"
                  initial={{ height: "20%" }}
                  animate={isPlaying ? { height: ["20%", "100%", "40%", "80%", "20%"] } : { height: "20%" }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: bar * 0.15, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
          
          <div className="overflow-hidden w-full relative h-[18px]">
            <motion.div
              className="text-xs text-white/90 whitespace-nowrap font-medium"
              animate={isHovered ? { x: [-10, -100] } : { x: 0 }}
              transition={isHovered ? { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "linear" } : { duration: 0.3 }}
            >
              <span className="font-bold text-white">{track.title}</span> <span className="text-white/40 mx-1">•</span> <span className="text-white/60">{track.artist}</span>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 ml-1">
          {/* Search Button Toggle */}
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors mr-1 ${showSearch ? 'text-cyan-400' : 'text-white/30'}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <button onClick={playPrev} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button onClick={togglePlay} className="w-9 h-9 flex items-center justify-center rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.1)] active:scale-95 transition-all text-cyan-400">
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button onClick={playNext} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mt-1 cursor-pointer overflow-hidden relative group/progress" onClick={handleSeek}>
        <motion.div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full" style={{ width: `${progress}%` }} layout />
        <div className="absolute top-0 bottom-0 w-2 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity -ml-1 shadow-[0_0_10px_white]" style={{ left: `${progress}%` }} />
      </div>
    </motion.div>
  );
}
