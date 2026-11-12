import Image from "next/image";

// The lab photos, in rounded cards that drift from right to left forever.
const SLIDES = [
  { src: "/story/lab-dna.png", width: 1018, height: 583, alt: "A strand of DNA made of glowing red and blue particles" },
  { src: "/story/register.jpg", width: 1200, height: 800, alt: "A microscope with its lenses in focus in a clean laboratory" },
  { src: "/story/genotypes.jpg", width: 1400, height: 933, alt: "A scientist in gloves and a mask holding up a plate of samples to the light" },
  { src: "/story/location.jpg", width: 1200, height: 800, alt: "A pipette filling a tray of small sample tubes" },
  { src: "/story/book.jpg", width: 1200, height: 1799, alt: "A gloved hand steadying a petri dish under a laboratory microscope" },
  { src: "/story/results.jpg", width: 1200, height: 800, alt: "A gloved hand holding a sample tube up to the light" },
  { src: "/story/lab-sample.png", width: 379, height: 519, alt: "A gloved hand lifting a blood sample tube from a rack in a bright laboratory" },
];

// What AwaDoc is: an open white section with a centred heading and paragraph, then the photos.
export default function ClinicSlider() {
  return (
    <section id="about" aria-label="About AwaDoc" className="bg-bg px-6 py-24 max-md:px-4 max-md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10">
        <div className="flex max-w-190 flex-col items-center gap-4 text-center">
          <h2 className="m-0 font-heading text-fl-h2 leading-[1.1] font-semibold tracking-tight text-ink">Embryo Testing for sickle cell, Done in Nigeria</h2>
          <p className="m-0 text-fl-lead leading-[1.6] text-muted">
            Our aim is to end the passing on of sickle cell disease, one family at a time. We give couples clear answers about their genetic risk and real options for having children free of sickle cell
            disease, with expert care that is private, compassionate, and accessible from anywhere.
          </p>
        </div>
        {/* The photos are listed twice and the row moves by half its width, so the loop has no join. */}
        <div className="w-full overflow-hidden rounded-2xl">
          <ul aria-label="Photos from the lab" className="photo-drift m-0 flex w-max list-none p-0">
            {[...SLIDES, ...SLIDES].map((p, i) => (
              <li
                key={i}
                aria-hidden={i >= SLIDES.length}
                className="relative mr-4 aspect-4/3 w-[74vw] shrink-0 overflow-hidden rounded-2xl bg-[#eef1f4] md:w-[34vw] min-[1025px]:w-[clamp(220px,23.5vw,308px)]"
              >
                <Image src={p.src} alt={i >= SLIDES.length ? "" : p.alt} width={p.width} height={p.height} sizes="(min-width: 1025px) 308px, (min-width: 768px) 34vw, 74vw" draggable={false} className="absolute inset-0 size-full object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
