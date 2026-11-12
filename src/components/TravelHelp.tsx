"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TRAVEL_FALLBACK, TRAVEL_GREETING, TRAVEL_MAIL, TRAVEL_TOPICS, matchTravel, type Block, type TravelTopic } from "@/lib/travelHelp";

type Msg = { me: true; text: string } | { me: false; title: string; blocks: Block[]; mail: boolean };

const GREETING: Msg = { me: false, title: "", blocks: [{ p: TRAVEL_GREETING }], mail: false };

// "Ask about travel": a side drawer on wide screens and a bottom sheet on phones. It answers from the built in list in lib/travelHelp, so it works
// offline, and it closes with the cross, Esc or a tap outside.
export default function TravelHelp({ className, children }: { className: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [present, setPresent] = useState(false);
  const [log, setLog] = useState<Msg[]>([GREETING]);
  const [asked, setAsked] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
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

  function ask(question: string, known?: TravelTopic | null) {
    const text = question.trim();
    if (!text || typing) return;
    const topic = known ?? matchTravel(text);
    setLog((l) => [...l, { me: true, text }]);
    setQ("");
    setTyping(true);
    timers.current.push(
      window.setTimeout(() => {
        setLog((l) => [
          ...l,
          topic ? { me: false, title: topic.title, blocks: topic.answer, mail: !!topic.mail } : { me: false, title: "", blocks: TRAVEL_FALLBACK, mail: true },
        ]);
        if (topic) setAsked((a) => [...a, topic.id]);
        setTyping(false);
      }, 650),
    );
  }

  function copyMail() {
    void navigator.clipboard?.writeText(TRAVEL_MAIL).catch(() => {});
    setCopied(true);
    timers.current.push(window.setTimeout(() => setCopied(false), 1400));
  }

  const chips = TRAVEL_TOPICS.filter((t) => !asked.includes(t.id)).slice(0, 6);

  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {(open || present) &&
        createPortal(
          <div
            className={`fixed inset-0 z-[60] bg-[rgba(10,13,18,0.5)] transition-opacity duration-300 ease-out motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}
            onPointerDown={(e) => e.target === e.currentTarget && close()}
          >
            <aside
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="travel-title"
              className={`absolute flex flex-col bg-band text-ink shadow-[0_24px_60px_rgba(0,0,0,0.3)] outline-none transition-transform duration-[450ms] ease-[cubic-bezier(0.16,0.8,0.24,1)] motion-reduce:transition-none max-sm:inset-x-0 max-sm:bottom-0 max-sm:h-[86dvh] max-sm:rounded-t-3xl sm:inset-y-0 sm:right-0 sm:w-110 sm:max-w-full sm:border-l sm:border-line ${shown ? "translate-x-0 translate-y-0" : "max-sm:translate-y-full sm:translate-x-full"}`}
            >
              <div className="flex items-center gap-3 border-b border-line py-4 pr-4 pl-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tint text-accent">
                  <PlaneIcon className="size-4.5" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <b id="travel-title" className="text-base font-semibold">
                    Travel help
                  </b>
                  <small className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <i className="size-2 rounded-full bg-brand" />
                    Answers instantly, works offline
                  </small>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close travel help"
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:border-brand hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div role="log" aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {log.map((m, i) =>
                  m.me ? (
                    <div key={i} className="max-w-[80%] self-end rounded-[18px_18px_4px_18px] bg-brand px-3.5 py-2.5 text-sm font-medium text-white in-data-[theme=dark]:text-[#0a0d12]">
                      {m.text}
                    </div>
                  ) : (
                    <div key={i} className="flex max-w-[88%] flex-col gap-2 self-start rounded-[18px_18px_18px_4px] border border-line bg-card px-4 py-3.5 text-sm leading-relaxed text-muted">
                      {m.title && <div className="font-semibold text-ink">{m.title}</div>}
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
                        <div className="flex items-center justify-between gap-2 rounded-full border border-line bg-bg py-1.5 pr-1.5 pl-3">
                          <code className="text-[13px] text-ink">{TRAVEL_MAIL}</code>
                          <button type="button" onClick={copyMail} className="h-8 cursor-pointer rounded-full bg-tint px-3.5 text-[13px] font-semibold text-accent">
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  ),
                )}
                {typing && <div className="self-start rounded-full border border-line bg-card px-3.5 py-2 text-lg tracking-widest text-muted">•••</div>}
                <div ref={endRef} />
              </div>

              <div aria-label="Suggested questions" className="flex flex-wrap gap-2 px-5 pb-3">
                {chips.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => ask(t.title, t)}
                    className="inline-flex h-9 cursor-pointer items-center rounded-full border border-brand bg-band px-3.5 text-[13px] font-semibold text-accent transition-colors hover:bg-tint"
                  >
                    {t.chip}
                  </button>
                ))}
              </div>

              <form
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(q);
                }}
                className="flex gap-2 px-5 pb-3"
              >
                <input
                  aria-label="Ask about your trip"
                  placeholder="Ask about visas, flights, where to stay…"
                  maxLength={300}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-12 min-w-0 flex-1 rounded-full border border-line bg-card px-4.5 text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
                />
                <button type="submit" aria-label="Send" className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-brand text-white in-data-[theme=dark]:text-[#0a0d12]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
              <p className="m-0 px-5 pb-[max(1.125rem,env(safe-area-inset-bottom))] text-xs leading-normal text-muted">
                General travel guidance. Your AwaDoc care team confirms the details for your own trip.
              </p>
            </aside>
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
