"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import SpecialistProfileModal from "./SpecialistProfileModal";

// The specialist who leads the care: a split card. On the left a pale panel with the words, on the right his photo on a green panel (they stack
// below 1024px). "View full profile" opens his full profile in a modal.
export default function Specialist() {
  const [profileOpen, setProfileOpen] = useState(false);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  return (
    <section id="specialist" aria-labelledby="expert-title" className="bg-bg px-6 pb-24 max-md:px-4 max-md:pb-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 max-[1024px]:grid-cols-1">
        <div className="flex flex-col justify-center gap-4 rounded-[20px] bg-[#fafeef] p-14 in-data-[theme=dark]:bg-card max-md:p-7">
          <span className="text-fl-kicker font-semibold tracking-[0.08em] text-accent uppercase">Nigeria&rsquo;s IVF pioneer in your corner</span>
          <h2 id="expert-title" className="m-0 font-heading text-fl-name leading-[1.15] font-semibold tracking-[-0.02em] text-ink">
            Dr Ibrahim Wada, OON <span className="font-sans text-fl-small font-medium tracking-[0.02em] whitespace-nowrap text-[#6b7280] in-data-[theme=dark]:text-muted max-md:mt-1 max-md:block max-md:text-[clamp(10px,3vw,13px)]">(MBBS, FRCOG, FWACS, MBA)</span>
          </h2>
          <p className="m-0 text-fl-small leading-[1.6] font-semibold text-ink">
            Chief Medical Advisor, AwaDoc
            <br />
            Founder, Nisa Premier Hospital, Abuja
          </p>
          <p className="m-0 text-fl-body leading-[1.65] text-muted">
            A pioneer of IVF in Nigeria for over 35 years. He led the team behind Nigeria&rsquo;s first government authenticated IVF baby in 1998 and reported one of the country&rsquo;s first sickle cell free
            births following embryo testing.
          </p>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setProfileOpen(true)}
            className="inline-flex w-fit cursor-pointer items-center gap-2 text-fl-small font-semibold text-accent transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            View full profile
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-current">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>

        <div className="relative min-h-130 overflow-hidden rounded-[20px] bg-[#6dbe84] max-md:min-h-52">
          <Image
            src="/team/wada.jpg"
            alt="Dr Ibrahim Wada, fertility specialist and IVF pioneer"
            width={720}
            height={900}
            sizes="(min-width: 1025px) 50vw, 100vw"
            className="absolute inset-0 size-full object-cover object-top"
          />
        </div>
      </div>

      <SpecialistProfileModal open={profileOpen} onClose={closeProfile} />
    </section>
  );
}
