"use client";

import { ReactNode, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Use the real URL if available, otherwise a dummy URL to prevent build crashes
  // next build tries to prerender pages and needs a provider for Convex hooks
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://build-time-dummy.convex.cloud";

  const convex = useMemo(() => {
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
