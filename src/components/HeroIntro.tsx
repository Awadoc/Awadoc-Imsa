"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const ReadyContext = createContext<() => void>(() => {});
export const useHeroReady = () => useContext(ReadyContext);

// The hero's two columns (the words and the helix card). They stay hidden until the helix reports its first drawn frame, and then rise in together (the
// .hero-gate / .hero-in rules in globals.css). If the helix never reports (no WebGL), everything comes in after a short wait.
export default function HeroIntro({ className, children }: { className?: string; children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const t = setTimeout(markReady, 1500);
    return () => clearTimeout(t);
  }, [markReady]);

  return (
    <ReadyContext.Provider value={markReady}>
      <div className={`hero-gate ${className ?? ""}`} {...(ready ? { "data-ready": "" } : {})}>
        {children}
      </div>
    </ReadyContext.Provider>
  );
}
