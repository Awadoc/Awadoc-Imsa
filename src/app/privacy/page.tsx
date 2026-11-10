import type { Metadata } from "next";
import Link from "next/link";
import ContentsCard from "@/components/ContentsCard";
import Footer from "@/components/Footer";
import HomeButton from "@/components/HomeButton";
import Logo from "@/components/Logo";
import StickyNav from "@/components/StickyNav";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Privacy policy | AwaDoc",
  description: "How AwaDoc collects, uses, shares and protects your information, under the Nigeria Data Protection Act 2023.",
};

// A list item is either plain text or a short bold lead and the rest of the sentence.
type Item = string | [lead: string, text: string];

type Block = { p: string } | { ul: Item[] };

const DPO = "dpo@awadoc.com";

const SECTIONS: { title: string; blocks: Block[] }[] = [
  {
    title: "Who we are",
    blocks: [
      {
        p: "AwaDoc is the data controller for personal information collected through the Genotype Match website. We process your information in line with the Nigeria Data Protection Act 2023 and the guidance of the Nigeria Data Protection Commission.",
      },
    ],
  },
  {
    title: "Information we collect",
    blocks: [
      {
        ul: [
          ["Contact details", "names of both partners, email, phone number and address."],
          ["Health information", "genotypes, lab reports you upload, age, fertility history and DNA sample preferences. This is sensitive personal data and we handle it with extra care."],
          ["Booking and payment records", "what you booked, dates, amounts and payment references. We never see or store your full card details; our payment partner handles them."],
          ["Donations", "Paystack collects and processes donation payments and details on its own secure page."],
          ["Messages", "what you send through the contact form or to Noura."],
          ["Technical information", "basic device and browser details needed to run the website securely."],
        ],
      },
    ],
  },
  {
    title: "How we use it",
    blocks: [
      {
        ul: [
          "To counsel you and arrange tests and treatment.",
          "To refer you to IMSA when you ask us to.",
          "To take payments and send confirmations, receipts and reminders.",
          "To reply to enquiries from clients, partners, researchers and organisations.",
          "To keep the service safe and improve it, using information that doesn’t identify you where possible.",
        ],
      },
    ],
  },
  {
    title: "Our legal basis",
    blocks: [
      {
        p: "We process health information only with your explicit consent, which you give at booking. We process other information to provide the service you request, to meet legal obligations such as financial and medical record keeping, and for our legitimate interest in running a safe service.",
      },
    ],
  },
  {
    title: "Who we share it with",
    blocks: [
      {
        ul: [
          "IMSA’s clinical team, only once you’re referred for treatment.",
          "Our payment partners, including Paystack, only to process payments and donations.",
          "Service providers that host our systems and send emails and messages for us, under contracts that protect your data.",
          "Authorities, only where the law requires it.",
        ],
      },
      { p: "We never sell your information or use it for advertising." },
    ],
  },
  {
    title: "International transfers",
    blocks: [
      {
        p: "Some of our service providers may store data outside Nigeria. When this happens, we use safeguards required by Nigerian data protection law to keep your information protected.",
      },
    ],
  },
  {
    title: "How long we keep it",
    blocks: [
      {
        p: "We keep booking and health records for as long as your care and medical records rules require, and financial records for as long as tax law requires. Contact form messages are kept for up to 2 years unless they become part of your care. Information kept in your own browser for “My bookings” stays on your device until you clear it.",
      },
    ],
  },
  {
    title: "How we protect it",
    blocks: [
      {
        p: "Access to your information is limited to the people who need it to care for you. Data is encrypted in transit, and genotypes never appear on receipts you share. We review our security regularly.",
      },
      {
        p: "Your genotypes and lab reports are encrypted at rest as well as in transit, and are never used for research without your separate consent.",
      },
      {
        p: "If a breach puts your data at risk, we will notify the Nigeria Data Protection Commission within 72 hours and tell affected users without undue delay.",
      },
    ],
  },
  {
    title: "Your rights",
    blocks: [
      {
        ul: [
          "See the information we hold about you.",
          "Correct information that’s wrong.",
          "Ask us to delete your information, unless we must keep it by law.",
          "Receive your information in a format you can take elsewhere.",
          "Object to or restrict how we use it.",
          "Withdraw your consent at any time. This doesn’t affect what we did before you withdrew it.",
        ],
      },
      { p: "To use any of these rights, contact us and choose “Other”, or email our Data Protection Officer at {dpo}. We reply within 30 days." },
    ],
  },
  {
    title: "Children",
    blocks: [{ p: "The service is for adults aged 18 and over. We don’t knowingly collect information from children." }],
  },
  {
    title: "Complaints",
    blocks: [
      {
        p: "If you’re unhappy with how we’ve handled your information, contact us first. You also have the right to complain to the Nigeria Data Protection Commission.",
      },
    ],
  },
  {
    title: "Changes",
    blocks: [{ p: "We may update this policy and will show the date of the latest version on this page." }],
  },
];

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "");

// The text under the page title (centred) and the body text; the body text is justified on a phone.
const bodyPlain = "text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted";
const body = `${bodyPlain} max-sm:text-justify`;

// A paragraph, with the data protection officer's email as a link.
function Text({ t }: { t: string }) {
  const [before, after] = t.split("{dpo}");
  if (after === undefined) return <>{t}</>;
  return (
    <>
      {before}
      <a href={`mailto:${DPO}`} className="font-semibold text-ink underline underline-offset-4 transition-colors hover:text-brand">
        {DPO}
      </a>
      {after}
    </>
  );
}

export default function PrivacyPage() {
  return (
    <div data-page className="book-fade">
      <StickyNav>
        <Link href="/" aria-label="AwaDoc home">
          <Logo className="h-8 w-auto max-sm:h-6" />
        </Link>
        <div />
        <div className="col-start-3 flex items-center gap-[calc(8*var(--u))] justify-self-end">
          <HomeButton />
          <ThemeToggle />
        </div>
      </StickyNav>

      <main className="gutter relative z-10 pb-[calc(var(--spacing-section)*1.5)] pt-[calc(var(--spacing-section)*0.6)]">
                <header className="book-rise mx-auto max-w-[56em] text-center" style={{ animationDelay: "120ms" }}>
          <h1 className="font-heading text-display font-medium leading-[1.05] [-webkit-text-stroke:0.015em_currentColor]">Privacy policy</h1>
          <p className={`mt-[1em] ${bodyPlain}`}>Last updated 3 November 2026</p>
        </header>

        <div className="mx-auto mt-[calc(var(--spacing-section)*0.5)] grid min-w-0 max-w-[76em] grid-cols-[minmax(0,1fr)] gap-x-[calc(64*var(--u))] gap-y-[calc(40*var(--u))] lg:grid-cols-[minmax(0,1fr)_19em]">
          <article className="min-w-0">
            <div className="book-rise" style={{ animationDelay: "300ms" }}>
              {SECTIONS.map((section, i) => (
                <section id={slug(section.title)} key={section.title} className="mt-[calc(var(--spacing-section)*0.9)] scroll-mt-28 first:mt-0">
                  <h2 className="font-heading text-h2 font-medium leading-[1.06] [-webkit-text-stroke:0.015em_currentColor]">
                    {i + 1}. {section.title}
                  </h2>
                  {section.blocks.map((block, j) =>
                    "p" in block ? (
                      <p key={j} className={`mt-[1em] ${body}`}>
                        <Text t={block.p} />
                      </p>
                    ) : (
                      <ul key={j} className={`mt-[1em] list-disc space-y-[0.8em] pl-[1.4em] marker:text-accent ${body}`}>
                        {block.ul.map((item) => (
                          <li key={typeof item === "string" ? item : item[0]}>
                            {typeof item === "string" ? (
                              item
                            ) : (
                              <>
                                <strong className="font-semibold text-ink">{item[0]}:</strong> {item[1]}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </section>
              ))}
            </div>
          </article>

          <ContentsCard items={SECTIONS.map((section) => ({ href: `#${slug(section.title)}`, label: section.title }))} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
