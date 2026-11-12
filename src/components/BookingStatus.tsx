"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuCheck } from "react-icons/lu";
import { chooseSlot, getPaymentStatus, openBooking, recoverBooking, sendEmailCode, startPayment, verifyEmailCode } from "@/app/actions/imsa";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { chosen, Field, inputBase, Notice, TextInput } from "@/components/booking/fields";
import { Naira, SlotPicker, useSlots } from "@/components/booking/steps";
import { watLabel } from "@/lib/imsa/map";
import type { ActionError, PaymentStatus } from "@/lib/imsa/types";

const SUPPORT = "help@awadoc.com";
// After checkout the payment is confirmed on the server a little later, so the status is read again: after 5, 10, then every 30 seconds, a few times.
const POLL_SECONDS = [5, 10, 30, 30, 30, 30];

const button =
  "h-11 cursor-pointer rounded-full bg-ink px-6 text-btn font-semibold text-bg transition-colors hover:bg-brand hover:text-[#07110c] disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-muted/60";
const linkButton = "cursor-pointer text-hero-sub font-semibold text-accent underline underline-offset-4 disabled:cursor-not-allowed disabled:text-muted disabled:no-underline";

// Where a booking stands: paid or not, and the appointment, which are separate things (a payment can be complete while the appointment is still being confirmed).
// The page opens from the link in the booking email (which carries a token after the # sign) or from the return from checkout.
export default function BookingStatus({ registrationId }: { registrationId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [problem, setProblem] = useState<ActionError | null>(null);
  const [checking, setChecking] = useState(true);
  const [polls, setPolls] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  const load = useCallback(async () => {
    setChecking(true);
    const r = await getPaymentStatus(registrationId);
    setChecking(false);
    if (r.ok) {
      setStatus(r.data);
      setProblem(null);
    } else setProblem(r);
    return r.ok ? r.data : null;
  }, [registrationId]);

  // First visit: take the token from the link (then take it out of the address bar), or use the cookie from the booking page.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const token = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token");
    if (token) {
      void (async () => {
        const r = await openBooking(registrationId, token);
        // The token is taken out of the address bar once it is safely kept. The router rewrites the address when a server action
        // finishes, so this waits a moment and then makes sure it is gone.
        const strip = () => {
          if (window.location.hash) window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
        };
        strip();
        window.setTimeout(strip, 150);
        window.setTimeout(strip, 600);
        setChecking(false);
        if (r.ok) setStatus(r.data);
        else setProblem(r);
      })();
    } else void load();
  }, [registrationId, load]);

  // Still unpaid: look again a few times, in case the visitor has just come back from paying.
  const unpaid = status?.paymentStatus === "pending" && !status.reconciliationRequired;
  useEffect(() => {
    if (!unpaid || polls >= POLL_SECONDS.length) return;
    const t = window.setTimeout(() => {
      setPolls((n) => n + 1);
      void load();
    }, POLL_SECONDS[polls] * 1000);
    return () => window.clearTimeout(t);
  }, [unpaid, polls, load]);

  const payNow = async () => {
    setBusy(true);
    setMessage("");
    const r = await startPayment(registrationId);
    if (!r.ok) {
      setBusy(false);
      setMessage(r.message);
      return;
    }
    if (r.data.reconciliationRequired) {
      setBusy(false);
      setStatus(r.data);
      return;
    }
    if (r.data.paymentUrl) window.location.assign(r.data.paymentUrl);
    else {
      setBusy(false);
      setStatus(r.data);
    }
  };

  const needsLogin = problem && (problem.code === "AUTH_REQUIRED" || problem.code === "INVALID_TOKEN");

  return (
    <div className="booking-scope flex min-h-dvh flex-col font-sans text-ink book-fade">
      <header className="gutter flex w-full items-center justify-between pb-10 pt-5">
        <Link href="/" aria-label="AwaDoc home" className="-ml-1 flex items-center">
          <Logo className="h-8 w-auto max-sm:h-6" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="gutter book-rise mx-auto flex w-full max-w-[44em] flex-1 flex-col gap-[calc(18*var(--u))] pb-16" style={{ animationDelay: "80ms" }}>
        <h1 className="font-heading text-h2 font-medium leading-tight">Your booking</h1>

        {checking && !status && !problem && <Notice>Checking your booking...</Notice>}

        {needsLogin && <Recover onDone={(id) => router.replace(`/booking/${id}`)} registrationId={registrationId} onRecovered={load} />}

        {problem && !needsLogin && (
          <Notice>
            {problem.message}{" "}
            <button type="button" onClick={() => void load()} className={linkButton}>
              Try again
            </button>
          </Notice>
        )}

        {status && (
          <>
            <Summary status={status} />

            {status.reconciliationRequired && (
              <Notice>
                There&apos;s a problem with a payment on this booking, so new payments are paused while our team looks into it. Please email{" "}
                <a href={`mailto:${SUPPORT}`} className="font-semibold text-accent underline underline-offset-4">
                  {SUPPORT}
                </a>{" "}
                and quote your registration reference.
              </Notice>
            )}

            {unpaid && (
              <div className="grid gap-[calc(12*var(--u))]">
                <Notice>
                  {polls < POLL_SECONDS.length && checking === false
                    ? "We haven't received your payment yet. If you've just paid, this page will update by itself."
                    : "We haven't received your payment yet."}
                </Notice>
                <div className="flex flex-wrap items-center gap-[calc(12*var(--u))]">
                  <button type="button" onClick={payNow} disabled={busy} className={button}>
                    {busy ? "Opening payment..." : `Pay ₦${(status.amountMinor / 100).toLocaleString("en-US")}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPolls(0);
                      void load();
                    }}
                    disabled={checking}
                    className={linkButton}
                  >
                    {checking ? "Checking..." : "Check again"}
                  </button>
                </div>
              </div>
            )}

            {status.paymentStatus === "paid" && status.appointmentStatus === "scheduling_required" && <Reschedule registrationId={registrationId} onDone={setStatus} />}
            {message && (
              <p role="alert" className="text-hero-sub leading-snug text-[#b23a3f]">
                {message}
              </p>
            )}
          </>
        )}

        <p className="text-hero-sub leading-relaxed text-muted">
          Need help? Email{" "}
          <a href={`mailto:${SUPPORT}`} className="font-semibold text-accent underline underline-offset-4">
            {SUPPORT}
          </a>{" "}
          and quote your registration reference.
        </p>
      </main>
    </div>
  );
}

function Summary({ status }: { status: PaymentStatus }) {
  const paid = status.paymentStatus === "paid";
  const when = status.confirmedFor ?? status.preferredAt;
  const appointment: Record<PaymentStatus["appointmentStatus"], string> = {
    awaiting_payment: "Waiting for payment",
    confirmed: "Confirmed",
    awaiting_confirmation: "Paid. Our care team will confirm your appointment",
    scheduling_required: "Paid. Please choose another time",
    awaiting_scheduling: "Our care team will arrange your appointment",
  };
  const rows: [string, string][] = [
    ["Booking", status.purchaseType === "full_package" ? "Full treatment package" : "Virtual consultation"],
    ["Payment", paid ? "Paid" : "Not paid yet"],
    ["Appointment", appointment[status.appointmentStatus] ?? status.appointmentStatus],
  ];
  if (when) rows.push([status.confirmedFor ? "Confirmed for" : "Preferred time", watLabel(when)]);
  if (status.holdExpiresAt && !paid) rows.push(["Your time is held until", watLabel(status.holdExpiresAt)]);

  return (
    <div className="grid gap-[calc(14*var(--u))]">
      {paid && (
        <div className={`flex items-center gap-[0.9em] rounded-xl border p-[1em] text-hero-sub ${chosen}`}>
          <span className="flex size-[2em] shrink-0 items-center justify-center rounded-full bg-brand text-[#07110c]">
            <LuCheck aria-hidden="true" />
          </span>
          <strong className="font-semibold">Thank you. We&apos;ve received your payment.</strong>
        </div>
      )}
      <div className="rounded-[14px] border border-ink/10 bg-ink/3 p-[calc(18*var(--u))]">
        <div className="font-heading text-h3 font-medium">
          <Naira minor={status.pricing.amountMinor} />
        </div>
        <dl className="mt-[0.8em] grid divide-y divide-ink/10 text-hero-sub">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 py-[0.6em]">
              <dt className="text-muted">{k}</dt>
              <dd className="min-w-0 text-right font-semibold">{v}</dd>
            </div>
          ))}
          {status.pricing.packageSelection && (
            <div className="flex justify-between gap-3 py-[0.6em]">
              <dt className="text-muted">Price band</dt>
              <dd className="min-w-0 text-right font-semibold">{status.pricing.packageSelection.name}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

/** A paid consultation whose time was lost: choose another free time, with no second payment. */
function Reschedule({ registrationId, onDone }: { registrationId: string; onDone: (s: PaymentStatus) => void }) {
  const slots = useSlots();
  const [slotId, setSlotId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setBusy(true);
    setError("");
    const r = await chooseSlot(registrationId, slotId);
    setBusy(false);
    if (r.ok) return onDone(r.data);
    setError(r.message);
    if (r.code === "CONFLICT") {
      setSlotId("");
      void slots.reload();
    }
  };

  return (
    <section className="grid gap-3">
      <h2 className="font-heading text-h3 font-medium">Choose another time</h2>
      <p className="text-hero-sub leading-relaxed text-muted">You&apos;ve paid, but the time you chose is no longer free. Pick another, and you won&apos;t be charged again.</p>
      {slots.status === "loading" && <Notice>Loading the free times...</Notice>}
      {slots.status === "error" && <Notice>{slots.message}</Notice>}
      {slots.status === "ready" && slots.items.length === 0 && <Notice>There are no free times right now. Please check again soon, or email {SUPPORT}.</Notice>}
      {slots.status === "ready" && slots.items.length > 0 && <SlotPicker slots={slots.items} value={slotId} onPick={(s) => setSlotId(s.slotId)} />}
      <div>
        <button type="button" onClick={save} disabled={!slotId || busy} className={button}>
          {busy ? "Saving..." : "Confirm this time"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-hero-sub leading-snug text-[#b23a3f]">
          {error}
        </p>
      )}
    </section>
  );
}

/** The link or session is gone: the booking reference, then a code sent to the booker's email, gives access again. */
function Recover({ registrationId, onDone, onRecovered }: { registrationId: string; onDone: (id: string) => void; onRecovered: () => Promise<unknown> }) {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verification, setVerification] = useState<{ id: string; verified: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const mail = email.trim().toLowerCase();

  const send = async () => {
    setBusy(true);
    setError("");
    const r = await sendEmailCode(mail);
    setBusy(false);
    if (!r.ok) return setError(r.message);
    setCode("");
    setVerification({ id: r.data.verificationId, verified: false });
  };

  const verifyAndRecover = async () => {
    if (!verification) return;
    setBusy(true);
    setError("");
    const v = await verifyEmailCode(verification.id, mail, code);
    if (!v.ok || !v.data.verified) {
      setBusy(false);
      setError(v.ok ? "That code isn't right. Please check it and try again." : v.message);
      if (!v.ok && v.code === "EMAIL_CODE_INVALID") setCode("");
      return;
    }
    const r = await recoverBooking(reference.trim(), mail, v.data.verificationId);
    setBusy(false);
    if (!r.ok) return setError(r.message);
    if (r.data.registrationId === registrationId) await onRecovered();
    else onDone(r.data.registrationId);
  };

  return (
    <section className="grid gap-[calc(14*var(--u))]">
      <Notice>
        To see this booking, enter the registration reference from your email and the email address you booked with. We&apos;ll send a code to check it&apos;s yours.
      </Notice>
      <div className="grid gap-3 @min-[401px]:grid-cols-2">
        <Field label="Registration reference" required>
          <TextInput value={reference} onChange={(e) => setReference(e.target.value)} placeholder="IMSA-ABC123DEF456" maxLength={40} autoCapitalize="characters" />
        </Field>
        <Field label="Email address" required>
          <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" maxLength={254} />
        </Field>
      </div>
      {verification ? (
        <div className="grid gap-3">
          <Field label="Six digit code" required>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && code.length === 6 && void verifyAndRecover()}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              className={`${inputBase} px-3 text-center font-mono tracking-[0.5em]`}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-[calc(12*var(--u))]">
            <button type="button" onClick={verifyAndRecover} disabled={code.length !== 6 || busy || !reference.trim()} className={button}>
              {busy ? "Checking..." : "See my booking"}
            </button>
            <button type="button" onClick={send} disabled={busy} className={linkButton}>
              Send a new code
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button type="button" onClick={send} disabled={busy || !reference.trim() || !/^\S+@\S+\.\S+$/.test(mail)} className={button}>
            {busy ? "Sending..." : "Send code"}
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="text-hero-sub leading-snug text-[#b23a3f]">
          {error}
        </p>
      )}
    </section>
  );
}
