"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SECTIONS = [
  {
    title: "Who looks after your data",
    text: "AwaDoc is responsible for the information you give on this page, under the Nigeria Data Protection Act 2023. We only use it with your explicit consent.",
  },
  {
    title: "What we collect",
    text: "Your names and contact details, address, both genotypes, lab reports you upload, basic fertility history, your bookings and payment records. We never see or store your card details; the payment provider handles them.",
  },
  {
    title: "Why we use it",
    text: "To counsel you, arrange tests and treatment, refer you to IMSA when you ask us to, take payments and remind you of appointments.",
  },
  {
    title: "Who can see it",
    text: "AwaDoc's care team. IMSA's clinical team, only once you're referred. Our payment provider, only for payments. Nobody else, unless the law requires it. We never sell your data.",
  },
  {
    title: "How we protect it",
    text: "Access is limited to the people caring for you. Genotypes are kept off receipts you share. We keep records only as long as your care and medical records rules require.",
  },
  {
    title: "Your rights",
    text: "You can ask to see, correct or delete your data, and withdraw consent at any time, by emailing AwaDoc's Data Protection Officer at dpo@awadoc.com. You can also complain to the Nigeria Data Protection Commission.",
  },
];

// "Read how we protect your data" in the booking: a link style button that opens the information in a modal on the same page, so the booking is
// never left. It closes with the cross, Esc or a tap outside, and the page behind stops scrolling while it is open.
export default function DataProtectionModal({ className, children }: { className: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useRef<HTMLDivElement>(null);

  // `shown` drives the fade and grow; `present` keeps the modal mounted while it animates out.
  const [shown, setShown] = useState(false);
  const [present, setPresent] = useState(false);
  useEffect(() => {
    if (open) {
      setPresent(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setShown(false);
    const t = setTimeout(() => setPresent(false), 380);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={className}>
        {children}
      </button>

      {(open || present) &&
        createPortal(
          <div
            className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/35 p-3 backdrop-blur-[3px] transition-opacity duration-500 ease-out motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}
            onPointerDown={(e) => e.target === e.currentTarget && close()}
          >
            <div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="data-protection-title"
              className={`relative max-h-[min(88dvh,60rem)] w-full max-w-160 origin-center overflow-y-auto rounded-[28px] bg-card p-6 text-ink shadow-[0_24px_80px_-16px_rgba(0,0,0,0.45)] outline-none [scrollbar-width:none] transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.16,0.8,0.24,1)] motion-reduce:transition-none sm:p-9 [&::-webkit-scrollbar]:hidden ${shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-[0.95] opacity-0"}`}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>

              <h2 id="data-protection-title" className="m-0 pr-12 font-heading text-fl-name leading-[1.1] font-semibold tracking-tight">
                How we protect your data
              </h2>

              <div className="mt-6 grid gap-3">
                {SECTIONS.map((s) => (
                  <section key={s.title} className="rounded-2xl bg-band p-4">
                    <h3 className="m-0 text-fl-small font-semibold leading-snug">{s.title}</h3>
                    <p className="m-0 mt-1.5 text-fl-small leading-relaxed text-muted">{s.text}</p>
                  </section>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
