"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookieStore } from "@/store/useCookieStore";

const button =
  "inline-flex min-h-btn min-w-[7.5rem] flex-1 cursor-pointer items-center justify-center rounded-[calc(14*var(--u))] border px-[0.9em] py-[0.45em] text-[calc(var(--text-btn)*0.92)] font-bold whitespace-nowrap transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500";

// Shown on a first visit. Two equal choices, nothing pre ticked; closing it counts as "Essential only".
// It eases in a moment after the page has loaded (rising and fading in) and eases out when a choice is made. On a phone it spans the screen's width.
export default function CookieBanner() {
  const { open, choice, init, choose } = useCookieStore();

  // `shown` drives the fade and rise; `present` keeps the banner mounted while it eases out.
  const [shown, setShown] = useState(false);
  const [present, setPresent] = useState(false);
  // The choice that was current when the banner opened, so the "current choice" line doesn't change while it closes.
  const [before, setBefore] = useState<typeof choice>(null);

  useEffect(() => init(), [init]);

  useEffect(() => {
    if (open) {
      setBefore(useCookieStore.getState().choice);
      setPresent(true);
      // A first visit waits 4 seconds so the page settles first; reopening from the footer is quick.
      const t = setTimeout(() => setShown(true), useCookieStore.getState().choice === null ? 4000 : 50);
      return () => clearTimeout(t);
    }
    setShown(false);
    const t = setTimeout(() => setPresent(false), 500);
    return () => clearTimeout(t);
  }, [open]);

  if (!present) return null;


  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      aria-hidden={!shown}
      className={`fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto max-h-[calc(100svh-2rem)] max-w-[20rem] overflow-y-auto rounded-[1.4rem] border border-ink/15 bg-bg p-[0.9rem] text-ink shadow-[0_24px_60px_-16px_rgba(0,0,0,0.45)] transition-[opacity,translate,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:inset-x-auto sm:bottom-5 sm:left-auto sm:right-[5vw] sm:mx-0 sm:w-[24rem] sm:max-w-none sm:rounded-3xl sm:p-[calc(20*var(--u))] ${shown ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-[0.97] opacity-0"}`}
    >
      {/* The title and the close button share one row, so the cross lines up with "Cookies". */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-[calc(var(--text-hero-sub)*0.95)] font-semibold leading-snug">Cookies</p>
        <button
          type="button"
          onClick={() => choose("essential")}
          aria-label="Close and keep essential cookies only"
          className="-mr-1.5 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="size-4">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <p className={`mt-[0.4em] text-[calc(var(--text-hero-sub)*0.86)] font-medium leading-relaxed tracking-[-0.03em] text-muted`}>
        We always use the cookies the site needs to work. With your consent we also use analytics cookies to see which pages help couples most. We never use advertising cookies.{" "}
        <Link href="/cookies" className="font-semibold text-ink underline underline-offset-4 transition-colors hover:text-brand">
          Cookie policy
        </Link>
      </p>
      <div className={`mt-[0.9em] flex flex-wrap gap-2`}>
        <button
          type="button"
          onClick={() => choose("analytics")}
          className={`${button} border-ink bg-ink text-bg hover:border-brand hover:bg-brand hover:text-[#07110c]`}
        >
          Accept analytics
        </button>
        <button type="button" onClick={() => choose("essential")} className={`${button} border-ink bg-transparent text-ink hover:border-brand hover:text-brand`}>
          Essential only
        </button>
      </div>
      {before && (
        <p className="mt-[0.6em] text-center text-[calc(var(--text-hero-sub)*0.78)] font-medium text-muted">
          Your current choice: {before === "analytics" ? "analytics on" : "essential only"}
        </p>
      )}
    </div>
  );
}
