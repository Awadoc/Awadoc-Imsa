import Image from "next/image";
import Logo from "@/components/Logo";

// One straight, centered line: AwaDoc in partnership with IMSA.
// The logos shrink with the screen width (vw) so the line stays on one row down to 600px;
// below that it wraps onto two centered lines.
// `compact` is the smaller version that sits beside the app buttons in the footer.
export default function Partnership({ compact = false, note }: { compact?: boolean; note?: string }) {
  // Compact (in the footer): never wraps. Up to 797px the whole line is sized from the screen width (--s the text, --m the logos, set in Footer), so it always fits between the same side margins as the footer links, however narrow the phone.
  const awadoc = compact ? "max-[797px]:h-[calc(1.35*var(--m))] min-[798px]:h-[calc(0.85*min(max(1.5rem,min(calc(32*var(--u)),3vw)),calc((100vw-10rem)/9.05)))]" : "h-[min(calc(64*var(--u)),5.4vw)]";
  const imsa = compact ? "max-[797px]:h-[calc(2.14*var(--m))] min-[798px]:h-[var(--ih)] min-[1100px]:w-[var(--bw)] min-[1100px]:h-auto" : "h-[min(calc(88*var(--u)),7.4vw)]";
  return (
    <section
      aria-label="Partnership"
      className={`relative z-10 flex items-center gap-x-[min(calc(20*var(--u)),2vw)] gap-y-[calc(14*var(--u))] ${
        compact
          ? "w-full flex-nowrap justify-between text-[length:var(--s)] max-[797px]:gap-x-[calc(0.8*var(--s))] min-[798px]:[--ih:min(max(2rem,min(calc(42*var(--u)),3.8vw)),calc((100vw-10rem)/6.8))] min-[798px]:w-auto min-[798px]:justify-start min-[798px]:text-base min-[1100px]:flex-col min-[1100px]:items-start min-[1100px]:self-start min-[1100px]:justify-start min-[1100px]:gap-y-[calc(14*var(--u))]"
          : "gutter flex-nowrap justify-center py-[calc(var(--spacing-section)/2)] max-[599px]:flex-wrap"
      }`}
    >
      {compact ? (
        // The footer's own, tighter cut of the logo (no empty margin around it).
        <Image src="/footer/awadoc-logo.png" alt="AwaDoc" width={3492} height={717} className={`${awadoc} w-auto shrink-0 min-[1100px]:h-auto min-[1100px]:w-[var(--bw)]`} />
      ) : (
        <Logo className={`${awadoc} w-auto shrink-0`} />
      )}
      <span className={`shrink-0 whitespace-nowrap font-medium text-muted ${compact ? "text-[0.85em] min-[798px]:text-[calc(var(--text-hero-sub)*0.85)]" : "text-hero-sub"}`}>
        in partnership with
      </span>
      <Image
        src={compact ? "/footer/imsa-logo.png" : "/imsa-logo.png"}
        alt="Institute of Medical Sciences Africa (IMSA)"
        width={compact ? 1384 : 346}
        height={compact ? 352 : 88}
        className={`partner-logo-light ${imsa} w-auto shrink-0`}
      />
      <Image
        src={compact ? "/footer/imsa-logo-dark.png" : "/imsa-logo-dark.png"}
        alt="Institute of Medical Sciences Africa (IMSA)"
        width={compact ? 1384 : 346}
        height={compact ? 352 : 88}
        className={`partner-logo-dark ${imsa} w-auto shrink-0`}
      />
      {/* On a wide screen the small print sits right under the IMSA logo; below that it stays in the footer's bottom row. */}
      {note && <p className="hidden text-[calc(var(--text-hero-sub)*0.7)] font-medium leading-relaxed tracking-[-0.02em] text-muted min-[1100px]:block">{note}</p>}
    </section>
  );
}
