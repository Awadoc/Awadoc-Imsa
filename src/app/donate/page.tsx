import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import PageNav from "@/components/PageNav";
import "./donate.css";

export const metadata: Metadata = {
  title: "Donate | AwaDoc",
  description: "Help a couple get the baby of their dreams. Your gift goes towards counselling, tests and treatment for couples who need help to pay.",
};

const PAY = "https://paystack.shop/pay/w7dn37dhe9";

// The Donate page: on the grey band, a pale "Donate" chip, the heading with its last words in green, a short paragraph and the Donate now button on the
// left, and the family photo on the right in a rounded card with a lime square peeking out behind its corner. Each theme has its own photo, see donate.css.
export default function DonatePage() {
  return (
    <div data-page className="book-fade bg-bg font-sans text-muted">
      <PageNav />

      <section className="bg-band px-6 pt-10 pb-24 max-md:px-4 max-md:pt-6 max-md:pb-14">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="book-rise flex flex-col items-start gap-6 max-lg:order-2" style={{ animationDelay: "80ms" }}>
            <h1 className="m-0 font-heading text-fl-h1 leading-[1.05] font-semibold tracking-[-0.03em] text-ink">
              Help a couple get the baby of <span className="text-brand">their dreams</span>
            </h1>
            <p className="m-0 max-w-[34em] text-fl-lead leading-[1.6] text-muted">
              Embryo testing (PGT-M) lets couples with AS and SS genotypes have children free of sickle cell disease, but most families can&rsquo;t afford it. Your gift goes towards counselling,
              tests and treatment for couples who need help to pay.
            </p>
            <a
              href={PAY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-brand px-5.5 text-fl-small font-semibold text-white no-underline transition-[background-color] duration-200 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 motion-reduce:transition-none"
            >
              Donate now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <div className="book-rise relative max-lg:order-1" style={{ animationDelay: "160ms" }}>
            <span aria-hidden="true" className="absolute -bottom-4 -left-4 size-24 rounded-3xl bg-[#d9f24f]" />
            <div className="relative aspect-square overflow-hidden rounded-3xl max-lg:aspect-5/4">
              <Image
                src="/donate/family-light.jpg"
                alt="A couple holding their baby by a window"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="donate-photo-light object-cover object-[78%_center]"
              />
              <Image
                src="/donate/family.png"
                alt="A couple holding their baby by a window"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="donate-photo-dark object-cover object-[75%_center]"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
