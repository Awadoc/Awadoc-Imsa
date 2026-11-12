"use client";

import HelixBackground from "@/components/HelixBackground";
import { useHeroReady } from "@/components/HeroIntro";

// The dark card with the DNA helix on the home page's hero. It tells the hero when the helix has drawn its first frame, so the card and the words
// come in at the same moment.
export default function HeroHelix() {
  const ready = useHeroReady();
  return (
    <div aria-hidden="true" className="hero-in relative aspect-5/4 overflow-hidden rounded-3xl bg-[#0a0d12]">
      <HelixBackground className="absolute inset-0 size-full" offsetX={0} onReady={ready} />
    </div>
  );
}
