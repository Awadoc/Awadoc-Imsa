import { create } from "zustand";

// The visitor's cookie choice. "essential" is the default: closing the banner counts as essential only, and nothing optional is ever set until
// "analytics" is chosen. The choice is kept in the browser for up to 12 months, then the banner asks again.
export type CookieChoice = "analytics" | "essential";

const KEY = "awadoc-cookie-choice";
const YEAR = 365 * 24 * 60 * 60 * 1000;

interface CookieState {
  open: boolean;
  choice: CookieChoice | null;
  init: () => void;
  choose: (choice: CookieChoice) => void;
  openSettings: () => void;
}

export const useCookieStore = create<CookieState>((set) => ({
  open: false,
  choice: null,
  // Reads the saved choice; with none (or one older than 12 months) the banner opens.
  init: () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as { choice?: string; at?: number } | null;
      if (saved && (saved.choice === "analytics" || saved.choice === "essential") && typeof saved.at === "number" && Date.now() - saved.at < YEAR) {
        set({ choice: saved.choice, open: false });
        return;
      }
    } catch {
      // Storage can be blocked; the banner then shows on every visit.
    }
    set({ choice: null, open: true });
  },
  choose: (choice) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice, at: Date.now() }));
    } catch {
      // Not saved; the choice still applies until the page is closed.
    }
    set({ choice, open: false });
  },
  // Opens the banner again so the choice can be changed (no link to it yet).
  openSettings: () => set({ open: true }),
}));
