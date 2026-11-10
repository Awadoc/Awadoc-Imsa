import type { Metadata } from "next";
import Link from "next/link";
import ContentsCard from "@/components/ContentsCard";
import Footer from "@/components/Footer";
import HomeButton from "@/components/HomeButton";
import Logo from "@/components/Logo";
import StickyNav from "@/components/StickyNav";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Terms of service | AwaDoc",
  description: "The terms that apply when you use the AwaDoc Genotype Match website and booking service.",
};

// A list item is either plain text or a short bold lead and the rest of the sentence.
type Item = string | [lead: string, text: string];

type Block = { p: string } | { ul: Item[] };

const EMAIL = "genomics@awadoc.com";

// {privacy}, {contact} and {email} in a paragraph become links.
const SECTIONS: { title: string; blocks: Block[] }[] = [
  {
    title: "About these terms",
    blocks: [
      {
        p: "These terms apply when you use the AwaDoc Genotype Match website and booking service (“the service”), operated by AwaDoc (“we”, “us”). By creating a booking or sending us a message, you agree to these terms. If you don’t agree, please don’t use the service.",
      },
    ],
  },
  {
    title: "What we do",
    blocks: [
      {
        p: "AwaDoc provides genotype counselling, helps couples book genetic tests and fertility procedures, and refers couples to our clinical partner, the Institute of Medical Sciences Africa (IMSA). IVF, embryo testing (PGT-M) and related procedures are carried out by IMSA’s clinical team, who are responsible for clinical decisions about your treatment.",
      },
    ],
  },
  {
    title: "Who can use the service",
    blocks: [
      {
        ul: [
          "You must be at least 18 years old.",
          "You may book for yourself and your partner only with your partner’s knowledge and agreement.",
          "Online treatment bookings are available where the female partner is aged 18 to 35. Older couples can book counselling to discuss their options.",
        ],
      },
    ],
  },
  {
    title: "Medical information and Noura",
    blocks: [
      {
        p: "Information on this website, including answers from Noura, our AI health assistant, is general information and is not a diagnosis or medical advice. Decisions about your care should be made with a qualified doctor. In an emergency, contact your local emergency services.",
      },
    ],
  },
  {
    title: "Bookings",
    blocks: [
      {
        ul: [
          "You must give accurate, complete information, including both partners’ genotypes and contact details.",
          "Your preferred date and time are confirmed by our team, usually within 2 working days. We may offer another time if your choice isn’t available.",
          "Treatment depends on a clinical assessment. IMSA may decide that a procedure isn’t suitable for you.",
        ],
      },
    ],
  },
  {
    title: "Prices and payment",
    blocks: [
      {
        ul: [
          "Prices are shown in Nigerian naira (₦). Amounts in other currencies are approximate and for information only.",
          "Payment is made in full, in one payment, at checkout by card, bank transfer, USSD or mobile money through a licensed payment partner.",
          "Procedure prices marked “estimate” are confirmed at your assessment. If the confirmed price is lower, we refund the difference; if it’s higher, we invoice you before treatment continues, and you may cancel instead.",
          "Travel, accommodation, extra IVF cycles and pregnancy care are not included unless stated.",
        ],
      },
    ],
  },
  {
    title: "Cancellations and refunds",
    blocks: [
      {
        ul: [
          ["Counselling", "cancel at least 24 hours before your session to reschedule once or receive a full refund. Later cancellations and missed sessions are not refunded."],
          ["Procedures", "if IMSA finds at assessment that treatment isn’t suitable, you receive a full refund for procedures not carried out."],
          "If you cancel procedures after your assessment, we refund payments for stages that haven’t started, minus any costs already incurred, such as laboratory test design.",
          "Refunds are made to the original payment method within 14 working days.",
        ],
      },
    ],
  },
  {
    title: "No guarantee of outcome",
    blocks: [
      {
        p: "IVF and embryo testing do not guarantee a pregnancy or a live birth. Some cycles produce no embryos suitable for transfer. Embryo testing is very accurate but not 100%, and confirmatory testing during pregnancy is advised. Payment is for the services provided, not for a particular outcome.",
      },
    ],
  },
  {
    title: "Your responsibilities",
    blocks: [
      {
        ul: [
          "Keep your booking reference and contact details up to date.",
          "Follow the instructions of the clinical team.",
          "Don’t misuse the service, upload harmful files, or try to access other people’s data.",
        ],
      },
    ],
  },
  {
    title: "Your information",
    blocks: [{ p: "We handle your personal and health information as described in our {privacy}, in line with the Nigeria Data Protection Act 2023." }],
  },
  {
    title: "Intellectual property",
    blocks: [
      {
        p: "The website, its content, design and the AwaDoc name and logo belong to AwaDoc or its licensors. You may not copy or reuse them without our written permission, except to share your own receipts and booking details.",
      },
    ],
  },
  {
    title: "Liability",
    blocks: [
      {
        p: "We provide the service with reasonable care and skill. To the extent the law allows, we are not liable for indirect or consequential losses, or for clinical services provided by third parties. Nothing in these terms limits liability that cannot be limited by law.",
      },
    ],
  },
  {
    title: "Changes and governing law",
    blocks: [
      {
        p: "We may update these terms and will show the date of the latest version on this page. These terms are governed by the laws of the Federal Republic of Nigeria, and disputes will be handled by the courts of Nigeria.",
      },
    ],
  },
  {
    title: "Contact",
    blocks: [{ p: "Questions about these terms? {contact} or email {email}." }],
  },
];

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "");

// The text under the page title (centred) and the body text; the body text is justified on a phone.
const bodyPlain = "text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted";
const body = `${bodyPlain} max-sm:text-justify`;
const link = "font-semibold text-ink underline underline-offset-4 transition-colors hover:text-brand";

// A paragraph, with its {privacy}, {contact} and {email} markers turned into links.
function Text({ t }: { t: string }) {
  return (
    <>
      {t.split(/(\{privacy\}|\{contact\}|\{email\})/).map((part, i) => {
        if (part === "{privacy}")
          return (
            <Link key={i} href="/privacy" className={link}>
              privacy policy
            </Link>
          );
        if (part === "{contact}")
          return (
            <Link key={i} href="/contact" className={link}>
              Contact us
            </Link>
          );
        if (part === "{email}")
          return (
            <a key={i} href={`mailto:${EMAIL}`} className={link}>
              {EMAIL}
            </a>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function TermsPage() {
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
          <h1 className="font-heading text-display font-medium leading-[1.05] [-webkit-text-stroke:0.015em_currentColor]">Terms of service</h1>
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
