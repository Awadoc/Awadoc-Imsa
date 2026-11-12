"use client";

import { useEffect, useRef, useState, type ComponentType, type InputHTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { LuChevronDown } from "react-icons/lu";

type Icon = ComponentType<{ className?: string }>;

// The look of a chosen option everywhere in the booking form (mint tint, like the EHR's Add patient).
export const chosen = "border-brand/55 bg-brand/10 text-accent";

// White boxes with a thin border; mint ring on focus.
export const inputBase =
  "h-11 w-full min-w-0 rounded-[10px] border border-ink/15 bg-bg text-hero-sub outline-none transition-all duration-200 placeholder:text-muted/60 hover:border-ink/30 focus:border-brand focus:ring-[3px] focus:ring-brand/20 motion-reduce:transition-none";


export function Required() {
  return (
    <span aria-hidden="true" className="text-[#e5532d]">
      {" "}
      *
    </span>
  );
}

export function Field({
  label,
  required,
  optional,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid min-w-0 gap-1.25">
      <span className="text-micro text-muted">
        {label}
        {required && <Required />}
        {optional && <span className="font-normal"> · optional</span>}
      </span>
      {children}
      {hint && <span className="text-fl-kicker leading-snug text-muted">{hint}</span>}
    </label>
  );
}

export function TextInput({
  icon: _icon,
  className = "",
  ...props
}: { icon?: Icon } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <input
        {...props}
        autoComplete={props.autoComplete ?? "off"}
        className={`${inputBase} px-3 ${className}`}
      />
    </div>
  );
}

/**
 * A dropdown you can type into: the box shows the choice, and as you type the list narrows to what
 * fits. The list opens downward and is drawn in <body>, so the modal never cuts it off.
 */
export function SelectInput({
  icon: _icon,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  optionIcon,
  "aria-label": ariaLabel,
}: {
  icon?: Icon;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
  /** Something drawn before each option (a flag, say), and before the chosen value in the box. */
  optionIcon?: (option: string) => ReactNode;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [box, setBox] = useState<{ left: number; top: number; width: number; max: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const shown = options.filter((o) => o.toLowerCase().includes(q));

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent | PointerEvent) => {
      const t = e.target as Element;
      if (!root.current?.contains(t) && !t.closest("[data-pick-menu]")) close();
    };
    // Escape closes only the list, not the whole form.
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      close();
      input.current?.blur();
    };
    const shut = () => close();
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc, true);
    window.addEventListener("resize", shut);
    // The form body scrolls, so the list would be left behind: close it instead.
    window.addEventListener("scroll", shut, true);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc, true);
      window.removeEventListener("resize", shut);
      window.removeEventListener("scroll", shut, true);
    };
  }, [open]);

  const show = () => {
    if (root.current) {
      const r = root.current.getBoundingClientRect();
      // Always opens downward, as tall as the room below allows (at least 120px, at most 260px).
      const max = Math.max(120, Math.min(260, window.innerHeight - r.bottom - 16));
      setBox({ left: r.left, top: r.bottom + 6, width: Math.max(r.width, 140), max });
    }
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const pick = (o: string) => {
    onChange(o);
    close();
    input.current?.blur();
  };

  return (
    <div className="relative" ref={root}>
      {optionIcon && value && !open && (
        <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center">{optionIcon(value)}</span>
      )}
      <input
        ref={input}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        value={open ? query : value}
        placeholder={open && value ? value : placeholder}
        onFocus={show}
        onClick={() => !open && show()}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          if (!open) show();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && shown.length) {
            e.preventDefault();
            setActive((i) => (i + 1) % shown.length);
          } else if (e.key === "ArrowUp" && shown.length) {
            e.preventDefault();
            setActive((i) => (i - 1 + shown.length) % shown.length);
          } else if (e.key === "Enter" && open) {
            e.preventDefault();
            if (shown[active]) pick(shown[active]);
          }
        }}
        className={`${inputBase} cursor-text ${optionIcon && value && !open ? "pl-10" : "pl-3"} pr-9 text-ellipsis ${open ? "border-brand ring-[3px] ring-brand/20" : ""} ${className}`}
      />
      <LuChevronDown
        aria-hidden="true"
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) {
            close();
            input.current?.blur();
          } else input.current?.focus();
        }}
        className={`absolute right-[calc(12*var(--u))] top-1/2 size-[1.1em] -translate-y-1/2 cursor-pointer text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
      {open &&
        box &&
        createPortal(
          <div
            data-pick-menu=""
            role="listbox"
            style={{ left: box.left, top: box.top, width: box.width, maxHeight: box.max }}
            className="book-pop booking-scope fixed z-70 overflow-y-auto overscroll-contain rounded-[calc(14*var(--u))] border border-ink/10 bg-bg p-1.5 font-sans text-ink shadow-[0_24px_50px_-18px_rgba(0,50,40,0.45)] sleek-scroll"
          >
            {shown.length === 0 ? (
              <p className="p-2.5 text-hero-sub text-muted">No match</p>
            ) : (
              shown.map((o, i) => (
                <button
                  key={o}
                  type="button"
                  role="option"
                  aria-selected={o === value}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(o)}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-hero-sub ${
                    o === value ? "bg-brand/12 font-semibold text-accent" : ""
                  } ${i === active ? (o === value ? "bg-brand/20" : "bg-brand/10") : ""}`}
                >
                  {optionIcon?.(o)}
                  {o}
                </button>
              ))
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

/** A circle that shows a tick when chosen (radio style). */
export function Tick({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-[1.5em] shrink-0 items-center justify-center rounded-full border transition-colors ${
        on ? "border-brand bg-brand text-[#07110c]" : "border-ink/20 bg-bg"
      }`}
    >
      {on && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="size-[60%]">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )}
    </span>
  );
}

/** Decorative icons are not drawn in the booking form. Kept so callers need no change. */
export function IconTile(_props: { icon?: Icon; className?: string }) {
  return null;
}

export function Notice({ children }: { icon?: Icon; children: ReactNode }) {
  return (
    <div className="rounded-[calc(14*var(--u))] border border-ink/10 bg-ink/3 px-[1em] py-[0.85em] text-hero-sub leading-snug text-muted">
      {children}
    </div>
  );
}
