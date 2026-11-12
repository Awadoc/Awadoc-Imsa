"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LuCheck, LuChevronDown, LuChevronLeft, LuChevronRight, LuTrash2 } from "react-icons/lu";
import DataProtectionModal from "@/components/DataProtectionModal";
import { getSlots, sendEmailCode, verifyEmailCode } from "@/app/actions/imsa";
import {
  addDays,
  birthYears,
  CHILDREN,
  COUNTRIES,
  dayLabel,
  GENDERS,
  IVF_OPTIONS,
  LAB_OPTIONS,
  DEPENDENT_RELATIONSHIPS,
  RELATIONSHIPS,
  watLabel,
  watParts,
  watToday,
  weekdayOf,
} from "@/lib/imsa/map";
import type { ImsaConfig, Slot } from "@/lib/imsa/types";
import { useLoaderStore } from "@/store/useLoaderStore";
import { proofIsFresh, useBookingStore, type Genotype } from "@/store/useBookingStore";
import { chosen, Field, inputBase, Notice, SelectInput, Tick, TextInput } from "@/components/booking/fields";

/** An amount from the booking service (kobo, which is 1/100 of a naira) shown as naira. This is the amount actually charged. */
export function Naira({ minor }: { minor: number }) {
  return (
    <>
      <span className="font-sans">₦</span>
      {(minor / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}
    </>
  );
}

const DIAL_CODES = ["+234", "+233", "+254", "+27", "+44", "+1", "+971", "+49", "+33", "+353"];
// Flag files live in /public/flags (two-letter codes). Countries without a file have no flag.
const FLAG: Record<string, string> = {
  Nigeria: "ng", Ghana: "gh", Kenya: "ke", "South Africa": "za", Cameroon: "cm", Senegal: "sn", Egypt: "eg",
  "United Kingdom": "gb", Ireland: "ie", "United States": "us", Canada: "ca", "United Arab Emirates": "ae",
  Germany: "de", France: "fr", Netherlands: "nl", Australia: "au",
};
const flagIcon = (country: string) =>
  FLAG[country] ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/flags/${FLAG[country]}.svg`} alt="" width={20} height={14} className="h-3.5 w-5 shrink-0 rounded-xs object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />
  ) : (
    <span aria-hidden="true" className="h-3.5 w-5 shrink-0 rounded-xs bg-ink/10" />
  );
// The same flag files for the country-code list (+1 shows the US flag).
const DIAL_FLAG: Record<string, string> = {
  "+234": "ng", "+233": "gh", "+254": "ke", "+27": "za", "+44": "gb", "+1": "us", "+971": "ae", "+49": "de", "+33": "fr", "+353": "ie",
};
const dialFlagIcon = (code: string) =>
  DIAL_FLAG[code] ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/flags/${DIAL_FLAG[code]}.svg`} alt="" width={20} height={14} className="h-3.5 w-5 shrink-0 rounded-xs object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />
  ) : null;

const GENOTYPES: { code: Genotype; caption: string }[] = [
  { code: "AS", caption: "Trait" },
  { code: "AC", caption: "Trait" },
  { code: "SS", caption: "Sickle cell" },
  { code: "SC", caption: "HbSC" },
  { code: "?", caption: "Not sure" },
];

// ---- Step 1: you ---------------------------------------------------------------------------

const GENOTYPE_LABEL = (g: { code: Genotype; caption: string }) => `${g.code} · ${g.caption}`;

// A dropdown of the five genotypes ("AS · Trait", ...). The stored value is just the code.
function GenotypePicker({ label, value, onPick }: { label: string; value: Genotype | ""; onPick: (g: Genotype) => void }) {
  const current = GENOTYPES.find((g) => g.code === value);
  return (
    <Field label={label} required>
      <SelectInput
        aria-label={label}
        value={current ? GENOTYPE_LABEL(current) : ""}
        onChange={(v) => {
          const hit = GENOTYPES.find((g) => GENOTYPE_LABEL(g) === v);
          if (hit) onPick(hit.code);
        }}
        options={GENOTYPES.map(GENOTYPE_LABEL)}
        placeholder="Select a genotype"
      />
    </Field>
  );
}

// Step 2: who the booking is for. A dependent (for example a child) is booked by a parent or guardian, who stays the contact and pays.
export function StepWho() {
  const { data, set } = useBookingStore();
  const opts = [
    { id: "self" as const, t: "Myself", d: "I am the patient." },
    { id: "dependent" as const, t: "Someone else", d: "For example, my child." },
  ];
  return (
    <div className="grid gap-4">
      <div role="radiogroup" aria-label="Who is this booking for?" className="grid gap-3 @xl:grid-cols-2">
        {opts.map((o) => {
          const on = data.who === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => set({ who: o.id })}
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 text-left transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${on ? "border-brand bg-tint" : "border-line bg-card hover:border-brand/60"}`}
            >
              <Tick on={on} />
              <span className="grid gap-1">
                <span className="font-heading text-fl-lead font-semibold">{o.t}</span>
                <span className="text-fl-small text-muted">{o.d}</span>
              </span>
            </button>
          );
        })}
      </div>
      {data.who === "dependent" && (
        <div className="max-w-md">
          <Field label="Your relationship to the patient" required>
            <SelectInput value={data.dependentRel} onChange={(v) => set({ dependentRel: v })} options={[...DEPENDENT_RELATIONSHIPS]} placeholder="Select an option" />
          </Field>
        </div>
      )}
    </div>
  );
}

// Step 2: who you are and how to reach you. Step 3: the health details. They are two short steps so neither needs scrolling.
export function StepAbout() {
  const { data, set } = useBookingStore();
  const mine = data.who === "dependent" ? "Your " : "";
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 @min-[401px]:grid-cols-2">
        <Field label={`${mine}first name`.replace(/^f/, "F")} required>
          <TextInput value={data.first1} onChange={(e) => set({ first1: e.target.value })} placeholder="e.g. Jane" autoComplete="given-name" maxLength={70} />
        </Field>
        <Field label={`${mine}last name`.replace(/^l/, "L")} required>
          <TextInput value={data.last1} onChange={(e) => set({ last1: e.target.value })} placeholder="e.g. Doe" autoComplete="family-name" maxLength={70} />
        </Field>
      </div>
      <div className="grid items-start gap-3 @min-[401px]:grid-cols-2">
        <Field label="Email address" required hint="We'll send a code to this address to check it's yours. Your booking details and receipt are sent here.">
          <TextInput type="email" value={data.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@example.com" autoComplete="email" maxLength={254} />
        </Field>
        <div className="grid min-w-0 gap-1.25">
          <span className="text-micro text-muted">
            WhatsApp number<span className="text-[#e5532d]"> *</span>
          </span>
          <div className="grid grid-cols-[116px_1fr] gap-2">
            <SelectInput aria-label="Country code" value={data.dial} onChange={(v) => set({ dial: v })} options={DIAL_CODES} placeholder="+" className="w-29" optionIcon={dialFlagIcon} />
            <TextInput type="tel" inputMode="tel" value={data.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="803 000 0000" autoComplete="tel-national" aria-label="WhatsApp number" maxLength={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepHealth() {
  const { data, set } = useBookingStore();
  const years = useMemo(() => birthYears(), []);
  const dep = data.who === "dependent";
  const my = dep ? "Patient's" : "Your";
  return (
    <div className="grid gap-3 @min-[401px]:grid-cols-2 @min-[760px]:grid-cols-3">
      {dep && (
        <>
          <Field label="Patient's first name" required>
            <TextInput value={data.patientFirst} onChange={(e) => set({ patientFirst: e.target.value })} maxLength={70} />
          </Field>
          <Field label="Patient's last name" required>
            <TextInput value={data.patientLast} onChange={(e) => set({ patientLast: e.target.value })} maxLength={70} />
          </Field>
        </>
      )}
      {!dep && (
        <Field label="Relationship" required>
          <SelectInput value={data.relationship} onChange={(v) => set({ relationship: v })} options={[...RELATIONSHIPS]} placeholder="Select an option" />
        </Field>
      )}
      <Field label={`${my} gender`} required>
        <SelectInput value={data.gender1} onChange={(v) => set({ gender1: v })} options={[...GENDERS]} placeholder="Select an option" />
      </Field>
      <Field label={`${my} year of birth`} required>
        <SelectInput value={data.yob1} onChange={(v) => set({ yob1: v })} options={years} placeholder="Select a year" />
      </Field>
      <GenotypePicker label={`${my} genotype`} value={data.geno1} onPick={(g) => set({ geno1: g })} />
      <Field label="Genotype lab results" required>
        <SelectInput value={data.lab} onChange={(v) => set({ lab: v })} options={[...LAB_OPTIONS]} placeholder="Select an option" />
      </Field>
      {!dep && (
        <>
          <Field label="Tried IVF before?" required>
            <SelectInput value={data.ivf} onChange={(v) => set({ ivf: v })} options={[...IVF_OPTIONS]} placeholder="Select an option" />
          </Field>
          <Field label="Children together already" optional>
            <SelectInput value={data.children} onChange={(v) => set({ children: v })} options={[...CHILDREN]} placeholder="Select an option" />
          </Field>
        </>
      )}
    </div>
  );
}

// ---- Step 2: your partner ------------------------------------------------------------------

const GENO_NAME: Record<string, string> = {
  AA: "No sickle cell, no trait",
  AS: "Trait (carrier)",
  AC: "Trait (carrier)",
  SS: "Sickle cell disease",
  SC: "HbSC disease",
  CC: "HbCC (mild)",
};

function alleles(g: Genotype): string[] | null {
  return g === "?" ? null : g === "SC" ? ["S", "C"] : g === "SS" ? ["S", "S"] : g === "AS" ? ["A", "S"] : ["A", "C"];
}

/** Chance of each genotype in a child, from the two parents' genotypes (one allele from each). */
function odds(g1: Genotype, g2: Genotype) {
  const a = alleles(g1), b = alleles(g2);
  if (!a || !b) return null;
  const order = "ASC";
  const tally: Record<string, number> = {};
  for (const x of a)
    for (const y of b) {
      const key = [x, y].sort((p, q) => order.indexOf(p) - order.indexOf(q)).join("");
      tally[key] = (tally[key] ?? 0) + 25;
    }
  return Object.entries(tally);
}

export function StepPartner() {
  const { data, set } = useBookingStore();
  const years = useMemo(() => birthYears(), []);
  const result = data.geno1 && data.geno2 ? odds(data.geno1, data.geno2) : null;
  return (
    <div className="grid gap-[calc(22*var(--u))]">
      <div className="grid gap-3 @min-[401px]:grid-cols-2">
        <Field label="Partner's first name" required>
          <TextInput value={data.first2} onChange={(e) => set({ first2: e.target.value })} placeholder="e.g. John" maxLength={70} />
        </Field>
        <Field label="Partner's last name" required>
          <TextInput value={data.last2} onChange={(e) => set({ last2: e.target.value })} placeholder="e.g. Doe" maxLength={70} />
        </Field>
      </div>
      <div className="grid gap-3 @min-[401px]:grid-cols-2">
        <Field label="Partner's gender" required>
          <SelectInput value={data.gender2} onChange={(v) => set({ gender2: v })} options={[...GENDERS]} placeholder="Select an option" />
        </Field>
        <Field label="Partner's year of birth" required>
          <SelectInput value={data.yob2} onChange={(v) => set({ yob2: v })} options={years} placeholder="Select a year" />
        </Field>
      </div>
      <GenotypePicker label="Partner's genotype" value={data.geno2} onPick={(g) => set({ geno2: g })} />
      {result && (
        <div className="noura-msg rounded-[10px] border border-brand/40 bg-brand/8 p-[1em]">
          <div className="mb-[0.6em] text-hero-sub font-semibold">Odds for each pregnancy</div>
          <ul className="grid gap-[0.4em] text-hero-sub">
            {result.map(([geno, pct]) => (
              <li key={geno} className="flex items-center justify-between gap-3">
                <span>
                  <strong className="font-semibold">{geno}</strong> <span className="text-muted">· {GENO_NAME[geno]}</span>
                </span>
                <span className="font-bold text-accent">{pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Notice>The full package price depends on the woman&apos;s age, so we use the woman&apos;s year of birth. You&apos;ll see the exact price before you pay.</Notice>
    </div>
  );
}

// ---- Step 3: where you live ----------------------------------------------------------------

export function StepLocation() {
  const { data, set } = useBookingStore();
  return (
    <div className="grid gap-3.5">
      <Field label="Street address" required>
        <TextInput value={data.street} onChange={(e) => set({ street: e.target.value })} placeholder="House number and street name" autoComplete="street-address" maxLength={300} />
      </Field>
      <div className="grid gap-3 @min-[401px]:grid-cols-2">
        <Field label="City or town" required>
          <TextInput value={data.city} onChange={(e) => set({ city: e.target.value })} autoComplete="address-level2" maxLength={150} />
        </Field>
        <Field label="Postal code" optional>
          <TextInput value={data.postal} onChange={(e) => set({ postal: e.target.value })} autoComplete="postal-code" maxLength={32} />
        </Field>
      </div>
      <div className="grid gap-3 @min-[401px]:grid-cols-2">
        <Field label="Country" required>
          <SelectInput value={data.country} onChange={(v) => set({ country: v })} options={COUNTRIES} placeholder="Choose your country" optionIcon={flagIcon} />
        </Field>
        <Field label="State, province or region" required>
          <TextInput value={data.state} onChange={(e) => set({ state: e.target.value })} placeholder="e.g. Lagos" autoComplete="address-level1" maxLength={150} />
        </Field>
      </div>
    </div>
  );
}

// ---- Step 4: verify your email -------------------------------------------------------------

const RESEND_SECONDS = 60;

export function StepVerify() {
  const { data, proof, setProof } = useBookingStore();
  const email = data.email.trim().toLowerCase();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"send" | "verify" | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  const forThisEmail = proof && proof.email === email ? proof : null;
  const verified = proofIsFresh(proof, email);
  const expired = !!forThisEmail && forThisEmail.verifiedAt !== null && !verified;
  const sent = !!forThisEmail && forThisEmail.verifiedAt === null;
  const wait = forThisEmail ? Math.max(0, RESEND_SECONDS - Math.floor((now - forThisEmail.sentAt) / 1000)) : 0;

  // Counts the resend wait down.
  useEffect(() => {
    if (wait <= 0) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [wait]);

  async function send() {
    setBusy("send");
    setError("");
    // The AwaDoc loader covers the screen while the code is sent, for at least a moment so it never just flashes.
    useLoaderStore.getState().show();
    const started = Date.now();
    const r = await sendEmailCode(email);
    const wait = 700 - (Date.now() - started);
    if (wait > 0) await new Promise((res) => setTimeout(res, wait));
    useLoaderStore.getState().hide();
    setBusy(null);
    if (!r.ok) {
      setError(r.message);
      return;
    }
    setCode("");
    setNow(Date.now());
    setProof({ email, id: r.data.verificationId, sentAt: Date.now(), verifiedAt: null });
  }

  async function verify() {
    if (!forThisEmail || code.length !== 6) return;
    setBusy("verify");
    setError("");
    const r = await verifyEmailCode(forThisEmail.id, email, code);
    setBusy(null);
    if (!r.ok) {
      setError(r.message);
      if (r.code === "EMAIL_CODE_INVALID") setCode("");
      return;
    }
    if (!r.data.verified) {
      setError("That code isn't right. Please check it and try again.");
      return;
    }
    setProof({ ...forThisEmail, id: r.data.verificationId, verifiedAt: Date.now() });
  }

  if (verified)
    return (
      <div className="grid gap-[calc(14*var(--u))]">
        <div className={`flex items-center gap-[0.9em] rounded-xl border p-[1em] text-hero-sub ${chosen}`}>
          <span className="flex size-[2em] shrink-0 items-center justify-center rounded-full bg-brand text-[#07110c]">
            <LuCheck aria-hidden="true" />
          </span>
          <span>
            <strong className="block font-semibold">Email verified</strong>
            <span className="text-muted">{email}</span>
          </span>
        </div>
        <Notice>This check stays valid for 15 minutes. Continue to choose how you&apos;d like to book.</Notice>
      </div>
    );

  return (
    <div className="grid gap-[calc(18*var(--u))]">
      <p className="text-hero-sub leading-relaxed text-muted">
        We&apos;ll email a six digit code to <strong className="font-semibold text-ink">{email}</strong> to check the address is yours.
      </p>
      {expired && <Notice>Your email check has expired. Please ask for a new code.</Notice>}

      {sent ? (
        <div className="grid gap-[calc(12*var(--u))]">
          <Field label="Six digit code" required>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label="Six digit code"
              placeholder="000000"
              maxLength={6}
              className={`${inputBase} px-3 text-center font-mono tracking-[0.5em]`}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-[calc(12*var(--u))]">
            <button
              type="button"
              onClick={verify}
              disabled={code.length !== 6 || busy !== null}
              className="h-11 cursor-pointer rounded-full bg-ink px-6 text-btn font-semibold text-bg transition-colors hover:bg-brand hover:text-[#07110c] disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-muted/60"
            >
              {busy === "verify" ? "Checking..." : "Verify"}
            </button>
            <button
              type="button"
              onClick={send}
              disabled={wait > 0 || busy !== null}
              className="cursor-pointer text-hero-sub font-semibold text-accent underline underline-offset-4 disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
            >
              {busy === "send" ? "Sending..." : wait > 0 ? `Send a new code in ${wait}s` : "Send a new code"}
            </button>
          </div>
          <p className="text-hero-sub leading-snug text-muted">The code lasts about 10 minutes. Check your spam folder if it doesn&apos;t arrive.</p>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={send}
            disabled={busy !== null}
            className="h-11 cursor-pointer rounded-full bg-ink px-6 text-btn font-semibold text-bg transition-colors hover:bg-brand hover:text-[#07110c] disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-muted/60"
          >
            {busy === "send" ? "Sending..." : "Send code"}
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="text-hero-sub leading-snug text-[#b23a3f]">
          {error}
        </p>
      )}
    </div>
  );
}

// ---- Step 5: how you want to book ----------------------------------------------------------

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const pad = (n: number) => String(n).padStart(2, "0");

/** A month calendar of WAT days. `isOff` says which days can't be picked. */
function Calendar({ value, onPick, isOff, legend, startDay }: { value: string; onPick: (iso: string) => void; isOff: (iso: string) => boolean; legend: string; startDay: string }) {
  const todayKey = watToday();
  const [ty, tm] = todayKey.split("-").map(Number);
  const first = (value || startDay || todayKey).split("-").map(Number);
  const [view, setView] = useState({ y: first[0], m: first[1] - 1 });
  const [months, setMonths] = useState(false); // the title opens a list of the next 12 months

  const lead = (new Date(Date.UTC(view.y, view.m, 1)).getUTCDay() + 6) % 7; // Monday first
  const count = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const atCurrent = view.y === ty && view.m === tm - 1;
  const shift = (by: number) => {
    const d = new Date(Date.UTC(view.y, view.m + by, 1));
    setView({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };
  const arrow = "flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-brand/15 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit";

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-expanded={months}
          onClick={() => setMonths((v) => !v)}
          className="flex min-h-9 cursor-pointer items-center gap-[0.4em] rounded-lg px-1 text-hero-sub font-semibold transition-colors hover:text-accent"
        >
          {MONTHS[view.m]} {view.y}
          <LuChevronDown aria-hidden="true" className={`transition-transform duration-200 ${months ? "rotate-180" : ""}`} />
        </button>
        <div className="flex gap-1">
          <button type="button" aria-label="Previous month" disabled={atCurrent} onClick={() => shift(-1)} className={arrow}>
            <LuChevronLeft aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next month" onClick={() => shift(1)} className={arrow}>
            <LuChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      {months ? (
        <div className="book-pop grid grid-cols-3 gap-1.5">
          {Array.from({ length: 12 }, (_, i) => {
            const d = new Date(Date.UTC(ty, tm - 1 + i, 1));
            const on = d.getUTCFullYear() === view.y && d.getUTCMonth() === view.m;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setView({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
                  setMonths(false);
                }}
                className={`min-h-11 cursor-pointer rounded-lg border text-hero-sub transition-colors ${on ? `${chosen} font-semibold` : "border-transparent hover:bg-brand/10"}`}
              >
                {MONTHS[d.getUTCMonth()].slice(0, 3)}
                {d.getUTCFullYear() !== ty && <span className="block text-hero-sub text-muted">{d.getUTCFullYear()}</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS.map((d) => (
            <span key={d} className="pb-1.5 text-hero-sub font-semibold text-muted">
              {d}
            </span>
          ))}
          {Array.from({ length: lead }).map((_, i) => (
            <span key={`b${i}`} />
          ))}
          {Array.from({ length: count }).map((_, i) => {
            const key = `${view.y}-${pad(view.m + 1)}-${pad(i + 1)}`;
            const off = key < todayKey || isOff(key);
            const on = value === key;
            return (
              <button
                key={key}
                type="button"
                disabled={off}
                aria-pressed={on}
                aria-label={dayLabel(key)}
                onClick={() => onPick(key)}
                className={`relative mx-auto flex aspect-square w-full max-w-11 min-w-7 cursor-pointer items-center justify-center rounded-lg text-hero-sub font-medium transition-colors disabled:cursor-not-allowed disabled:text-ink/20 ${
                  on ? "bg-brand font-bold text-[#07110c]" : "hover:bg-brand/15"
                }`}
              >
                {i + 1}
                {key === todayKey && <span aria-hidden="true" className="absolute bottom-[10%] size-1 rounded-full bg-[#f5a524]" />}
              </button>
            );
          })}
        </div>
      )}
      <p className="mt-3 flex items-center gap-[0.5em] text-hero-sub text-muted">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#f5a524]" />
        {legend}
      </p>
    </div>
  );
}

// Half hour times for a package preference: morning 8:00 to 12:00, afternoon 12:00 to 5:00 (West Africa Time).
type Half = { hour: number; minute: 0 | 30; ampm: "AM" | "PM" };
const TIME_GROUPS: { name: string; range: string; slots: Half[] }[] = [
  {
    name: "Morning",
    range: "8:00 AM to 12:00 PM",
    slots: [8, 9, 10, 11].flatMap((hour) => ([0, 30] as const).map((minute) => ({ hour, minute, ampm: "AM" as const }))),
  },
  {
    name: "Afternoon",
    range: "12:00 PM to 5:00 PM",
    slots: [12, 1, 2, 3, 4].flatMap((hour) => ([0, 30] as const).map((minute) => ({ hour, minute, ampm: "PM" as const }))),
  },
];

export function formatTime(d: { hour: number | null; minute: number; ampm: string }) {
  return d.hour === null ? "" : `${d.hour}:${pad(d.minute)} ${d.ampm}`;
}

function PreferredTimes() {
  const { data, set } = useBookingStore();
  const hasDate = !!data.date;
  return (
    <div>
      <p className="font-heading text-lead font-medium leading-tight">{hasDate ? dayLabel(data.date) : "Pick a date first"}</p>
      <p className="mt-1 text-hero-sub text-muted">Times are in West Africa Time</p>
      <div className={`mt-4 grid gap-5 ${hasDate ? "" : "pointer-events-none opacity-40"}`}>
        {TIME_GROUPS.map((g) => (
          <div key={g.name}>
            <div className="mb-2 flex items-baseline justify-between gap-3 border-b border-ink/10 pb-2">
              <h4 className="font-heading text-hero-sub font-semibold">{g.name}</h4>
              <span className="text-hero-sub text-muted">{g.range}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 @min-[401px]:grid-cols-4">
              {g.slots.map((sl) => {
                const on = data.hour === sl.hour && data.minute === sl.minute && data.ampm === sl.ampm;
                return (
                  <button
                    key={`${sl.hour}${sl.minute}${sl.ampm}`}
                    type="button"
                    disabled={!hasDate}
                    aria-pressed={on}
                    onClick={() => set({ hour: sl.hour, minute: sl.minute, ampm: sl.ampm })}
                    className={`h-10 cursor-pointer rounded-lg text-hero-sub font-medium transition-colors ${on ? "bg-brand font-bold text-[#07110c]" : "bg-ink/6 hover:bg-brand/15"}`}
                  >
                    {sl.hour}:{pad(sl.minute)} {sl.ampm}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// The slots the service has published, from now to about three months ahead.
export function useSlots() {
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; items: Slot[]; message: string }>({ status: "loading", items: [], message: "" });
  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading" }));
    const from = new Date();
    const to = new Date(from.getTime() + 90 * 24 * 60 * 60 * 1000);
    const r = await getSlots(from.toISOString(), to.toISOString());
    if (!r.ok) setState({ status: "error", items: [], message: r.message });
    else setState({ status: "ready", items: r.data.items, message: "" });
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return { ...state, reload: load };
}

/** Pick a published consultation slot: a calendar of the days that have one, then that day's times. */
/** `mode` "both" shows the calendar beside the times; on a phone the step shows them one after the other ("calendar", then "times"), with `day` kept by the caller. */
export function SlotPicker({
  slots,
  value,
  onPick,
  day: dayProp,
  onDay,
  mode = "both",
}: {
  slots: Slot[];
  value: string;
  onPick: (slot: Slot) => void;
  day?: string;
  onDay?: (day: string) => void;
  mode?: "both" | "calendar" | "times";
}) {
  const byDay = useMemo(() => {
    const m = new Map<string, Slot[]>();
    for (const s of slots) {
      const day = watParts(s.startsAt).day;
      m.set(day, [...(m.get(day) ?? []), s]);
    }
    return m;
  }, [slots]);
  const chosenSlot = slots.find((s) => s.slotId === value);
  const [dayState, setDayState] = useState(chosenSlot ? watParts(chosenSlot.startsAt).day : "");
  const day = dayProp ?? dayState;
  const setDay = onDay ?? setDayState;
  const firstDay = [...byDay.keys()].sort()[0] ?? "";
  const times = day ? (byDay.get(day) ?? []) : [];

  return (
    <div className={`grid gap-3 ${mode === "both" ? "@xl:grid-cols-2" : ""}`}>
      {mode !== "times" && (
        <div className="min-w-0 rounded-[18px] border border-ink/10 bg-ink/3 p-4">
          <Calendar value={day} onPick={setDay} isOff={(iso) => !byDay.has(iso)} legend="Days with a free time are shown in full" startDay={firstDay} />
        </div>
      )}
      {mode !== "calendar" && (
        <div className="min-w-0 rounded-[18px] border border-ink/10 bg-ink/3 p-4">
          <p className="font-heading text-lead font-medium leading-tight">{day ? dayLabel(day) : "Pick a date first"}</p>
          <p className="mt-1 text-hero-sub text-muted">Times are in West Africa Time</p>
          <div className={`mt-4 grid grid-cols-3 gap-2 @min-[401px]:grid-cols-4 ${day ? "" : "pointer-events-none opacity-40"}`}>
            {times.map((s) => {
              const on = s.slotId === value;
              return (
                <button
                  key={s.slotId}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onPick(s)}
                  className={`h-10 cursor-pointer rounded-lg text-hero-sub font-medium transition-colors ${on ? "bg-brand font-bold text-[#07110c]" : "bg-ink/6 hover:bg-brand/15"}`}
                >
                  {watParts(s.startsAt).time}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full cursor-pointer items-center gap-[0.9em] rounded-[10px] border border-ink/10 bg-bg px-[1em] py-[0.85em] text-left text-hero-sub leading-snug transition-colors hover:border-ink/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
    >
      <span className="min-w-0 flex-1">{children}</span>
      <span aria-hidden="true" className={`relative h-[1.6em] w-[2.8em] shrink-0 rounded-full transition-colors ${on ? "bg-brand" : "bg-ink/15"}`}>
        <span className={`absolute left-[0.2em] top-[0.2em] size-[1.2em] rounded-full bg-white shadow transition-transform ${on ? "translate-x-[1.2em]" : ""}`} />
      </span>
    </button>
  );
}

/** Whether a package preference can be made on a WAT day (inside the service's window, far enough ahead, not on an excluded weekday). */
export function packageDayOff(iso: string, c: ImsaConfig) {
  const earliest = addDays(watToday(), c.minLeadDays);
  const from = c.startDate && c.startDate > earliest ? c.startDate : earliest;
  return iso < from || (c.endDate !== "" && iso > c.endDate) || c.excludedWeekdays.includes(weekdayOf(iso));
}

export function StepService() {
  const { data, set, config } = useBookingStore();
  if (!config) return null;
  const pkg = config.packages.find((p) => p.id === config.defaultPackageId) ?? config.packages[0];
  const products = [
    {
      id: "virtual" as const,
      title: "Virtual counselling",
      price: <Naira minor={config.virtualFeeMinor} />,
      sub: `A one-to-one online session of ${config.slotMinutes} minutes with an AwaDoc doctor. Available in any country.`,
      hint: "Pick a time that suits you",
      off: false,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      ),
    },
    {
      id: "package" as const,
      title: "Full treatment package",
      price: pkg ? <Naira minor={config.fullPackageFeeMinor} /> : null,
      sub: "Counselling, IVF and embryo testing (PGT-M) at IMSA, Abuja.",
      hint: "Price depends on age. Our team confirms your date",
      off: !config.packageEnabled,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div role="radiogroup" aria-label="What would you like to book?" className="grid gap-3 @xl:grid-cols-2">
      {products.map((p) => {
        const on = data.product === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={p.off}
            onClick={() => set({ product: p.id })}
            className={`relative grid content-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
              p.off ? "cursor-not-allowed border-line bg-bg opacity-45" : `cursor-pointer ${on ? "border-brand bg-tint" : "border-line bg-card hover:border-brand/60"}`
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-tint text-accent">{p.icon}</span>
                <span className="font-heading text-fl-lead font-semibold">{p.title}</span>
              </span>
              <Tick on={on} />
            </span>
            <span className="text-fl-kicker leading-snug text-muted">{p.off ? "Not open for booking right now" : p.sub}</span>
            {p.price && !p.off && (
              <span className="font-heading text-fl-lead leading-tight font-semibold">
                {p.id === "package" && <span className="mr-1.5">From</span>}
                {p.price}
              </span>
            )}
            {!p.off && <span className="text-fl-kicker text-muted">{p.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

// True on a phone-sized screen, where the date and the time are asked one after the other instead of side by side.
function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return narrow;
}

export function StepBook() {
  const { data, set, config } = useBookingStore();
  const slots = useSlots();
  const narrow = useNarrow();
  // On a phone: first the date, then (sliding in) the time and the consents.
  const [panel, setPanel] = useState<"date" | "time">(() => (data.product === "virtual" ? (data.slotId ? "time" : "date") : data.date ? "time" : "date"));
  const [vday, setVday] = useState(() => (data.slotStartsAt ? watParts(data.slotStartsAt).day : ""));
  if (!config) return null;

  const showDate = !narrow || panel === "date";
  const showTime = !narrow || panel === "time";
  const changeDate = narrow && panel === "time" && (
    <button type="button" onClick={() => setPanel("date")} className="flex w-fit cursor-pointer items-center gap-1 text-hero-sub font-semibold text-accent">
      <LuChevronLeft aria-hidden="true" className="size-4" />
      Change date
    </button>
  );

  return (
    <div key={narrow ? panel : "all"} className={`grid gap-[calc(26*var(--u))] ${narrow ? "book-page" : ""}`}>
      {data.product === "virtual" && (
        <section className="grid gap-3">
          <h3 className="font-heading text-hero-sub font-semibold">
            {narrow ? (panel === "date" ? "Pick a date" : "Pick a time") : "Choose a date and time"}
            <span className="text-[#e5532d]"> *</span>
          </h3>
          {changeDate}
          {slots.status === "loading" && <Notice>Loading the free times...</Notice>}
          {slots.status === "error" && (
            <Notice>
              {slots.message}{" "}
              <button type="button" onClick={() => void slots.reload()} className="cursor-pointer font-semibold text-accent underline underline-offset-4">
                Try again
              </button>
            </Notice>
          )}
          {slots.status === "ready" && slots.items.length === 0 && <Notice>There are no free consultation times right now. Please check again soon, or book the full treatment package.</Notice>}
          {slots.status === "ready" && slots.items.length > 0 && (
            <>
              <SlotPicker
                slots={slots.items}
                value={data.slotId}
                onPick={(s) => set({ slotId: s.slotId, slotStartsAt: s.startsAt })}
                day={vday}
                onDay={(d) => {
                  setVday(d);
                  if (narrow) setPanel("time");
                }}
                mode={!narrow ? "both" : panel === "date" ? "calendar" : "times"}
              />
              {showTime && <p className="text-hero-sub leading-snug text-muted">Showing a time doesn&apos;t hold it. Someone else may take it first; if so, you&apos;ll be asked to choose another.</p>}
            </>
          )}
        </section>
      )}

      {data.product === "package" && (
        <section className="grid gap-3">
          <h3 className="font-heading text-hero-sub font-semibold">
            {narrow ? (panel === "date" ? "Pick a date" : "Pick a time") : "Your preferred date and time"}
            <span className="text-[#e5532d]"> *</span>
          </h3>
          {changeDate}
          <div className={`grid gap-3 ${!narrow ? "@xl:grid-cols-2" : ""}`}>
            {showDate && (
              <div className="min-w-0 rounded-[18px] border border-ink/10 bg-ink/3 p-4">
                <Calendar
                  value={data.date}
                  onPick={(d) => {
                    set({ date: d });
                    if (narrow) setPanel("time");
                  }}
                  isOff={(iso) => packageDayOff(iso, config)}
                  legend="Today · only days we can take bookings are shown"
                  startDay={addDays(watToday(), config.minLeadDays)}
                />
              </div>
            )}
            {showTime && (
              <div className="min-w-0 rounded-[18px] border border-ink/10 bg-ink/3 p-4">
                <PreferredTimes />
              </div>
            )}
          </div>
          {showTime && <p className="text-hero-sub leading-snug text-muted">This is the time you&apos;d like. Our team confirms your appointment after payment.</p>}
        </section>
      )}

      {showTime && (
        <section className="grid gap-[calc(10*var(--u))]">
          <h3 className="font-heading text-hero-sub font-semibold">
            Consent<span className="text-[#e5532d]"> *</span>
          </h3>
          <Toggle on={data.consentCare} onChange={(v) => set({ consentCare: v })}>
            AwaDoc may process our genotype and health information to support our care.
          </Toggle>
          <Toggle on={data.consentShare} onChange={(v) => set({ consentShare: v })}>
            AwaDoc may share our file with IMSA.
          </Toggle>
          <Toggle on={data.consentAuthority} onChange={(v) => set({ consentAuthority: v })}>
            I have the authority to make this booking, and my partner knows I&apos;m booking for us.
          </Toggle>
          <DataProtectionModal className="flex w-fit cursor-pointer items-center gap-[0.5em] text-hero-sub font-semibold text-accent underline underline-offset-4">Read how we protect your data</DataProtectionModal>
        </section>
      )}
    </div>
  );
}

// ---- Step 6: lab reports -------------------------------------------------------------------

const REPORT_TYPES = /\.(pdf|jpe?g|png|gif|webp|heic|heif)$/i;
const MAX_REPORT = 20 * 1024 * 1024;
const fileSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`);

function UploadTile({ name, file, onPick }: { name: string; file: File | null; onPick: (f: File | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const choose = (f?: File) => {
    if (!f) return;
    if (!REPORT_TYPES.test(f.name)) return setError("Use a PDF or an image (JPEG, PNG, GIF, WebP or HEIC).");
    if (f.size === 0) return setError("That file is empty.");
    if (f.size > MAX_REPORT) return setError("That file is larger than 20 MB.");
    setError("");
    onPick(f);
  };
  const isPdf = !!file && /\.pdf$/i.test(file.name);

  return (
    <div className="grid content-start gap-[calc(6*var(--u))]">
      <input
        ref={ref}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,image/*,application/pdf"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          choose(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {file ? (
        <div className={`flex min-h-[calc(84*var(--u))] items-center gap-[0.9em] rounded-[10px] border p-[0.9em] text-hero-sub ${chosen}`}>
          <span className={`flex size-[2.6em] shrink-0 items-center justify-center rounded-lg text-hero-sub font-bold ${isPdf ? "bg-[#fdecec] text-[#b23a3f]" : "bg-brand/15 text-accent"}`}>{isPdf ? "PDF" : "IMG"}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-ink">{file.name}</span>
            <span className="block text-muted">{fileSize(file.size)}</span>
          </span>
          <button
            type="button"
            onClick={() => onPick(null)}
            aria-label={`Remove ${file.name}`}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-[#fdecec] hover:text-[#b23a3f]"
          >
            <LuTrash2 aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex min-h-[calc(84*var(--u))] w-full cursor-pointer items-center gap-[0.9em] rounded-[10px] border border-dashed border-ink/25 bg-bg p-[0.9em] text-left text-hero-sub transition-colors hover:border-brand hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{name}&apos;s report</span>
            <span className="block truncate text-muted">Tap to choose a photo or PDF</span>
          </span>
        </button>
      )}
      {error && <em className="text-hero-sub not-italic text-[#b23a3f]">{error}</em>}
    </div>
  );
}

export function StepLabs() {
  const { data, set, config } = useBookingStore();

  return (
    <div className="grid gap-[calc(18*var(--u))]">
      {config?.reportsAvailable ? (
        <section className="grid gap-[calc(12*var(--u))]">
          <h3 className="flex flex-wrap items-center gap-[0.6em] font-heading text-hero-sub font-semibold">
            Genotype lab reports
            <span className="rounded-full border border-ink/10 px-[0.7em] py-[0.1em] text-hero-sub font-normal text-muted">Recommended</span>
          </h3>
          <div className="grid gap-[calc(10*var(--u))] @min-[401px]:grid-cols-2">
            <UploadTile name={data.first1.trim() || "Your"} file={data.report1} onPick={(f) => set({ report1: f })} />
            <UploadTile name={data.first2.trim() || "Partner's"} file={data.report2} onPick={(f) => set({ report2: f })} />
          </div>
          <p className="text-hero-sub leading-relaxed text-muted">
            Photo or PDF of a haemoglobin electrophoresis or HPLC report, up to 20 MB each. Only our care team can open them. No report yet? Skip this; we&apos;ll arrange your test.
          </p>
          <DataProtectionModal className="flex w-fit cursor-pointer items-center gap-[0.5em] text-hero-sub font-semibold text-accent underline underline-offset-4">How we protect your reports</DataProtectionModal>
        </section>
      ) : (
        <Notice>Uploading reports isn&apos;t available right now. You can continue without them and share your reports with our team later.</Notice>
      )}
    </div>
  );
}

// ---- Step 7: review and pay ----------------------------------------------------------------

export function StepPay() {
  const { data, receipt, config } = useBookingStore();
  const couple = `${data.first1.trim() || "—"} & ${data.first2.trim() || "—"}`;
  const when =
    data.product === "virtual" && data.slotStartsAt
      ? watLabel(data.slotStartsAt)
      : data.date && data.hour !== null
        ? `${dayLabel(data.date)}, ${formatTime(data)} (West Africa Time)`
        : "—";
  const what = data.product === "virtual" ? "Virtual consultation" : "Full treatment package";
  const files = [data.report1, data.report2].filter((f): f is File => !!f);
  const pricing = receipt?.pricing;
  const sel = pricing?.packageSelection;

  return (
    <div className="grid gap-[calc(22*var(--u))]">
      {pricing ? (
        <div className="overflow-hidden rounded-[14px] bg-[#0b1511] p-[calc(20*var(--u))] text-white shadow-[inset_0_0_80px_-30px_#0a7a5a]">
          <div className="text-hero-sub font-bold uppercase tracking-[0.14em] text-brand">Amount due</div>
          <div className="mt-[0.3em] font-heading text-display font-medium leading-none [-webkit-text-stroke:0.015em_currentColor]">
            <Naira minor={pricing.amountMinor} />
          </div>
          <dl className="mt-[1em] grid divide-y divide-white/12 border-t border-white/12 text-hero-sub">
            {pricing.packageItems.length > 0 ? (
              pricing.packageItems.map((it) => (
                <div key={it.id} className="flex justify-between gap-3 py-[0.7em]">
                  <dt className="text-white/75">{it.name}</dt>
                  <dd className="shrink-0 font-semibold">
                    <Naira minor={it.priceMinor} />
                  </dd>
                </div>
              ))
            ) : (
              <div className="flex justify-between gap-3 py-[0.7em]">
                <dt className="text-white/75">{what}</dt>
                <dd className="shrink-0 font-semibold">
                  <Naira minor={pricing.amountMinor} />
                </dd>
              </div>
            )}
            {sel && (
              <div className="flex justify-between gap-3 py-[0.7em]">
                <dt className="text-white/75">Price band</dt>
                <dd className="min-w-0 text-right font-semibold">{sel.name}</dd>
              </div>
            )}
            {[
              ["Couple", couple],
              [data.product === "virtual" ? "Appointment" : "Preferred time", when],
              ["Reference", receipt.reference],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-[0.7em]">
                <dt className="text-white/75">{k}</dt>
                <dd className="min-w-0 text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-ink/10 bg-ink/3 p-[calc(20*var(--u))]">
          <div className="text-hero-sub font-bold uppercase tracking-[0.14em] text-accent">Check your booking</div>
          <dl className="mt-[0.8em] grid divide-y divide-ink/10 text-hero-sub">
            {[
              ["Booking", what],
              ["Couple", couple],
              ["Email", data.email.trim()],
              [data.product === "virtual" ? "Appointment" : "Preferred time", when],
              ["Genotype reports", files.length ? `${files.length} attached` : "None attached"],
              ...(data.product === "virtual" && config ? [["Price", `₦${(config.virtualFeeMinor / 100).toLocaleString("en-US")}`]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-[0.7em]">
                <dt className="text-muted">{k}</dt>
                <dd className="min-w-0 wrap-break-word text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <Notice>
        {pricing
          ? "Your booking is saved. When you press Pay, you'll go to our payment partner's secure page. Cards, bank transfers and mobile money are charged in naira, and your bank converts if you pay from abroad."
          : data.product === "package"
            ? "When you confirm, we save your booking and show you the exact price for the full package, worked out from the woman's year of birth. Nothing is charged until you press Pay."
            : "When you confirm, we save your booking. Nothing is charged until you press Pay, and your time is held for a short while once you start to pay."}
      </Notice>
    </div>
  );
}
