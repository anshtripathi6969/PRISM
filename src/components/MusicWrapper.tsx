"use client";

import dynamic from "next/dynamic";

const MusicPlayer = dynamic(() => import("./MusicPlayer"), { 
  ssr: false,
  loading: () => null 
});

export default function MusicWrapper() {
  return <MusicPlayer />;
}
