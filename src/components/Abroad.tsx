"use client";

import { useRouter } from "next/navigation";
import TravelHelp from "@/components/TravelHelp";
import { startBooking } from "@/lib/startBooking";

const PERKS = [
  { title: "Counselling in your time zone", text: "Virtual sessions with an AwaDoc doctor, at a time that suits you.", icon: "M3 12a9 9 0 1018 0 9 9 0 00-18 0zM12 7v5l3 2" },
  { title: "Trips planned around your leave", text: "We line up your three visits so you spend as few days away as possible.", icon: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" },
  { title: "Accommodation booked for you", text: "Comfortable places to stay near IMSA, arranged before you land.", icon: "M3 18v-6a3 3 0 013-3h12a3 3 0 013 3v6M3 18h18M3 21v-3M21 21v-3M7 9V6h4v3" },
  { title: "Pay from anywhere", text: "One payment by card or international transfer, shown in your currency.", icon: "M3 7h18v12H3zM3 11h18M7 15h3" },
];

// "For couples abroad": the pitch on the left (with the travel help drawer behind "Ask about travel"), four perks on the right.
export default function Abroad() {
  const router = useRouter();

  return (
    <section id="abroad" aria-labelledby="abroad-title" className="bg-band px-6 py-24 max-md:px-4 max-md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-10 max-md:grid-cols-1">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-card pr-3.5 pl-1.5 text-[13px] font-semibold text-ink">
            <span className="grid size-5.5 place-items-center rounded-full bg-tint text-accent">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
              </svg>
            </span>
            For couples abroad
          </span>
          <h2 id="abroad-title" className="m-0 font-heading text-fl-h2 leading-[1.1] font-semibold tracking-tight text-ink">
            Treatment in Abuja. Everything else, we handle.
          </h2>
          <p className="m-0 text-fl-lead leading-[1.65] text-muted">Couples in any country can book. Start online from wherever you live, then travel only when you need to be at the clinic.</p>
          <div className="mt-2 flex gap-2.5 self-stretch max-md:flex-col">
            <button
              type="button"
              onClick={() => void startBooking(router)}
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-5.5 text-fl-small font-semibold text-white transition-colors duration-200 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 max-md:h-13 in-data-[theme=dark]:text-[#0a0d12]"
            >
              Book virtual counselling
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <TravelHelp className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#d0d5dd] bg-card px-5.5 text-fl-small font-semibold text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 max-md:h-13 in-data-[theme=dark]:border-[#3a414c] in-data-[theme=dark]:bg-transparent in-data-[theme=dark]:hover:border-ink">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
              </svg>
              Ask about travel
            </TravelHelp>
          </div>
        </div>

        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 max-md:grid-cols-1">
          {PERKS.map((p) => (
            <li key={p.title} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-card p-5.5">
              <span className="grid size-10 place-items-center rounded-xl bg-tint text-accent">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                  <path d={p.icon} />
                </svg>
              </span>
              <b className="text-base font-semibold text-ink">{p.title}</b>
              <span className="text-sm leading-[1.55] text-muted">{p.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
