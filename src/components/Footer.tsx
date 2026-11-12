import Image from "next/image";
import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import FooterWhyTrust from "@/components/FooterWhyTrust";

const TERMS = "/terms";
const PRIVACY = "/privacy";

// A link with no `href` is shown as plain text until its page exists. `trust` opens the "Why trust us" modal.
type FooterLink = { label: string; href?: string; external?: boolean; trust?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  { title: "Explore", links: [{ label: "FAQs", href: "/#faq" }] },
  {
    title: "Trust and credibility",
    links: [{ label: "Why trust us", trust: true }, { label: "PGT-M Evidence Hub", href: "/evidence" }],
  },
  { title: "Support", links: [{ label: "Contact us", href: "/contact" }, { label: "Donate", href: "/donate" }] },
  { title: "Legal", links: [{ label: "Terms of service", href: TERMS }, { label: "Privacy policy", href: PRIVACY }, { label: "Cookie policy", href: "/cookies" }] },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/askawadoc", Icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/share/16TDPjFY8a/", Icon: FaFacebookF },
  { label: "X", href: "https://www.twitter.com/askawadoc", Icon: FaXTwitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/askawadoc/", Icon: FaLinkedinIn },
  { label: "YouTube", href: "https://www.youtube.com/@askawadoc", Icon: FaYoutube },
  { label: "TikTok", href: "https://www.tiktok.com/@askawadoc", Icon: FaTiktok },
];

const linkClass = "text-[14px] text-[#9aa3ae] no-underline transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none";
const storeClass =
  "inline-flex h-[52px] w-full max-w-[200px] items-center max-md:max-w-none max-md:flex-1 gap-2.5 rounded-xl border border-[#2a303a] bg-[#10131a] px-3.5 text-white no-underline transition-colors duration-200 hover:border-[#4a5260] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500";

// The footer is dark (#0A0D12) in both themes: the logo and the partnership, the link columns, the app buttons, the small print with the
// social icons, and the big faded wordmark cut off at the bottom.
export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#0a0d12] px-6 pt-18 text-[#9aa3ae] max-md:px-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <div className="grid grid-cols-6 gap-8 max-[1024px]:grid-cols-3 max-md:grid-cols-2">
          {/* On a phone the AwaDoc logo, "in partnership with" and the IMSA logo share one line, sized from the screen's width so they always fit. */}
          <div className="flex flex-col items-start gap-3.5 max-md:col-span-2 max-md:flex-row max-md:flex-nowrap max-md:items-center max-md:gap-2">
            <Image src="/footer/awadoc-logo.png" alt="AwaDoc" width={3492} height={717} className="h-6 w-auto shrink-0 max-md:h-[clamp(16px,5vw,24px)]" />
            <span className="text-[13px] whitespace-nowrap max-md:text-[clamp(10px,3vw,13px)]">in partnership with</span>
            <Image src="/footer/imsa-logo-dark.png" alt="Institute of Medical Sciences Africa (IMSA)" width={1384} height={352} className="h-10 w-auto shrink-0 max-md:h-[clamp(24px,7.4vw,40px)]" />
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3.5">
              <span className="text-[12px] font-semibold tracking-[0.08em] text-white uppercase">{col.title}</span>
              {col.links.map((l) =>
                l.trust ? (
                  <FooterWhyTrust key={l.label} className={`${linkClass} cursor-pointer text-left`} />
                ) : !l.href ? (
                  <span key={l.label} className="text-[14px]">
                    {l.label}
                  </span>
                ) : l.external ? (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.label} href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                ),
              )}
            </nav>
          ))}

          {/* On a phone the two app buttons sit side by side under the links. */}
          <div className="flex flex-col items-start gap-2.5 max-[1024px]:col-span-1 max-md:col-span-2 max-md:flex-row">
            <a href="https://apps.apple.com/ng/app/awadoc-your-health-assistant/id6769415874" target="_blank" rel="noopener noreferrer" className={storeClass}>
              <FaApple aria-hidden="true" className="size-6 shrink-0" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[10px] text-white/75">Download on the</span>
                <span className="truncate text-[15px] font-semibold">App Store</span>
              </span>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.awadoc.mobile" target="_blank" rel="noopener noreferrer" className={storeClass}>
              <FaGooglePlay aria-hidden="true" className="size-5 shrink-0" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[10px] text-white/75">Get it on</span>
                <span className="truncate text-[15px] font-semibold">Google Play</span>
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1e232b] pt-6">
          <span className="text-[13px]">© 2026 AwaDoc</span>
          <ul aria-label="AwaDoc on social media" className="m-0 flex list-none gap-2 p-0">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-[#2a303a] text-[#9aa3ae] no-underline transition-colors duration-200 hover:border-[#4a5260] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden="true" className="mt-10 text-center font-heading text-[22vw] leading-[0.8] tracking-tighter whitespace-nowrap text-[#151922] select-none" style={{ fontWeight: 700 }}>
        AwaDoc
      </div>
    </footer>
  );
}
