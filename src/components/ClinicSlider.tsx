"use client";

import Image from "next/image";
const SLIDES = [
  { src: "/story/lab-dna.png", width: 1018, height: 583, alt: "A strand of DNA made of glowing red and blue particles" },
  { src: "/story/register.jpg", width: 1200, height: 800, alt: "A microscope with its lenses in focus in a clean laboratory" },
  { src: "/story/genotypes.jpg", width: 1400, height: 933, alt: "A scientist in gloves and a mask holding up a plate of samples to the light" },
  { src: "/story/location.jpg", width: 1200, height: 800, alt: "A pipette filling a tray of small sample tubes" },
  { src: "/story/book.jpg", width: 1200, height: 1799, alt: "A gloved hand steadying a petri dish under a laboratory microscope" },
  { src: "/story/results.jpg", width: 1200, height: 800, alt: "A gloved hand holding a sample tube up to the light" },
  { src: "/story/lab-sample.png", width: 379, height: 519, alt: "A gloved hand lifting a blood sample tube from a rack in a bright laboratory" },
];

// The box under the hero: what AwaDoc is and provides above, then a row of lab photos drifting from right to left.
export default function ClinicSlider() {
  return (
    <section id="about" aria-label="About AwaDoc" className="relative z-10 mt-[calc(var(--spacing-section)*1.5)] px-3 sm:px-[5vw]">
      <div className="overflow-hidden rounded-[calc(32*var(--u))] border border-white/40 bg-linear-to-br from-bg/55 via-bg/40 to-bg/28 p-[calc(20*var(--u))] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-md md:p-[calc(48*var(--u))]">
        <div className="@container mx-auto max-w-[56em]">
          <h2 className="text-balance text-center font-heading text-[min(var(--text-h2),calc(100cqw/16.5))] font-medium leading-[1.06] [-webkit-text-stroke:0.015em_currentColor]">
            Embryo Testing for sickle cell, Done in Nigeria
          </h2>
          <p className="mt-[1.6em] text-justify text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted">
            Our aim is to end the passing on of sickle cell disease, one family at a time. We give couples clear answers
            about their genetic risk and real options for having children free of sickle cell disease, with expert care
            that is private, compassionate, and accessible from anywhere.
          </p>
        </div>

        {/* The photos are listed twice and the row moves by half its width, so the loop has no join. */}
        <div className="mt-[calc(36*var(--u))] overflow-hidden rounded-[calc(22*var(--u))]">
          <ul aria-label="Photos from the lab" className="photo-drift flex w-max">
            {[...SLIDES, ...SLIDES].map((s, i) => (
              <li
                key={i}
                aria-hidden={i >= SLIDES.length}
                className="relative mr-3 aspect-[4/3] w-[54vw] shrink-0 overflow-hidden rounded-[calc(22*var(--u))] bg-ink/5 md:mr-4 md:w-[26vw] lg:w-[21vw]"
              >
                <Image
                  src={s.src}
                  alt={i >= SLIDES.length ? "" : s.alt}
                  width={s.width}
                  height={s.height}
                  sizes="(min-width: 1024px) 21vw, (min-width: 768px) 26vw, 54vw"
                  draggable={false}
                  className="absolute inset-0 size-full object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
