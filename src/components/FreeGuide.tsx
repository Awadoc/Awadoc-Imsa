import Image from "next/image";

// Where the guide is downloaded from (the file is in /public).
const GUIDE_PDF = "/genotype-marriage-and-your-options.pdf";

// "Not ready to book?": a green band with a tilted book cover on the left and the download button on the right. It is white text on the brand green in
// both themes, as in the design.
export default function FreeGuide() {
  return (
    <section id="guide" aria-labelledby="guide-title" className="bg-bg px-6 py-24 max-md:px-4 max-md:py-16">
      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-10 overflow-hidden rounded-3xl bg-brand p-14 max-md:grid-cols-1 max-md:px-5 max-md:py-10">
        <div aria-hidden="true" className="absolute -top-20 -left-20 size-80 rounded-[80px] bg-white/7" />

        <div aria-hidden="true" className="relative flex justify-center py-4">
          <div className="relative flex min-h-95 w-70 -rotate-2 flex-col overflow-hidden rounded-md bg-[#0c3f31] shadow-[0_24px_48px_-20px_rgba(6,40,30,0.6)] max-md:min-h-75 max-md:w-55">
            <Image src="/guide-cover.jpg" alt="" width={1200} height={360} className="block h-auto w-full" />
            <div className="relative flex flex-col gap-2 pt-4 pr-5 pl-5.5">
              <span className="text-[9.5px] font-bold tracking-[0.08em] text-[#ffc301] uppercase">Free guide · 2026 edition</span>
              <h3 className="m-0 font-heading text-xl leading-[1.15] font-bold text-white">Genotype, Marriage and Your Options</h3>
              <i className="block h-[3px] w-8.5 rounded-xs bg-[#ffc301]" />
              <p className="m-0 text-xs leading-normal text-[#cfe3db]">A clear, practical guide to sickle cell for couples, before marriage and before starting a family.</p>
            </div>
            <div className="relative mt-auto py-4 pr-5 pl-5.5 text-[10.5px] font-semibold text-white">By AwaDoc Research Team</div>
            <i className="absolute right-0 bottom-0 h-27.5 w-17.5 bg-[#ffc301] [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
          </div>
          <div className="absolute top-0 right-[calc(50%-190px)] flex size-21 rotate-10 items-center justify-center rounded-full bg-[#d4f15a] text-center text-[13px] leading-[1.1] font-bold text-[#1d1d29] shadow-[0_10px_24px_-10px_rgba(10,13,18,0.45)] max-md:right-6">
            100%
            <br />
            free
          </div>
        </div>

        <div className="relative flex flex-col items-start gap-4">
          <span className="text-xs font-semibold tracking-[0.08em] text-white uppercase">Free guide</span>
          <h2 id="guide-title" className="m-0 font-heading text-fl-h2 leading-[1.1] font-semibold tracking-tight text-white">
            Not ready to book? Start with the facts.
          </h2>
          <p className="m-0 mb-3 text-fl-lead leading-[1.65] text-white">Everything couples ask us, in one plain guide. Read it together, share it with family, and decide with confidence.</p>
          <a
            href={GUIDE_PDF}
            download
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#d4f15a] py-0 pr-2 pl-5.5 text-fl-small font-semibold text-[#1d1d29] no-underline transition-[filter] duration-200 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white max-md:h-13 max-md:self-stretch"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            </svg>
            Download the free guide
            <span className="inline-flex h-8 items-center rounded-full bg-[#1d1d29]/10 px-3 text-xs font-bold">PDF</span>
          </a>
        </div>
      </div>
    </section>
  );
}
