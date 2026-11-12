"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType } from "react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { registerBooking, startPayment } from "@/app/actions/imsa";
import { loadBookingConfig } from "@/lib/imsa/loadConfig";
import { useLoaderStore } from "@/store/useLoaderStore";
import { buildSubmission, COUNTRY_CODES, FIELD_LABELS, fullName, watLabel } from "@/lib/imsa/map";
import type { ActionError } from "@/lib/imsa/types";
import { proofIsFresh, TOTAL_STEPS, useBookingStore, type BookingData } from "@/store/useBookingStore";
import {
  formatTime,
  StepBook,
  StepService,
  StepLabs,
  StepLocation,
  StepPartner,
  StepPay,
  StepVerify,
  StepWho,
  StepAbout,
  StepHealth,
} from "@/components/booking/steps";
import { dayLabel } from "@/lib/imsa/map";
import { Notice } from "@/components/booking/fields";

const STEPS: { title: string; sub: string; Body: ComponentType; wide?: boolean }[] = [
  { title: "What would you like to book?", sub: "You can start with counselling and book treatment later.", Body: StepService },
  { title: "Who is this booking for?", sub: "You'll always be the main contact for this booking.", Body: StepWho },
  { title: "About you", sub: "Tell us about you first. Your partner is next.", Body: StepAbout },
  { title: "Your health details", sub: "", Body: StepHealth },
  { title: "Your partner's information", sub: "", Body: StepPartner },
  { title: "Where do you live?", sub: "", Body: StepLocation },
  { title: "Verify your email", sub: "", Body: StepVerify },
  { title: "Pick a time", sub: "Choose when you would like to be seen, then read and agree to the consents.", Body: StepBook, wide: true },
  { title: "Lab results", sub: "Share your genotype reports so a doctor can check them before anything starts.", Body: StepLabs },
  { title: "Review and pay", sub: "", Body: StepPay },
];

const filled = (...v: string[]) => v.every((x) => x.trim().length > 0);

function canContinue(step: number, d: BookingData, proof: ReturnType<typeof useBookingStore.getState>["proof"], packageOn: boolean) {
  switch (step) {
    case 1:
      return d.product === "virtual" || (d.product === "package" && packageOn);
    case 2:
      return d.who === "self" || (d.who === "dependent" && d.dependentRel !== "");
    case 3:
      return fullName(d.first1, d.last1).length >= 3 && filled(d.first1, d.last1) && /^\S+@\S+\.\S+$/.test(d.email.trim()) && d.phone.replace(/\D/g, "").length >= 7;
    case 4:
      return filled(d.gender1, d.yob1, d.lab) && (d.who === "dependent" || filled(d.ivf)) && !!d.geno1 && (d.who === "dependent" ? filled(d.patientFirst, d.patientLast) && fullName(d.patientFirst, d.patientLast).length >= 3 : filled(d.relationship));
    case 5:
      return d.who === "dependent" || (filled(d.first2, d.last2, d.gender2, d.yob2) && !!d.geno2 && fullName(d.first2, d.last2).length >= 3);
    case 6:
      return filled(d.country, d.state, d.street, d.city) && !!COUNTRY_CODES[d.country];
    case 7:
      return proofIsFresh(proof, d.email);
    case 8:
      return (
        (d.product === "virtual" ? !!d.slotId : d.product === "package" && packageOn ? !!d.date && d.hour !== null : false) &&
        d.consentCare &&
        d.consentShare &&
        d.consentAuthority
      );
    default:
      return true;
  }
}

/** Which step a problem with a field belongs to (the API names fields like body.patient.yearOfBirth). */
function stepForField(path: string) {
  const p = path.replace(/^body\./, "");
  if (p.startsWith("booker") || p.startsWith("patient") || p.startsWith("relationship")) return p.startsWith("booker") ? 3 : 4;
  if (p.startsWith("applicationType") || p.startsWith("dependentRelationship")) return 2;
  if (p.startsWith("partner")) return 5;
  if (p.startsWith("location")) return 6;
  if (p.startsWith("emailVerificationId")) return 7;
  return 8;
}

// The booking flow as a full page (/book): the title, "% completed" and step count on top with a segmented
// progress bar, the step in the middle (the date and time step is a calendar beside the day's time slots),
// and a bar pinned to the bottom with what you have chosen so far, Back, and Continue. Plain pixel sizes
// like the EHR's Enroll patient form (.booking-scope).
// Mixes two #rrggbb colours: `amount` of `a`, the rest of `b`.
function mixHex(a: string, b: string, amount: number) {
  // The page colour can be written as #fff, so short hex colours are widened to #ffffff first.
  const full = (h: string) => (h.length === 4 ? `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}` : h);
  const n = (h: string) => [1, 3, 5].map((i) => parseInt(full(h).slice(i, i + 2), 16));
  const [pa, pb] = [n(a), n(b)];
  return `#${pa.map((v, i) => Math.round(v * amount + pb[i] * (1 - amount)).toString(16).padStart(2, "0")).join("")}`;
}

function setThemeColorMeta(color: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = color;
}

export default function BookingFlow() {
  const router = useRouter();
  const { step, dir, data, next: nextStep, back: backStep, goTo, config, configState, proof, receipt, idem, set, setConfig, setProof, setIdem, setReceipt } = useBookingStore();
  // Leaving for the home page: the page fades down and away first, then the home page loads and fades in.
  const [leaving, setLeaving] = useState(false);
  const goHome = (e?: { preventDefault: () => void }) => {
    e?.preventDefault();
    if (leaving) return;
    setLeaving(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => router.push("/"), reduce ? 0 : 300);
  };

  // `busy` is true while the booking is being saved or the payment page is being opened.
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // The service's settings (which products are open, prices, the consent version, ...) are read once from the server.
  // "Start booking" has normally loaded them already; opening /book directly shows the AwaDoc loader until they are in.
  const loadConfig = loadBookingConfig;
  const { show: showLoader, hide: hideLoader } = useLoaderStore.getState();
  useEffect(() => {
    if (useBookingStore.getState().configState === "ready") return;
    showLoader();
    void loadBookingConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Once the options are in (or known to be unavailable) the loader fades away and the page shows.
  useEffect(() => {
    if (configState !== "loading") hideLoader();
  }, [configState, hideLoader]);

  // The phone browser colours its status bar / top edge from the page's background. The page's green glow is
  // painted on <html> (not on an inner box), and the browser is told the same top colour, so the whole screen,
  // right up under the clock, is one piece instead of a white strip above the glow.
  useEffect(() => {
    const root = document.documentElement;
    const paint = () => {
      const bg = getComputedStyle(root).getPropertyValue("--bg").trim() || "#ffffff";
      const top = mixHex("#22bb9b", bg, 0.2);
      root.style.background = `radial-gradient(120% 70% at 15% 0%, ${top}, ${bg} 65%) fixed, ${bg}`;
      document.body.style.background = "transparent";
      setThemeColorMeta(top);
    };
    paint();
    const mo = new MutationObserver(paint);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", paint);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", paint);
      root.style.background = "";
      document.body.style.background = "";
      setThemeColorMeta(getComputedStyle(root).getPropertyValue("--bg").trim() || "#ffffff");
    };
  }, []);

  // Each new step starts at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    scroller.current?.scrollTo({ top: 0 });
  }, [step]);

  const scroller = useRef<HTMLDivElement>(null);
  // For someone else's booking the two steps are told apart: the first is about you (the contact), the second about the patient.
  const base = STEPS[step - 1];
  const dep = data.who === "dependent";
  const cfg =
    dep && step === 3
      ? { ...base, title: "Your details", sub: "You are the main contact for this booking. The patient's details come next." }
      : dep && step === 4
        ? { ...base, title: "The patient's details", sub: "Now tell us about the person this booking is for." }
        : base;
  const { Body } = cfg;
  const wide = !!cfg.wide;
  const ok = canContinue(step, data, proof, !!config?.packageEnabled);
  const locked = !!receipt; // once the booking is saved, the details can't be changed here

  // A booking for someone else has no partner step (the patient's step covers the person), so it is skipped and left out of the count.
  const PARTNER = 5;
  const skipPartner = data.who === "dependent";
  const next = () => (skipPartner && step === PARTNER - 1 ? goTo(PARTNER + 1) : nextStep());
  const back = () => (skipPartner && step === PARTNER + 1 ? goTo(PARTNER - 1) : backStep());
  const visible = STEPS.map((s, i) => ({ s, n: i + 1 })).filter((v) => !(skipPartner && v.n === PARTNER));
  const shownStep = visible.findIndex((v) => v.n === step) + 1;
  const shownTotal = visible.length;
  const label = busy ? (receipt ? "Opening payment..." : "Saving...") : step === TOTAL_STEPS ? (receipt ? `Pay ₦${(receipt.pricing.amountMinor / 100).toLocaleString("en-US")}` : "Confirm booking") : "Continue";

  // What the pill at the bottom left shows: what you chose, with the time or the price.
  const when =
    data.product === "virtual" && data.slotStartsAt
      ? watLabel(data.slotStartsAt).replace(" (West Africa Time)", "")
      : data.product === "package" && data.date && data.hour !== null
        ? `${dayLabel(data.date)} · ${formatTime(data)}`
        : "";
  const summary = receipt
    ? `Total ₦${(receipt.pricing.amountMinor / 100).toLocaleString("en-US")}`
    : data.product
      ? data.product === "virtual"
        ? when || (config ? `Virtual consultation · ₦${(config.virtualFeeMinor / 100).toLocaleString("en-US")}` : "Virtual consultation")
        : when || "Full treatment package"
      : "";

  // A problem from the booking service: say what is wrong and take the visitor to the step that fixes it.
  const handleProblem = async (r: ActionError) => {
    if (r.code === "EMAIL_NOT_VERIFIED" || r.code === "EMAIL_CODE_INVALID") {
      setProof(null);
      goTo(7);
      setError(r.message);
      return;
    }
    if (r.status === 422 && r.fields?.length) {
      const labels = Array.from(new Set(r.fields.map((f) => FIELD_LABELS[f.path.replace(/^body\./, "")]).filter(Boolean)));
      goTo(stepForField(r.fields[0].path));
      setError(labels.length ? `Please check ${labels.join(", ")} and try again.` : `${r.message} ${r.fields[0].message}`);
      return;
    }
    if (r.code === "CONFLICT") {
      // A time was taken, or the consent wording changed: read the settings again.
      const sent = config?.consentVersion;
      const fresh = await loadConfig();
      if (fresh && sent && fresh.consentVersion !== sent) {
        set({ consentCare: false, consentShare: false, consentAuthority: false });
        goTo(8);
        setError("Our consent wording has changed. Please read it and agree again.");
        return;
      }
      if (data.product === "virtual") {
        set({ slotId: "", slotStartsAt: "" });
        goTo(8);
        setError("That time was just taken. Please choose another.");
        return;
      }
    }
    setError(r.message);
  };

  const confirmBooking = async () => {
    if (!config) return;
    if (!proofIsFresh(proof, data.email) || !proof) {
      goTo(7);
      setError("Your email check has expired. Please verify your email again.");
      return;
    }
    const submission = buildSubmission(data, proof.id, config.consentVersion);
    const files: [string, File][] = [];
    if (config.reportsAvailable) {
      if (data.report1) files.push(["patientReport", data.report1]);
      if (data.report2) files.push(["partnerReport", data.report2]);
    }
    // The same booking keeps the same key, so a retry after a lost answer can't create a second booking. Any change gets a new one.
    const fingerprint = JSON.stringify([submission, files.map(([n, f]) => [n, f.name, f.size])]);
    const key = idem && idem.fingerprint === fingerprint ? idem.key : crypto.randomUUID();
    setIdem({ key, fingerprint });

    const form = new FormData();
    form.append("registration", JSON.stringify(submission));
    form.append("idempotencyKey", key);
    for (const [name, f] of files) form.append(name, f, f.name);

    const r = await registerBooking(form);
    if (!r.ok) return handleProblem(r);
    setReceipt(r.data);
  };

  const payNow = async () => {
    if (!receipt) return;
    const r = await startPayment(receipt.registrationId);
    if (!r.ok) {
      setBusy(false);
      return handleProblem(r);
    }
    if (r.data.reconciliationRequired) {
      setBusy(false);
      setError("There's a problem with a payment on this booking, so we've stopped new payments. Please email help@awadoc.com with your reference " + receipt.reference + ".");
      return;
    }
    // A checkout address means go and pay; without one the booking is already paid, so show where it stands.
    if (r.data.paymentUrl) window.location.assign(r.data.paymentUrl);
    else router.push(`/booking/${receipt.registrationId}`);
  };

  const onPrimary = async () => {
    setError("");
    if (step < TOTAL_STEPS) {
      next();
      return;
    }
    setBusy(true);
    try {
      if (receipt) await payNow();
      else await confirmBooking();
    } finally {
      // The page is left when the payment page opens; otherwise the button works again.
      if (!receipt) setBusy(false);
    }
  };

  const pct = Math.round((shownStep / shownTotal) * 100);
  // Until the options are in, only the AwaDoc loader (in the layout) is on screen; the page then arrives with its soft fade in.
  if (configState === "loading") return null;
  return (
    <div className={`booking-scope flex h-dvh flex-col overflow-hidden bg-band font-sans text-ink ${leaving ? "book-leave" : "book-fade"}`}>
      {/* Floating pill header: logo and "Genomics booking", Help, home and the theme switch. */}
      <header className="shrink-0 px-6 pt-4 max-sm:px-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full bg-card py-[clamp(0.375rem,0.25rem+0.4vw,0.625rem)] pr-[clamp(0.375rem,0.3rem+0.3vw,0.75rem)] pl-6 [--icon-btn:clamp(2.25rem,1.95rem+0.9vw,2.75rem)] shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-line/60 max-sm:pl-4">
          <Link href="/" onClick={goHome} aria-label="AwaDoc home" className="flex items-center gap-3">
            <Logo className="h-7 w-auto max-sm:h-5" />
            <span aria-hidden="true" className="h-5 w-px bg-line" />
            <span className="text-fl-small font-semibold text-muted max-sm:hidden">Genomics booking</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="mailto:help@awadoc.com"
              className="inline-flex h-(--icon-btn) items-center rounded-full border border-line px-[clamp(0.75rem,0.6rem+0.5vw,1.25rem)] text-fl-small font-semibold text-ink no-underline transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Help
            </a>
            <Link
              href="/"
              onClick={goHome}
              aria-label="Back to the home page"
              className="grid size-(--icon-btn) place-items-center rounded-full border border-line transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5" aria-hidden="true">
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
              </svg>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="book-rise min-h-0 flex-1 px-6 pt-4 pb-6 max-sm:px-3 max-sm:pb-3" style={{ animationDelay: "80ms" }}>
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-[minmax(0,1fr)_320px] grid-rows-[minmax(0,1fr)] gap-6 max-lg:grid-cols-1">
        <section className="flex min-h-0 flex-col rounded-[20px] bg-card p-[clamp(1rem,3.2vh,2rem)] max-sm:p-5" aria-labelledby="book-title">
          {/* Step count and the segmented bar: done segments go back when tapped. */}
          <div className="flex shrink-0 items-baseline justify-between gap-3">
            <p className="m-0 text-fl-kicker font-semibold tracking-[0.08em] text-accent uppercase">
              Step {shownStep} of {shownTotal}
            </p>
          </div>
          <ol className="mt-2 flex shrink-0 gap-1.5" aria-label={`Step ${shownStep} of ${shownTotal}: ${cfg.title}`}>
            {visible.map(({ s, n }) => {
              const state = n < step ? "done" : n === step ? "now" : "todo";
              return (
                <li key={s.title} className="flex-1">
                  <button
                    type="button"
                    disabled={state !== "done" || busy || locked}
                    onClick={() => goTo(n)}
                    aria-label={state === "done" ? `Go back to ${s.title}` : s.title}
                    aria-current={state === "now" ? "step" : undefined}
                    className="block h-4 w-full cursor-pointer disabled:cursor-default"
                  >
                    <span className={`block h-1.5 w-full rounded-full ${state === "todo" ? "bg-line" : "bg-brand"}`} />
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Only this middle part scrolls, and only when a step is taller than the screen; the step count and the buttons stay in view. */}
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <h1 id="book-title" className="mt-[clamp(0.75rem,3vh,2rem)] mb-0 font-heading text-[clamp(1.5rem,min(1.15rem+1.2vw,4.6vh),2.25rem)] leading-[1.1] font-semibold tracking-tight ">
            {cfg.title}
          </h1>
          {/* `@container` lets fields go two-up based on the space they have, not the screen's width. */}
          <div className="@container mt-3">
            <div key={step} className={`book-page flex flex-col gap-2.5 ${dir === "back" ? "back" : ""}`}>
              {cfg.sub && <p className="m-0 max-w-[44em] text-fl-lead leading-relaxed text-muted">{cfg.sub}</p>}
              <div className="mt-1 flex flex-col *:gap-6!">
                {configState === "unavailable" ? (
                  <Notice>Booking isn&apos;t available right now. Please try again later, or email help@awadoc.com.</Notice>
                ) : (
                  <Body />
                )}
              </div>
              {error && (
                <p role="alert" className="rounded-xl border border-[#b23a3f]/40 bg-[#b23a3f]/8 px-4 py-3 text-fl-small leading-snug text-[#b23a3f]">
                  {error}
                </p>
              )}
            </div>
          </div>
          </div>

          <div className="mt-3 flex shrink-0 items-center justify-between gap-3 border-t border-line pt-3 max-sm:flex-col-reverse max-sm:items-stretch">
            {step > 1 && !locked ? (
              <button
                type="button"
                onClick={back}
                disabled={busy}
                className="h-[clamp(2.5rem,6vh,3rem)] cursor-pointer rounded-full border border-line px-6 max-sm:w-full text-fl-lead font-semibold text-ink transition-colors hover:border-ink disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Back
              </button>
            ) : (
              <span className="max-sm:hidden" />
            )}
            <button
              type="button"
              disabled={!ok || busy || configState !== "ready"}
              onClick={onPrimary}
              className="flex h-[clamp(2.5rem,6vh,3rem)] cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-7 max-sm:w-full text-fl-lead font-semibold text-white transition-colors duration-200 hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-muted/60 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              {busy && <span aria-hidden="true" className="size-[1.1em] animate-spin rounded-full border-2 border-current/30 border-t-current motion-reduce:animate-none" />}
              <span className="truncate">{label}</span>
            </button>
          </div>
        </section>

        {/* Summary aside: what you have chosen so far and how far along you are. */}
        <aside aria-label="Booking summary" className="h-fit rounded-[20px] bg-card p-6 max-lg:hidden">
          <p className="m-0 text-fl-kicker font-semibold tracking-[0.08em] text-muted uppercase">Your booking</p>
          <p className="mt-3 mb-0 font-heading text-fl-lead leading-tight font-semibold">{summary || "Nothing chosen yet"}</p>
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <span className="block h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 mb-0 text-fl-kicker text-muted">{pct}% done</p>
        </aside>
      </div>
      </div>
    </div>
  );
}
