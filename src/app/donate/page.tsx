import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import HomeButton from "@/components/HomeButton";
import Logo from "@/components/Logo";
import StickyNav from "@/components/StickyNav";
import ThemeToggle from "@/components/ThemeToggle";
import "./donate.css";

export const metadata: Metadata = {
  title: "Donate | AwaDoc",
  description: "Help a couple get the baby of their dreams. Your gift goes towards counselling, tests and treatment for couples who need help to pay.",
};

const PAY = "https://paystack.shop/pay/w7dn37dhe9";

// One full screen photo with no frame, the words over its dark left side (over its lower part on a phone), then the footer under it. Each theme has its own photo, see donate.css.
export default function DonatePage() {
  return (
    <div data-page className="book-fade">
      <section className="relative h-svh overflow-hidden bg-bg text-ink">
      {/* On a phone the photo fills the top of the screen and the words sit under it; on a wide screen it fills the whole screen. */}
      <div className="donate-photo">
        <Image
          src="/donate/family.png"
          alt="A couple holding their baby by a window"
          fill
          priority
          sizes="100vw"
          className="donate-photo-dark object-cover object-[88%_center] md:object-[78%_center]"
        />
        <Image
          src="/donate/family-light.jpg"
          alt="A couple holding their baby by a window"
          fill
          priority
          sizes="100vw"
          className="donate-photo-light object-cover object-[88%_center] md:object-[78%_center]"
        />
      </div>
      <div aria-hidden="true" className="donate-fade" />

      <div className="donate-nav">
        <StickyNav spacer={false}>
          <Link href="/" aria-label="AwaDoc home">
            <Logo className="h-8 w-auto max-sm:h-6" />
          </Link>
          <div />
          <div className="col-start-3 flex items-center gap-[calc(8*var(--u))] justify-self-end">
            <HomeButton />
            <ThemeToggle />
          </div>
        </StickyNav>
      </div>

      <main className="gutter relative z-10 flex h-full items-end pb-[max(2rem,env(safe-area-inset-bottom))] md:items-center md:pb-0">
        <div className="donate-copy book-rise max-w-[36em]" style={{ animationDelay: "120ms" }}>
          <h1 className="font-heading text-h2 font-medium leading-[1.06] [-webkit-text-stroke:0.015em_currentColor] in-data-[theme=light]:text-[#0a4a39]">Help a couple get the baby of their dreams</h1>
          <p className="mt-[1em] text-justify text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted in-data-[theme=light]:text-[#0a4a39]">
            Embryo testing (PGT-M) lets couples with AS and SS genotypes have children free of sickle cell disease, but most families can’t afford it. Your gift goes
            towards counselling, tests and treatment for couples who need help to pay.
          </p>
          <a
            href={PAY}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[1.8em] inline-flex min-h-btn cursor-pointer items-center justify-center rounded-[calc(14*var(--u))] border border-brand bg-brand px-[1.4em] py-[0.7em] text-btn font-bold text-[#07110c] shadow-[0_10px_28px_-10px_var(--color-brand)] transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            Donate now
          </a>
        </div>
      </main>
      </section>

      <Footer />
    </div>
  );
}
