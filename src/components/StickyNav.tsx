"use client";

import { useEffect, useState, type ReactNode } from "react";

// The nav: a floating white pill (a card in the dark theme), 1280px at most, with a very light shadow. It is fixed to the top of the screen, so it
// follows you as you scroll, and a spacer of the same height keeps the page content where it was. On the home page the spacer is the same grey as
// the hero (`band`), so the pill sits on one continuous grey area. Once the page is scrolled the pill turns to frosted glass: see-through, with the
// page blurred behind it.
export default function StickyNav({ children, spacer = true, band = false }: { children: ReactNode; spacer?: boolean; band?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      {/* Takes the nav's place in the layout: 16px above the pill and the pill's own 64px (plus 24px more on pages that are not on the grey band). */}
      {spacer && <div aria-hidden="true" className={band ? "h-[calc(5rem+env(safe-area-inset-top))] bg-band" : "h-[calc(6.5rem+env(safe-area-inset-top))]"} />}

      <nav aria-label="Main" className="fixed inset-x-0 top-0 z-30 px-6 pt-[max(1rem,env(safe-area-inset-top))] max-sm:px-3">
        <div
          className={`relative mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full py-2.5 pr-3 pl-6 ring-1 transition-[background-color,box-shadow,backdrop-filter,--tw-ring-color] duration-300 max-sm:pl-4 motion-reduce:transition-none ${
            scrolled
              ? "bg-card/55 shadow-[0_8px_32px_rgba(16,24,40,0.10)] ring-white/50 backdrop-blur-xl backdrop-saturate-150 in-data-[theme=dark]:bg-card/50 in-data-[theme=dark]:ring-white/10"
              : "bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-line/60"
          }`}
        >
          {children}
        </div>
      </nav>
    </>
  );
}
