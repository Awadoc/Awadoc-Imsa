"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const EMAIL = "genomics@awadoc.com";

const CATEGORIES = ["Client interested in PGT-M", "Donor or investor", "Researcher", "Organisation or company", "NGO", "Other"];

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Cameroon", "Senegal", "Ivory Coast", "Egypt", "Ethiopia", "Uganda", "Tanzania",
  "United Kingdom", "United States", "Canada", "Ireland", "Germany", "France", "United Arab Emirates", "Saudi Arabia", "India", "Australia", "Other",
];

const field =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-card px-4 text-[15px] font-normal text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand";
const label = "block text-[14px] font-semibold text-ink";
const optional = "text-[13px] font-normal text-muted";

// A drop down in the form's own style: the list opens right under the field (not the browser's tall, blue one), follows the theme, and works with
// the keyboard (arrow keys, Enter, Escape). It sends its choice with the form through a hidden field.
function Dropdown({ name, options, placeholder, invalid, onPick }: { name: string; options: string[]; placeholder: string; invalid?: boolean; onPick?: () => void }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  function pick(o: string) {
    setValue(o);
    setOpen(false);
    onPick?.();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setActive(Math.max(0, options.indexOf(value)));
        setOpen(true);
      } else setActive((a) => Math.min(options.length - 1, Math.max(0, a + (e.key === "ArrowDown" ? 1 : -1))));
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      pick(options[active]);
    }
  }

  return (
    <div ref={box} className="relative text-[15px]" onKeyDown={onKey}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setActive(Math.max(0, options.indexOf(value)));
          setOpen((o) => !o);
        }}
        className={`${field} contact-select block cursor-pointer text-left ${value ? "" : "text-muted/70"} ${invalid ? "border-red-500" : ""} ${open ? "border-brand shadow-[0_0_0_4px_rgba(34,187,155,0.2)]" : ""}`}
      >
        {value || placeholder}
      </button>
      {open && (
        <ul role="listbox" className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-line bg-card p-1 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)]">
          {options.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={o === value}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => pick(o)}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-[15px] ${i === active ? "bg-brand/20" : ""} ${o === value ? "text-accent" : "text-ink"}`}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// The message form. There is no mail server behind the site yet, so sending opens the visitor's email app with the message filled in.
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [length, setLength] = useState(0);
  const [noCategory, setNoCategory] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    if (!get("category")) {
      setNoCategory(true);
      return;
    }
    const body = [
      `I am a: ${get("category")}`,
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      get("phone") ? `Phone or WhatsApp: ${get("phone")}` : null,
      get("country") ? `Country: ${get("country")}` : null,
      "",
      get("message"),
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(get("subject"))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent)
    return (
      <div role="status" className="rounded-2xl bg-band p-8 text-center">
        <h3 className="font-heading text-h3 font-medium">Almost there</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Your email app should have opened with your message ready. Press send there and the right AwaDoc team will reply within 2 working days.
        </p>
        <button type="button" onClick={() => setSent(false)} className="mt-4 cursor-pointer text-[15px] font-semibold text-accent underline underline-offset-4">
          Back to the form
        </button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">

      <div className="grid flex-1 gap-5 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>
          I am a *
          {/* A styled list that always opens downwards, under the field ("Select a category" is only the prompt, not a choice). */}
          <Dropdown name="category" options={CATEGORIES} placeholder="Select a category" invalid={noCategory} onPick={() => setNoCategory(false)} />
          {noCategory && <span className="mt-1.5 block text-[13px] font-semibold text-red-500">Please choose one.</span>}
        </label>
        <label className={label}>
          Full name *
          <input name="name" required autoComplete="name" placeholder="e.g. Jane Doe" className={field} />
        </label>
        <label className={label}>
          Email address *
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
        </label>
        <label className={label}>
          Phone or WhatsApp <span className={optional}>· optional</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+234 803 000 0000" className={field} />
        </label>
        <label className={label}>
          Country <span className={optional}>· optional</span>
          <Dropdown name="country" options={COUNTRIES} placeholder="Select country" />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Subject *
          <input name="subject" required placeholder="What is this about?" className={field} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Message *
          <textarea
            name="message"
            required
            rows={6}
            maxLength={2000}
            placeholder="Tell us how we can help"
            onChange={(e) => setLength(e.target.value.length)}
            className={`${field} h-auto min-h-40 resize-y py-3`}
          />
          <span className="mt-1.5 block text-right text-[13px] font-normal text-muted">{length} / 2000</span>
        </label>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-muted">
        <input type="checkbox" name="consent" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 size-4 shrink-0 accent-(--color-brand)" />
        <span>
          I agree that AwaDoc may use these details to reply to me, as described in the{" "}
          <Link href="/privacy" className="font-semibold text-accent underline underline-offset-4 hover:text-brand">privacy policy</Link>.
        </span>
      </label>
      <p className="m-0 mt-4 text-[13px] text-muted">All fields are required unless marked optional.</p>

      <button
        type="submit"
        disabled={!agreed}
        className="mt-5 inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-7 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 max-sm:w-full"
      >
        Send message
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
