"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { startBooking } from "@/lib/startBooking";

const HIGHLIGHTS = [
  {
    title: "Founder, Nisa Premier Hospital, Abuja",
    text: "Founded the hospital in 1996 and grew it into one of Nigeria’s leading fertility and genetics centres.",
  },
  {
    title: "Nigeria’s first government authenticated IVF baby",
    text: "Led the team behind the birth in 1998, followed by Nigeria’s first IVF twins, triplets and babies from frozen embryos.",
  },
  {
    title: "Sickle cell embryo testing in Nigeria",
    text: "Lead author of the 2020 report of a sickle cell free birth after PGT-M with the genetic testing done entirely in Nigeria, and of a 5 year review of PGT in Abuja (2026).",
  },
  {
    title: "National honour",
    text: "Officer of the Order of the Niger (OON), awarded in 2006 for his work in IVF.",
  },
  {
    title: "Research and writing",
    text: "Author of more than 15 peer reviewed papers and two books, The Second Chance and PPP in Health.",
  },
];

const CAREER = [
  "MBBS, Ahmadu Bello University, Zaria (1980)",
  "Fellow, Royal College of Obstetricians and Gynaecologists (FRCOG), UK",
  "Fellow, West African College of Surgeons (FWACS)",
  "MBA, International Hospital and Healthcare Management, Frankfurt School of Finance & Management",
  "Clinical research fellow in reproductive medicine, Manchester Fertility Services and St Mary’s Hospital, Manchester (1989–1992)",
  "Consultant, Bourn Hall Clinic, Cambridge, the world’s first IVF clinic (1992–1994)",
  "Founder, Nisa Premier Hospital, Abuja (1996)",
  "Former Chief Consultant and Chairman of the Medical Advisory Committee, National Hospital, Abuja",
];

// Dr Wada's full profile, opened from "View full profile". It eases in, closes with the button, the cross, Esc or a tap outside,
// and the page behind it stops scrolling while it is open.
export default function SpecialistProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if ((!open && !present) || typeof document === "undefined") return null;

  // Drawn on the page itself (not inside the section), so it is above the nav bar and the rest of the page.
  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-[max(0.75rem,env(safe-area-inset-top))_max(0.75rem,env(safe-area-inset-right))_max(0.75rem,env(safe-area-inset-bottom))_max(0.75rem,env(safe-area-inset-left))] backdrop-blur-[3px] transition-opacity duration-500 ease-out motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className={`scrollbar-none [&::-webkit-scrollbar]:hidden relative max-h-[min(88dvh,60rem)] w-full max-w-176 origin-center overflow-y-auto rounded-[28px] border border-white/40 bg-linear-to-br from-bg/95 via-bg/92 to-bg/88 p-6 text-ink shadow-[0_24px_80px_-16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] outline-none backdrop-blur-md transition-[transform,opacity] duration-650 ease-[cubic-bezier(0.16,0.8,0.24,1)] motion-reduce:transition-none sm:p-9 ${shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-[0.95] opacity-0"}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="absolute right-4 top-4 z-10 grid size-10 cursor-pointer place-items-center rounded-full border border-ink/20 bg-bg/70 transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="book-rise flex items-center gap-4 pr-12" style={{ animationDelay: "180ms" }}>
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-brand/20 sm:size-20">
            <Image src="/team/wada-portrait.png" alt="" width={1072} height={1976} sizes="80px" className="absolute left-1/2 top-[6%] h-[190%] w-auto max-w-none -translate-x-1/2 object-cover object-top" />
          </div>
          <div className="@container min-w-0 flex-1">
            <h2
              id="profile-title"
              className="font-heading text-h2 font-medium leading-[1.08] [-webkit-text-stroke:0.015em_currentColor] sm:text-[length:clamp(1.1rem,calc((100cqw-14rem)/10.9),var(--text-h2))]"
            >
              <span className="sm:whitespace-nowrap">Dr Ibrahim Wada, OON</span>
              <span className="block sm:inline-block mt-[0.5em] sm:mt-0 sm:ml-[0.9em] align-baseline font-sans whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-widest text-ink [-webkit-text-stroke:0]">
                (MBBS, FRCOG, FWACS, MBA)
              </span>
            </h2>
            {/* Beside the name from the small breakpoint up; on a phone it moves under the photo row, see below. */}
            <p className="mt-[0.4em] text-label font-semibold uppercase leading-snug tracking-widest text-accent max-sm:hidden">
              <span className="block">Chief Medical Advisor, AwaDoc</span>
              <span className="block">Founder, Nisa Premier Hospital, Abuja</span>
            </p>
          </div>
        </div>

        {/* Phone: the full width of the card, each line on one line, the size following the card's width. */}
        <div className="@container book-rise mt-[1.2em] sm:hidden" style={{ animationDelay: "230ms" }}>
          <p className="whitespace-nowrap text-[min(var(--text-hero-sub),calc(100cqw/31))] font-semibold uppercase leading-snug tracking-[0.06em] text-accent">
            <span className="block">Chief Medical Advisor, AwaDoc</span>
            <span className="block">Founder, Nisa Premier Hospital, Abuja</span>
          </p>
        </div>

        <p className="book-rise mt-[1.4em] text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted" style={{ animationDelay: "280ms" }}>
          Dr Wada is the founder of Nisa Premier Hospital, Abuja, and one of Nigeria’s pioneers of in vitro fertilisation. He has practised reproductive medicine for over 35 years and has
          championed embryo testing (PGT-M) so that couples who carry the sickle cell gene can have children free of the disease.
        </p>

        <div className="book-rise mt-[1.6em] grid gap-3 sm:grid-cols-2" style={{ animationDelay: "380ms" }}>
          {HIGHLIGHTS.map((h, i) => (
            <section key={h.title} className={`rounded-[20px] bg-ink/5 p-4 ${i === 0 ? "sm:col-span-2" : ""}`}>
              <h3 className="text-hero-sub font-semibold leading-snug">{h.title}</h3>
              <p className="mt-[0.5em] text-[calc(var(--text-hero-sub)*0.92)] font-medium leading-relaxed tracking-[-0.03em] text-muted">{h.text}</p>
            </section>
          ))}
        </div>

        <h3 style={{ animationDelay: "480ms" }} className="book-rise mt-[1.8em] font-heading text-h3 font-medium [-webkit-text-stroke:0.015em_currentColor]">Training and career</h3>
        <ul className="book-rise mt-[0.8em] space-y-[0.7em]" style={{ animationDelay: "540ms" }}>
          {CAREER.map((line) => (
            <li key={line} className="flex gap-3 text-[calc(var(--text-hero-sub)*0.95)] font-medium leading-relaxed tracking-[-0.03em] text-muted">
              <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-brand" />
              {line}
            </li>
          ))}
        </ul>

        {/* Closes the profile and goes to the booking page. */}
        <button
          type="button"
          onClick={() => {
            onClose();
            void startBooking(router);
          }}
          style={{ animationDelay: "620ms" }}
          className="book-rise mx-auto mt-[1.8em] flex min-h-btn w-full cursor-pointer items-center justify-center rounded-[calc(14*var(--u))] border border-ink bg-ink px-[1.4em] py-[0.7em] text-btn font-bold text-bg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-[#07110c] hover:shadow-[0_10px_28px_-8px_var(--color-brand)] active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 sm:w-fit"
        >
          Book Counselling
        </button>
      </div>
    </div>,
    document.body,
  );
}
