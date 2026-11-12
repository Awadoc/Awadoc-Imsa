"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { leaveTo } from "@/lib/leaveTo";
import { startBooking } from "@/lib/startBooking";
import { useEffect, useId, useRef, useState } from "react";
import { currencies, useCurrencyStore } from "@/store/useCurrencyStore";

// Below 500px the nav links fold into this menu: a hamburger button that opens a panel under the
// nav with About, FAQ and the currency choice. From 500px up the full links show instead.
export default function MobileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutId = useId();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { currency, setCurrency } = useCurrencyStore();
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const currencyId = useId();
  const current = currencies.find((c) => c.code === currency) ?? currencies[0];

  // Collapse the currency list whenever the menu closes.
  useEffect(() => {
    if (!open) setCurrencyOpen(false);
  }, [open]);

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

  const row =
    "flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 px-6 py-2 text-left font-[family-name:var(--font-nohemi)] text-[17px] font-medium text-ink transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none";
  // The choices that slide out under a row sit a little further in.
  const subRow = `${row} pl-9 text-[16px]`;

  return (
    <div ref={ref} className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-card text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4.5">
          {/* Three lines that turn into an X. */}
          <path d="M4 7h16" className={`origin-center transition-transform duration-200 motion-reduce:transition-none ${open ? "translate-y-1.25 rotate-45" : ""}`} />
          <path d="M4 12h16" className={`transition-opacity duration-150 motion-reduce:transition-none ${open ? "opacity-0" : ""}`} />
          <path d="M4 17h16" className={`origin-center transition-transform duration-200 motion-reduce:transition-none ${open ? "-translate-y-1.25 -rotate-45" : ""}`} />
        </svg>
      </button>

      {/* A floating card under the nav, inset from the screen edges by the same margin as the page
          (and clear of notches). The grid-rows trick animates its height. */}
      <div
        id={panelId}
        className={`absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 grid rounded-[28px] border-line bg-card shadow-[0_12px_40px_rgba(16,24,40,0.14)] sm:left-auto sm:w-96 transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] border opacity-100" : "grid-rows-[0fr] border-0 opacity-0"
        }`}
        {...(open ? {} : { inert: true })}
      >
        <div className="overflow-hidden rounded-[inherit]">
          <nav aria-label="Menu" className="flex flex-col py-3">
            {/* "About" is a row too: tap it and its two choices slide out below. They do not go anywhere yet. */}
            <button
              type="button"
              aria-expanded={aboutOpen}
              aria-controls={aboutId}
              onClick={() => setAboutOpen((o) => !o)}
              className={row}
            >
              <span>About Us</span>
              <span className="font-sans text-[13px] font-semibold text-muted">{aboutOpen ? "Hide" : "View"}</span>
            </button>
            <div
              id={aboutId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                aboutOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
              {...(aboutOpen ? {} : { inert: true })}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col">
                  <a
                    href="https://www.awadoc.com/about-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={subRow}
                  >
                    AwaDoc
                  </a>
                  <Link
                    href="/partnership"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      leaveTo(router, "/partnership");
                    }}
                    className={subRow}
                  >
                    IMSA partnership
                  </Link>
                </div>
              </div>
            </div>
            <a href="#faq" onClick={() => setOpen(false)} className={row}>
              FAQ
            </a>

            {/* "Currency" is a row: tap it and the list of currencies slides out below. */}
            <button
              type="button"
              aria-expanded={currencyOpen}
              aria-controls={currencyId}
              onClick={() => setCurrencyOpen((o) => !o)}
              className={row}
            >
              <span>Currency</span>
              <span className="flex items-center gap-2 text-[15px] font-normal text-muted">
                {current.symbol} {current.code}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${currencyOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>

            <div
              id={currencyId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                currencyOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
              {...(currencyOpen ? {} : { inert: true })}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCurrency(c.code);
                        setOpen(false);
                      }}
                      aria-pressed={c.code === currency}
                      className={`${subRow} ${c.code === currency ? "text-brand" : ""}`}
                    >
                      <span>
                        <span className="inline-block w-[1.4em]">{c.symbol}</span>
                        {c.code}
                      </span>
                      <span className={`text-[15px] font-normal ${c.code === currency ? "text-brand" : "text-muted"}`}>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* The main action, as in the AwaDoc site menu: a wide outlined pill. */}
            <div className="mt-2 px-4 pb-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void startBooking(router);
                }}
                className="flex h-13 w-full cursor-pointer items-center justify-center rounded-full border border-brand bg-card font-[family-name:var(--font-nohemi)] text-[17px] font-semibold text-accent transition-colors hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Start booking
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
