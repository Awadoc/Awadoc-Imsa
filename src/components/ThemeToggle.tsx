"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// Tells the phone browser which colour to use for its status bar / top edge.
function setBrowserColor(theme: Theme) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = theme === "dark" ? "#0a0d12" : "#ffffff";
}

// One round 44px button: it shows the sun in the light theme and the moon in the dark one, and switches between them.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem("theme");
    } catch {}
    // Landing on the site always opens in the light theme, whatever the device's own setting is. Only a choice made during this visit is kept.
    const initial: Theme = saved === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = initial;
    setBrowserColor(initial);
    setTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setBrowserColor(next);
    try {
      sessionStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  // Which icon shows follows the page's data-theme (set by a tiny script before the first paint), not React state, so it is right on the first frame.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      aria-pressed={theme === "dark"}
      className="inline-flex size-[var(--icon-btn,2.75rem)] cursor-pointer items-center justify-center rounded-full border border-line bg-card text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
    >
      <svg className="in-data-[theme=dark]:hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="hidden in-data-[theme=dark]:block" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
