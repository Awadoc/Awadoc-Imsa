import type { Metadata } from "next";
import type { ReactNode } from "react";
import ContactAskNoura from "@/components/ContactAskNoura";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import PageNav from "@/components/PageNav";
import StartBookingButton from "@/components/StartBookingButton";

export const metadata: Metadata = {
  title: "Contact us | AwaDoc",
  description: "Questions about PGT-M, partnerships, research or support? Send AwaDoc a message and the right team will reply within 2 working days.",
};

const EMAIL = "genomics@awadoc.com";

const ICONS = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3" />
    </>
  ),
  chat: <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />,
  book: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
};

// One way to reach us: a card with a rounded icon square, a small label and what to do. `tone` colours the card and the square.
function Way({ icon, title, tone = "plain", children }: { icon: keyof typeof ICONS; title: string; tone?: "plain" | "blue" | "lime"; children: ReactNode }) {
  const card = {
    plain: "bg-card",
    blue: "bg-[#e6e9fc] in-data-[theme=dark]:bg-[#1a2040]",
    lime: "bg-[#fafeef] in-data-[theme=dark]:bg-card",
  }[tone];
  const square = {
    plain: "bg-tint text-accent",
    blue: "bg-card text-ink",
    lime: "bg-[#d9f24f] text-[#26330a]",
  }[tone];
  return (
    <li className={`flex items-start gap-4 rounded-2xl p-5 ${card}`}>
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${square}`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
          {ICONS[icon]}
        </svg>
      </span>
      <div className="min-w-0 wrap-break-word">{title && <p className="m-0 text-fl-small font-semibold text-ink">{title}</p>}{children}</div>
    </li>
  );
}

export default function ContactPage() {
  return (
    <div data-page className="book-fade bg-band font-sans text-muted">
      <PageNav />

      <main className="px-6 pt-10 pb-24 max-md:px-4 max-md:pt-6 max-md:pb-14">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="book-rise flex flex-col gap-8" style={{ animationDelay: "80ms" }}>
            <div className="flex flex-col gap-4">
              <h1 className="m-0 font-heading text-fl-h1 leading-[1.05] font-semibold tracking-[-0.03em] text-ink">Contact us</h1>
              <p className="m-0 max-w-[30em] text-fl-lead leading-[1.6] text-muted">
                Questions about PGT-M, partnerships, research or support? Send us a message and the right AwaDoc team will reply within 2 working days.
              </p>
            </div>

            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              <Way icon="mail" title="">
                <p className="m-0 text-[13px] text-muted">Email</p>
                <a href={`mailto:${EMAIL}`} className="text-fl-lead font-semibold text-ink no-underline hover:text-brand">
                  {EMAIL}
                </a>
              </Way>
              <Way icon="globe" title="">
                <p className="m-0 text-[13px] text-muted">Website</p>
                <a href="https://www.awadoc.com" target="_blank" rel="noopener noreferrer" className="text-fl-lead font-semibold text-ink no-underline hover:text-brand">
                  www.awadoc.com
                </a>
              </Way>
              <Way icon="chat" title="Quick question?" tone="blue">
                <p className="m-0 mt-1 text-fl-small leading-[1.55] text-muted">Noura answers questions about genotypes, PGT-M and booking instantly.</p>
                <ContactAskNoura className="mt-3 inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-card px-4 text-[14px] font-semibold text-ink transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500" />
              </Way>
              <Way icon="book" title="Ready to book?" tone="lime">
                <p className="m-0 mt-1 text-fl-small leading-[1.55] text-muted">Couples can book counselling and procedures directly.</p>
                <div className="mt-3">
                  <StartBookingButton />
                </div>
              </Way>
            </ul>
          </div>

          <div id="message" className="book-rise scroll-mt-28 rounded-[20px] bg-card p-10 max-sm:p-5" style={{ animationDelay: "160ms" }}>
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
