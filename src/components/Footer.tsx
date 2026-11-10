import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import FooterWhyTrust from "@/components/FooterWhyTrust";
import GetTheApp from "@/components/GetTheApp";
import Partnership from "@/components/Partnership";

const TERMS = "/terms";
const PRIVACY = "/privacy";

// A link with no `href` is shown as plain text until its page exists. `noura` opens the Noura chat, `trust` the "Why trust us" modal.
type FooterLink = { label: string; href?: string; external?: boolean; noura?: boolean; trust?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "FAQs", href: "/#faq" },
    ],
  },
  {
    title: "Trust and credibility",
    links: [
      { label: "Why trust us", trust: true },
      { label: "PGT-M Evidence Hub", href: "/evidence" },
    ],
  },
  {
    title: "Support",
    links: [{ label: "Contact us", href: "/contact" }, { label: "Donate", href: "/donate" }],
  },
  {
    title: "Legal",
    links: [{ label: "Terms of service", href: TERMS }, { label: "Privacy policy", href: PRIVACY }, { label: "Cookie policy", href: "/cookies" }],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/askawadoc", Icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/share/16TDPjFY8a/", Icon: FaFacebookF },
  { label: "X", href: "https://www.twitter.com/askawadoc", Icon: FaXTwitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/askawadoc/", Icon: FaLinkedinIn },
  { label: "YouTube", href: "https://www.youtube.com/@askawadoc", Icon: FaYoutube },
  { label: "TikTok", href: "https://www.tiktok.com/@askawadoc", Icon: FaTiktok },
];

const linkClass =
  "text-(length:--pw) font-medium tracking-[-0.035em] text-muted transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none";

// The footer uses the page's own colors, so it follows the sun/moon switch.
export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-bg text-ink [--pw:calc(0.85*min(var(--text-hero-sub),calc((100vw-2.5rem)/25.8)))] min-[798px]:[--pw:calc(0.85*var(--text-hero-sub))] min-[1100px]:[--bw:calc(10.4*var(--pw))] min-[1100px]:[--bh:calc(3.75*var(--pw))]">
      {/* The hairline, then AwaDoc in partnership with IMSA (the AwaDoc logo here is the footer's logo), then the app buttons. */}
      <div className="gutter">
        <div className="border-t border-ink/10" />
      </div>

      {/* One line: AwaDoc in partnership with IMSA at the left edge, the app buttons at the right edge. When the screen is
          too narrow for both they stack, centred. */}
      {/* The same side margins as the rest of the page. From 798px up it is one line: the partnership on the left, the app
          buttons on the right. Below that they stack, both centred, with the same gap above, between and below. */}
      <div className="gutter flex flex-col items-center [--s:min(var(--text-hero-sub),calc((100vw-2.5rem)/25.8))] [--m:calc((100vw-2.5rem-9.62*var(--s))/14.98)] gap-y-[calc(var(--spacing-section)*0.7)] py-[calc(var(--spacing-section)*0.7)] min-[798px]:flex-row min-[798px]:flex-wrap min-[1100px]:flex-nowrap min-[1100px]:items-stretch min-[798px]:justify-between min-[798px]:gap-x-[calc(28*var(--u))] min-[798px]:pb-[calc(var(--spacing-section)/6)] min-[798px]:pt-[calc(var(--spacing-section)/2)]">
        <Partnership compact note="© 2026 AwaDoc" />
        {/* The links, like Rise: two columns on a phone (up to 797px the second column starts under the IMSA logo, the first under the AwaDoc logo), a row of four on a wide screen: above the partnership and the app buttons, and from 1100px between them (the partnership stacked on the left, the app buttons on the right). */}
        <nav
          aria-label="Footer"
          className="grid w-full max-[797px]:grid-cols-[calc(100vw-2.5rem-8.41*var(--m))_1fr] max-[797px]:gap-x-0 min-[798px]:order-first min-[1100px]:contents grid-cols-2 gap-x-[calc(24*var(--u))] gap-y-[calc(32*var(--u))] min-[798px]:flex min-[798px]:justify-between"
        >
          {COLUMNS.map((col, i) => (
            // On a phone the first column (Explore, Support) is as wide as the AwaDoc logo, with its text centred on the logo's centre.
            <div key={col.title} className={i % 2 === 0 ? "max-[797px]:w-[calc(6.57*var(--m))]" : ""}>
              <div className={i % 2 === 0 ? "max-[797px]:mx-auto max-[797px]:w-[calc(7.6*var(--pw))]" : ""}>
              <h2 className="font-heading text-(length:--pw) font-medium [-webkit-text-stroke:0.015em_currentColor]">{col.title}</h2>
              <ul className="mt-[0.8em] space-y-[0.55em] min-[1100px]:space-y-[0.95em]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.trust ? (
                      <FooterWhyTrust className={linkClass} />
                    ) : !l.href ? (
                      <span className="text-(length:--pw) font-medium tracking-[-0.035em] text-muted">{l.label}</span>
                    ) : l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              </div>
            </div>
          ))}
        </nav>
        <GetTheApp />
      </div>

      {/* The bottom row. On a phone: the social icons, then the small print under them. From 798px, like Rise: the small print at the left, the social handles (icons only) in one row at the right. On a phone, just the icons. */}
      <div className="gutter flex flex-col items-center gap-y-[calc(16*var(--u))] pb-[calc(var(--spacing-section)*0.5)] min-[798px]:flex-row min-[798px]:items-center min-[798px]:justify-between min-[1100px]:justify-end">
                <ul aria-label="AwaDoc on social media" className="flex flex-wrap justify-center min-[798px]:justify-end gap-x-[calc(28*var(--u))] gap-y-[calc(14*var(--u))] max-sm:gap-x-[calc(26*var(--u))]">
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" className={`${linkClass} flex items-center gap-[0.55em]`}>
                <Icon aria-hidden="true" className="size-[1.5em] shrink-0" />
                <span className="sr-only">{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-justify min-[798px]:order-first min-[1100px]:hidden text-[calc(var(--text-hero-sub)*0.7)] font-medium leading-relaxed tracking-[-0.02em] text-muted min-[798px]:text-left">
          © 2026 AwaDoc
        </p>
      </div>

      {/* Wordmark stretched edge to edge (no side gap), with the bottom quarter cut off.
          SVG textLength makes the text exactly as wide as the screen at any size.
          The viewBox is 1000 wide; caps are ~182 tall and start at y=10, so a height of
          147 shows the top three quarters. Decorative only. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 147"
        className="pointer-events-none block w-full select-none text-ink/7"
      >
        <text
          x="0"
          y="192"
          textLength="1000"
          lengthAdjust="spacing"
          fontSize="260"
          fontWeight="500"
          fill="currentColor"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          AwaDoc
        </text>
      </svg>
    </footer>
  );
}
