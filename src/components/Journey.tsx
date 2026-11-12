"use client";

import { Fragment, useState } from "react";
import { PlaneIcon } from "@/components/TravelHelp";

type Kind = "online" | "home" | "abuja";

const STAGES: { n: number; kind: Kind; title: string; text: string; dur: string; tag: string; trip?: string }[] = [
  { n: 1, kind: "online", title: "Genetic counselling", text: "An AwaDoc doctor confirms your genotypes, explains your odds and options, and checks that IVF with embryo testing is right for you.", dur: "1 session", tag: "Online" },
  {
    n: 2,
    kind: "abuja",
    title: "Assessment and DNA samples",
    text: "You meet the IMSA fertility team for scans and tests. You both give blood or cheek swab samples, ideally with an affected relative's too.",
    dur: "1 to 2 days",
    tag: "Abuja, visit 1",
    trip: "Trip 1 is a short visit, usually 1 to 2 days",
  },
  { n: 3, kind: "home", title: "Your custom test is built", text: "The lab designs a test from your family's own DNA. You carry on as normal while you wait.", dur: "3 to 6 weeks", tag: "From home" },
  {
    n: 4,
    kind: "abuja",
    title: "Stimulation and egg collection",
    text: "Daily hormone injections help several eggs mature, with scans to track them. Eggs are then collected under sedation and fertilised in the lab.",
    dur: "About 2 weeks",
    tag: "Abuja, visit 2",
    trip: "Trip 2 is the longest stay, about 2 weeks",
  },
  { n: 5, kind: "home", title: "Embryo testing", text: "A few cells are taken from each embryo on day 5 or 6 and tested for sickle cell. Embryos are frozen safely while the results come back.", dur: "1 to 3 weeks", tag: "From home" },
  {
    n: 6,
    kind: "abuja",
    title: "Frozen embryo transfer",
    text: "An embryo without sickle cell disease is placed in the womb, usually in a later cycle. It's quick and needs no sedation.",
    dur: "1 to 2 days",
    tag: "Abuja, visit 3",
    trip: "Trip 3 is a short visit, usually 1 to 2 days",
  },
  { n: 7, kind: "online", title: "Pregnancy test and follow up", text: "You take a pregnancy test about two weeks later, and we follow up with you online. A confirmatory test during pregnancy is advised.", dur: "From 2 weeks", tag: "Online" },
];

const ICONS: Record<Kind, string> = {
  online: "M4 5h16v11H4zM8 20h8M12 16v4",
  home: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z",
  abuja: "M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12zM12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
};

// Card colours for each kind of stage, light and dark.
const TINT: Record<Kind, string> = {
  online: "bg-[#e6ebff] text-[#26306b] in-data-[theme=dark]:bg-[#1e2340] in-data-[theme=dark]:text-[#e4e8ff]",
  home: "bg-[#fde6db] text-[#6b2e14] in-data-[theme=dark]:bg-[#2c211c] in-data-[theme=dark]:text-[#fbe3d8]",
  abuja: "bg-[#21ba9b]/20 text-[#1d1d29] in-data-[theme=dark]:bg-[#21ba9b]/25 in-data-[theme=dark]:text-[#e6faf5]",
};
const PILL: Record<Kind, string> = {
  online: "bg-white/70 in-data-[theme=dark]:bg-white/10",
  home: "bg-white/70 in-data-[theme=dark]:bg-white/10",
  abuja: "bg-current/10",
};
const RING: Record<Kind, string> = {
  online: "border-[#9aa6f0] in-data-[theme=dark]:border-[#5a64b8]",
  home: "border-[#f2b79c] in-data-[theme=dark]:border-[#8a5a44]",
  abuja: "border-[#21ba9b]",
};
const LANES: { kind: Kind; label: string }[] = [
  { kind: "online", label: "Online" },
  { kind: "home", label: "From home" },
  { kind: "abuja", label: "At IMSA, Abuja" },
];

function Svg({ d, className, sw = 1.8 }: { d: string; className: string; sw?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}

const Clock = ({ className }: { className: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

// "Your journey": the seven stages from the first call to the embryo transfer, down a centre line (a single column on a phone). The stages in Abuja are
// drawn as boarding passes. "I live abroad" dims the rest so the trips stand out.
export default function Journey() {
  const [abroad, setAbroad] = useState(false);

  return (
    <section id="journey" aria-labelledby="journey-title" className="bg-bg px-6 pt-0 pb-24 max-md:px-4 max-md:pb-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="mx-auto flex max-w-190 flex-col items-center gap-4 text-center">
          <h2 id="journey-title" className="m-0 font-heading text-fl-h2 leading-[1.1] font-semibold tracking-tight text-ink">
            From first call to embryo transfer, step by step
          </h2>
          <p className="m-0 text-fl-lead leading-[1.65] text-muted">
            Most couples go from counselling to embryo transfer in about 3 to 4 months. Here&apos;s what happens at each stage, and which steps need you in Abuja.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <div role="group" aria-label="Show the journey for" className="inline-flex rounded-full border border-line bg-band p-1">
            {[
              { abroad: false, label: "I live in Nigeria", d: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" },
              { abroad: true, label: "I live abroad", d: "M2 16l20-6-3-2-6 2-5-5-2 1 3 5-5 2-2-1-1 1 3 3z" },
            ].map((o) => {
              const on = abroad === o.abroad;
              return (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setAbroad(o.abroad)}
                  className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 max-sm:px-3 ${
                    on ? "bg-card text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)] in-data-[theme=dark]:bg-[#2a303a]" : "text-muted hover:text-ink"
                  }`}
                >
                  <Svg d={o.d} className="size-4" />
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {LANES.map((l) => (
            <span key={l.kind} className={`inline-flex h-9 items-center gap-2 rounded-full pr-3.5 pl-1.5 text-[13px] font-semibold ${TINT[l.kind]}`}>
              <span className={`grid size-6.5 place-items-center rounded-full ${l.kind === "abuja" ? "bg-current/10" : "bg-white/75 in-data-[theme=dark]:bg-white/12"}`}>
                <Svg d={ICONS[l.kind]} className="size-3.5" />
              </span>
              {l.label}
            </span>
          ))}
        </div>

        <ol
          aria-label="Journey stages"
          className="m-0 mx-auto grid w-full max-w-280 list-none grid-cols-[44px_minmax(0,1fr)] grid-rows-[repeat(7,auto)] gap-x-3 gap-y-3.5 p-0 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] md:gap-x-7 md:gap-y-3"
        >
          <li aria-hidden="true" className="col-start-1 my-6 w-[3px] justify-self-center rounded-[3px] bg-linear-to-b from-brand via-[#21ba9b] to-brand opacity-60 [grid-row:1/-1] md:col-start-2" />
          {STAGES.map((s, i) => {
            const isAbuja = s.kind === "abuja";
            const left = i % 2 === 0;
            const dim = abroad && !isAbuja;
            const visit = /visit (\d)/.exec(s.tag)?.[1];
            return (
              <Fragment key={s.n}>
                <li
                  aria-hidden="true"
                  style={{ gridRow: i + 1 }}
                  className={`relative z-1 col-start-1 mt-5 grid size-10 self-start justify-self-center rounded-full border-3 bg-bg font-sans text-base leading-none font-bold text-ink transition-opacity duration-300 place-items-center md:col-start-2 md:size-12 ${RING[s.kind]} ${dim ? "opacity-45" : ""}`}
                >
                  {s.n}
                </li>
                <li
                  style={{ gridRow: i + 1 }}
                  className={`col-start-2 w-full transition-opacity duration-300 md:max-w-125 ${left ? "md:col-start-1 md:justify-self-end" : "md:col-start-3 md:justify-self-start"} ${dim ? "opacity-45" : ""}`}
                >
                  {isAbuja ? (
                    <article
                      className={`relative grid grid-cols-1 overflow-hidden rounded-[20px] bg-[#21ba9b]/20 text-[#1d1d29] in-data-[theme=dark]:bg-[#21ba9b]/25 in-data-[theme=dark]:text-[#e6faf5] transition-shadow duration-300 md:grid-cols-[minmax(0,1fr)_96px] ${abroad ? "shadow-[0_18px_40px_-20px_rgba(33,186,155,0.5)]" : "shadow-[0_1px_2px_rgba(16,24,40,0.06)]"}`}
                    >
                      <div className="flex flex-col gap-2.5 border-dashed border-current/25 p-4.5 max-md:border-t-2 md:border-r-2 md:p-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-current/10 px-2.5 text-xs font-semibold">
                            <Svg d={ICONS.abuja} className="size-3.25" sw={2} />
                            {s.tag}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold opacity-75">
                            <Clock className="size-3.25" />
                            {s.dur}
                          </span>
                        </div>
                        <h3 className="m-0 font-sans text-[18px] leading-[1.2] font-semibold tracking-[-0.015em] md:text-[21px]">{s.title}</h3>
                        <p className="m-0 text-[15px] leading-[1.6] opacity-85">{s.text}</p>
                      </div>
                      <div className="flex min-h-14 items-center justify-between gap-2 px-4.5 max-md:order-first md:min-h-0 md:flex-col md:justify-center md:gap-0.5 md:px-2 md:py-4">
                        <span className="inline-flex items-center gap-2">
                          <PlaneIcon className="size-5.5" />
                          <span className="text-[11px] font-bold tracking-widest uppercase opacity-70 md:hidden">{s.tag}</span>
                        </span>
                        <span className="font-heading text-[26px] leading-none font-bold tracking-[-0.04em] md:text-[40px]">0{visit}</span>
                      </div>
                      <span aria-hidden="true" className="absolute top-11 -left-3 size-6 rounded-full bg-bg md:top-[-12px] md:right-[84px] md:left-auto" />
                      <span aria-hidden="true" className="absolute top-11 -right-3 size-6 rounded-full bg-bg md:top-auto md:right-[84px] md:bottom-[-12px]" />
                      {abroad && s.trip && (
                        <div className="col-span-full flex items-center gap-2 bg-[#1d1d29] px-5 py-3 text-[13px] font-semibold text-[#21ba9b]">
                          <PlaneIcon className="size-3.75 shrink-0" />
                          {s.trip}
                        </div>
                      )}
                    </article>
                  ) : (
                    <article className={`flex flex-col gap-2.5 rounded-[20px] p-4.5 shadow-[0_1px_2px_rgba(16,24,40,0.06)] md:p-6 ${TINT[s.kind]}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold ${PILL[s.kind]}`}>
                          <Svg d={ICONS[s.kind]} className="size-3.25" sw={2} />
                          {s.tag}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold opacity-80">
                          <Clock className="size-3.25" />
                          {s.dur}
                        </span>
                      </div>
                      <h3 className="m-0 font-sans text-[18px] leading-[1.2] font-semibold tracking-[-0.015em] md:text-[21px]">{s.title}</h3>
                      <p className="m-0 text-[15px] leading-[1.6] opacity-85">{s.text}</p>
                    </article>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>

        <p className="m-0 mx-auto flex max-w-190 items-start gap-2.5 text-sm leading-[1.6] text-muted">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 size-4.5 shrink-0 text-accent">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
          <span>Timings are typical and vary with each person&apos;s cycle. Our team confirms your own schedule at assessment, and some couples need more than one cycle.</span>
        </p>
      </div>
    </section>
  );
}

