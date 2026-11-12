"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TRAVEL_GREETING, TRAVEL_MAIL, TRAVEL_TOPICS, type Block, type TravelTopic } from "@/lib/travelHelp";

type Msg = { me: true; text: string } | { me: false; title: string; blocks: Block[]; mail: boolean };

const GREETING: Msg = { me: false, title: "", blocks: [{ p: TRAVEL_GREETING }], mail: false };

// "Ask about travel": the same chat window as Ask Noura (a centred glass card, a full height sheet on phones) with four questions to tap. The answers come
// from the built in list in lib/travelHelp, so it works offline. It closes with the cross, Esc or a tap outside.
export default function TravelHelp({ className, children }: { className: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [present, setPresent] = useState(false);
  const [log, setLog] = useState<Msg[]>([GREETING]);
  const [asked, setAsked] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const close = useCallback(() => setOpen(false), []);

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
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [open, log, typing]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function ask(topic: TravelTopic) {
    if (typing) return;
    setLog((l) => [...l, { me: true, text: topic.title }]);
    setTyping(true);
    timers.current.push(
      window.setTimeout(() => {
        setLog((l) => [...l, { me: false, title: topic.title, blocks: topic.answer, mail: !!topic.mail }]);
        setAsked((a) => [...a, topic.id]);
        setTyping(false);
      }, 650),
    );
  }

  function copyMail() {
    void navigator.clipboard?.writeText(TRAVEL_MAIL).catch(() => {});
    setCopied(true);
    timers.current.push(window.setTimeout(() => setCopied(false), 1400));
  }

  // Four questions at a time; asked ones are replaced by new ones, and when all are asked the first four come back.
  const left = TRAVEL_TOPICS.filter((t) => !asked.includes(t.id));
  const chips = (left.length ? left : TRAVEL_TOPICS).slice(0, 4);

  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {(open || present) &&
        createPortal(
          <div
            className={`fixed inset-0 z-60 flex items-end justify-center bg-black/25 p-[max(0.75rem,env(safe-area-inset-top))_max(1.75rem,env(safe-area-inset-right))_max(0.75rem,env(safe-area-inset-bottom))_max(1.75rem,env(safe-area-inset-left))] backdrop-blur-[3px] transition-opacity duration-400 ease-out motion-reduce:transition-none sm:items-center sm:p-[calc(24*var(--u))] ${shown ? "opacity-100" : "opacity-0"}`}
            onPointerDown={(e) => e.target === e.currentTarget && close()}
          >
            <div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="travel-title"
              className={`flex h-[85dvh] max-h-full w-full max-w-[calc(600*var(--u))] origin-center flex-col overflow-hidden rounded-[calc(28*var(--u))] border border-white/40 bg-linear-to-br from-bg/90 via-bg/82 to-bg/75 text-ink shadow-[0_24px_80px_-16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] outline-none backdrop-blur-[12px] transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:h-[min(86dvh,calc(720*var(--u)))] ${shown ? "scale-100 opacity-100" : "scale-[0.94] opacity-0"}`}
            >
              {/* Header */}
              <header className="flex shrink-0 items-center gap-[calc(14*var(--u))] px-card py-[calc(18*var(--u))]">
                <span className="flex h-[calc(48*var(--u))] w-[calc(48*var(--u))] shrink-0 items-center justify-center rounded-full bg-brand/15 text-accent">
                  <PlaneIcon className="size-[44%]" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 id="travel-title" className="text-lead leading-tight font-medium">
                    Travel help
                  </h2>
                  <p className="truncate text-hero-sub text-muted">Answers instantly, works offline</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close travel help"
                  className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-[calc(18*var(--u))] w-[calc(18*var(--u))]">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </header>

              {/* Conversation */}
              <div
                role="log"
                aria-live="polite"
                className="flex min-h-0 flex-1 flex-col gap-[calc(12*var(--u))] overflow-y-auto px-card py-[calc(20*var(--u))] [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
              >
                {log.map((m, i) =>
                  m.me ? (
                    <div
                      key={i}
                      className="noura-msg max-w-[85%] self-end rounded-[calc(20*var(--u))] rounded-br-[calc(6*var(--u))] bg-brand px-[calc(18*var(--u))] py-[calc(12*var(--u))] text-hero-sub leading-relaxed font-medium text-[#07110c]"
                    >
                      {m.text}
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="noura-msg flex max-w-[85%] flex-col gap-2 self-start rounded-[calc(20*var(--u))] rounded-bl-[calc(6*var(--u))] border border-ink/10 bg-bg/80 px-[calc(18*var(--u))] py-[calc(12*var(--u))] text-hero-sub leading-relaxed shadow-[0_4px_16px_-8px_rgba(0,0,0,0.15)]"
                    >
                      {m.title && <div className="font-semibold">{m.title}</div>}
                      {m.blocks.map((b, j) =>
                        "p" in b ? (
                          <p key={j} className="m-0">
                            {b.p}
                          </p>
                        ) : (
                          <ul key={j} className="m-0 flex flex-col gap-1 pl-4.5">
                            {b.ul.map((li) => (
                              <li key={li}>{li}</li>
                            ))}
                          </ul>
                        ),
                      )}
                      {m.mail && (
                        <div className="flex items-center justify-between gap-2 rounded-full border border-ink/10 bg-bg py-1.5 pr-1.5 pl-3">
                          <code className="text-[13px]">{TRAVEL_MAIL}</code>
                          <button type="button" onClick={copyMail} className="h-8 cursor-pointer rounded-full bg-brand/15 px-3.5 text-[13px] font-semibold text-accent">
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  ),
                )}

                {typing && (
                  <div
                    aria-label="Typing"
                    className="flex w-fit items-center gap-[calc(5*var(--u))] self-start rounded-[calc(20*var(--u))] rounded-bl-[calc(6*var(--u))] border border-ink/10 bg-bg/80 px-[calc(18*var(--u))] py-[calc(16*var(--u))]"
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-[calc(7*var(--u))] w-[calc(7*var(--u))] animate-bounce rounded-full bg-muted motion-reduce:animate-none"
                        style={{ animationDelay: `${i * 140}ms` }}
                      />
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Four questions, and the disclaimer. */}
              <footer className="shrink-0 px-card pt-[calc(16*var(--u))] pb-[calc(18*var(--u))]">
                <div className="grid grid-cols-2 gap-[calc(8*var(--u))]">
                  {chips.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      disabled={typing}
                      onClick={() => ask(t)}
                      className="flex min-h-11 cursor-pointer items-center justify-center rounded-[calc(16*var(--u))] border border-ink/15 bg-bg/70 px-[1em] py-[0.5em] text-center text-hero-sub leading-snug font-medium transition-colors hover:border-brand hover:bg-brand/10 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-ink/15 disabled:hover:bg-bg/70 disabled:hover:text-inherit"
                    >
                      {t.chip}
                    </button>
                  ))}
                </div>
                <p className="mt-[calc(12*var(--u))] text-center text-micro leading-snug text-muted">General travel guidance. Your AwaDoc care team confirms the details for your own trip.</p>
              </footer>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M2 16l20-6-3-2-6 2-5-5-2 1 3 5-5 2-2-1-1 1 3 3z" />
    </svg>
  );
}
