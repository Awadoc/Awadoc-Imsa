import type { Metadata } from "next";
import Link from "next/link";
import ContentsCard from "@/components/ContentsCard";
import Footer from "@/components/Footer";
import HomeButton from "@/components/HomeButton";
import Logo from "@/components/Logo";
import StickyNav from "@/components/StickyNav";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Cookie policy | AwaDoc",
  description: "What AwaDoc Genomics stores in your browser, why, and how you can control it.",
};

// A list item is either plain text or a short bold lead and the rest of the sentence.
type Item = string | [lead: string, text: string];

// A table is shown as one card per row, so it reads the same on a phone and on a wide screen.
type Block = { p: string } | { ul: Item[] } | { table: { head: string[]; rows: string[][] } };

const EMAIL = "genomics@awadoc.com";
const DPO = "dpo@awadoc.com";

// {privacy}, {email} and {dpo} in a paragraph become links.
const INTRO = [
  "AwaDoc Genomics sets only the cookies it needs to work, unless you choose to allow more. We never use advertising cookies, and we never place your genotype or health information in a cookie.",
  "This policy applies to genomics.awadoc.com, operated by AwaDoc. It explains what we store in your browser, why, and how you can control it. It forms part of our {privacy} and follows the Nigeria Data Protection Act 2023.",
];

const SECTIONS: { title: string; blocks: Block[] }[] = [
  {
    title: "What cookies are",
    blocks: [
      {
        p: "Cookies are small text files a website saves in your browser. Local storage and session storage do the same job in a different way. In this policy, “cookies” means all of these.",
      },
      {
        ul: [
          "First party cookies are set by genomics.awadoc.com.",
          "Third party cookies are set by another company whose service appears on our site, such as our payment provider.",
          "Session cookies are deleted when you close your browser. Persistent cookies stay until they expire or you delete them.",
        ],
      },
    ],
  },
  {
    title: "Cookies we use",
    blocks: [
      { p: "We group our cookies into four categories. Only strictly necessary and preference cookies are set without asking you." },
      {
        table: {
          head: ["What it does", "Examples", "How long it lasts", "Your consent"],
          rows: [
            [
              "Strictly necessary",
              "Keeps the site secure and working",
              "Your booking progress, your Noura chat session, security and fraud checks, your cookie choice",
              "Session, or up to 12 months for your cookie choice",
              "Not needed, as the site can’t work without them",
            ],
            [
              "Preferences",
              "Remembers choices you make",
              "Your currency, light or dark mode, your saved “My bookings” list",
              "Up to 12 months, or until you clear your browser",
              "Not needed, as you set them yourself",
            ],
            [
              "Analytics",
              "Counts visits and shows which pages help couples most, using grouped data that doesn’t identify you",
              "Page views, time on page, device type",
              "Up to 13 months",
              "Only if you accept",
            ],
            [
              "Payment (third party)",
              "Processes your payment securely and prevents fraud",
              "Cookies set by Paystack on its checkout page",
              "Set by Paystack",
              "Set only when you choose to pay",
            ],
          ],
        },
      },
      { p: "If you decline analytics, no analytics cookies are set and the site works exactly the same." },
    ],
  },
  {
    title: "Your consent and our legal basis",
    blocks: [
      {
        p: "We set strictly necessary and preference cookies because they are needed to give you the service you ask for. We set analytics cookies only with your consent, which you give through the cookie banner on your first visit.",
      },
      {
        p: "The banner gives you two equal choices: Accept analytics or Essential only. We never pre tick a box, and closing the banner counts as Essential only. We record your choice so we don’t ask again on every visit.",
      },
    ],
  },
  {
    title: "Changing your choice",
    blocks: [
      { p: "You can change your mind at any time, and withdrawing consent is as easy as giving it." },
      {
        ul: [
          "On our site: clear the site data for genomics.awadoc.com in your browser, and the cookie banner will ask you again.",
          "In your browser: clear or block cookies and site data in your browser settings. Most browsers also let you block third party cookies only.",
        ],
      },
      {
        p: "If you clear your browser data, your saved “My bookings” list will disappear from that device. Your booking itself stays safe with us, and we can send the details again if you email {email}.",
      },
    ],
  },
  {
    title: "How long we keep cookie data",
    blocks: [
      {
        p: "Each cookie lasts no longer than the period shown in section 2. When you withdraw consent, we stop collecting analytics data from then on and delete our analytics cookies from your browser.",
      },
    ],
  },
  {
    title: "Third party services",
    blocks: [
      {
        p: "When you pay, you go to Paystack’s secure checkout, which sets its own cookies to process the payment and prevent fraud. Paystack’s own privacy policy covers these cookies, and we can’t read them. Links to other sites, such as our social media pages or the app stores, are covered by those sites’ own policies.",
      },
    ],
  },
  {
    title: "What we never do",
    blocks: [
      {
        ul: [
          "We never use advertising or retargeting cookies.",
          "We never track you across other websites.",
          "We never store your genotype, lab results or health information in a cookie.",
          "We never sell cookie data or share it for marketing.",
        ],
      },
    ],
  },
  {
    title: "Changes to this policy",
    blocks: [
      {
        p: "If we add a new type of cookie, we will update this policy and change the date at the top. If the change needs your consent, we will ask again through the cookie banner before setting it.",
      },
    ],
  },
  {
    title: "Contact us",
    blocks: [{ p: "For questions about cookies or your data, email our Data Protection Officer at {dpo}. For anything else, email {email}." }],
  },
];

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "");

// The text under the page title (centred) and the body text; the body text is justified on a phone.
const bodyPlain = "text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted";
const body = `${bodyPlain} max-sm:text-justify`;
const link = "font-semibold text-ink underline underline-offset-4 transition-colors hover:text-brand";

// A paragraph, with its {privacy}, {email} and {dpo} markers turned into links.
function Text({ t }: { t: string }) {
  return (
    <>
      {t.split(/(\{privacy\}|\{email\}|\{dpo\})/).map((part, i) => {
        if (part === "{privacy}")
          return (
            <Link key={i} href="/privacy" className={link}>
              Privacy policy
            </Link>
          );
        if (part === "{email}")
          return (
            <a key={i} href={`mailto:${EMAIL}`} className={link}>
              {EMAIL}
            </a>
          );
        if (part === "{dpo}")
          return (
            <a key={i} href={`mailto:${DPO}`} className={link}>
              {DPO}
            </a>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function CookiesPage() {
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
          <h1 className="font-heading text-display font-medium leading-[1.05] [-webkit-text-stroke:0.03em_currentColor]">Cookie policy</h1>
          <p className={`mt-[1em] ${bodyPlain}`}>Last updated 7 November 2026</p>
        </header>

        <div className="mx-auto mt-[calc(var(--spacing-section)*0.5)] grid min-w-0 max-w-[76em] grid-cols-[minmax(0,1fr)] gap-x-[calc(64*var(--u))] gap-y-[calc(40*var(--u))] lg:grid-cols-[minmax(0,1fr)_19em]">
          <article className="min-w-0">
            <div className="book-rise" style={{ animationDelay: "300ms" }}>
              {INTRO.map((p) => (
                <p key={p} className={`mb-[1em] ${body}`}>
                  <Text t={p} />
                </p>
              ))}
              {SECTIONS.map((section, i) => (
                <section id={slug(section.title)} key={section.title} className="mt-[calc(var(--spacing-section)*0.9)] scroll-mt-28">
                  <h2 className="font-heading text-h2 font-medium leading-[1.06] [-webkit-text-stroke:0.015em_currentColor]">
                    {i + 1}. {section.title}
                  </h2>
                  {section.blocks.map((block, j) =>
                    "p" in block ? (
                      <p key={j} className={`mt-[1em] ${body}`}>
                        <Text t={block.p} />
                      </p>
                    ) : "ul" in block ? (
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
                    ) : (
                      <div key={j} className="mt-[1.2em] grid gap-[calc(14*var(--u))] sm:grid-cols-2">
                        {block.table.rows.map((row) => (
                          <section key={row[0]} className="rounded-[20px] bg-ink/5 p-[calc(18*var(--u))]">
                            <h3 className="font-heading text-h3 font-medium [-webkit-text-stroke:0.015em_currentColor]">{row[0]}</h3>
                            <dl className="mt-[0.6em] space-y-[0.6em] text-[calc(var(--text-hero-sub)*0.92)] font-medium leading-relaxed tracking-[-0.03em] text-muted">
                              {block.table.head.map((label, k) => (
                                <div key={label}>
                                  <dt className="font-semibold text-ink">{label}</dt>
                                  <dd>{row[k + 1]}</dd>
                                </div>
                              ))}
                            </dl>
                          </section>
                        ))}
                      </div>
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
