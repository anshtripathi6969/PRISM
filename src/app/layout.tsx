import type { Metadata } from "next";
import "./globals.css";
import MusicWrapper from "@/components/MusicWrapper";

export const metadata: Metadata = {
  title: "PRISM — Premium Edition",
  description:
    "A premium multi-game casino platform with stunning neon visuals, smooth animations, and a virtual coin economy. Reveal gems, avoid mines, and climb the tower.",
  keywords: ["mines", "tower", "game", "gems", "prism", "casino"],
  openGraph: {
    title: "PRISM — Premium Edition",
    description: "The ultimate high-stakes simulation. A premium web game experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col pt-safe bg-[#09090d]">
        {children}
        <MusicWrapper />
      </body>
    </html>
  );
}
