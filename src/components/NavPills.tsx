"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { leaveTo } from "@/lib/leaveTo";
import { useEffect, useRef, useState } from "react";
import { currencies, useCurrencyStore } from "@/store/useCurrencyStore";

// The links in the middle of the nav: About, IMSA partnership, FAQ. 15px, weight 500, ink, turning brand green on hover. They are hidden below 768px
// (the menu button holds them there).
const link = "text-[15px] font-medium leading-none text-ink no-underline transition-colors duration-200 hover:text-brand focus-visible:text-brand focus-visible:outline-none";

export default function NavLinks({ faqHref = "#faq" }: { faqHref?: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-8 max-md:hidden">
      <a href="https://www.awadoc.com/about-us" target="_blank" rel="noopener noreferrer" className={link}>
        About
      </a>
      <Link
        href="/partnership"
        onClick={(e) => {
          e.preventDefault();
          leaveTo(router, "/partnership");
        }}
        className={link}
      >
        IMSA partnership
      </Link>
      <a href={faqHref} className={link}>
        FAQ
      </a>
    </div>
  );
}

// The currency choice: a 44px pill with a brand green outline and a chevron, opening a short list under it.
export function CurrencyMenu() {
  const { currency, setCurrency } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = currencies.find((c) => c.code === currency) ?? currencies[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative max-md:hidden">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${current.name}`}
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-11 cursor-pointer items-center gap-[0.4em] rounded-full border border-brand bg-card pr-9 pl-[18px] text-[14px] font-semibold text-accent transition-colors duration-200 hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        <span>{current.symbol}</span>
        <span>{current.code}</span>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute top-[15px] right-3.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Choose currency"
          className="book-pop absolute top-[calc(100%+12px)] left-1/2 z-30 w-[240px] -translate-x-1/2 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-[28px] bg-card py-3 shadow-[0_12px_40px_rgba(16,24,40,0.14)]"
        >
          {currencies.map((c) => (
            <li key={c.code} role="option" aria-selected={c.code === currency}>
              <button
                type="button"
                onClick={() => {
                  setCurrency(c.code);
                  setOpen(false);
                }}
                className={`grid min-h-[52px] w-full cursor-pointer grid-cols-[1.4em_3.2em_1fr] items-center gap-x-2 px-6 py-3 text-left text-[16px] leading-none transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none ${c.code === currency ? "font-semibold text-accent" : "font-medium text-ink"}`}
              >
                <span className="text-center">{c.symbol}</span>
                <span>{c.code}</span>
                <span className={`whitespace-nowrap text-right text-[14px] font-normal ${c.code === currency ? "text-accent" : "text-muted"}`}>{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
