"use client";

import { useId, type ReactNode } from "react";
import { formatPrice } from "@/lib/currency";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useFaqStore } from "@/store/useFaqStore";
import { useNouraStore } from "@/store/useNouraStore";

// [name, amount in naira, is it an estimate]. Shown in the currency chosen in the nav.
const prices: [string, number, boolean][] = [
  ["Virtual counselling", 50_000, false],
  ["In person counselling", 80_000, false],
  ["Genotype confirmation test", 30_000, false],
  ["IVF cycle", 2_900_000, true],
  ["Fertility medication", 1_600_000, true],
  ["Embryo testing (PGT-M)", 2_500_000, true],
  ["Frozen embryo transfer", 500_000, true],
  ["Full treatment package", 7_500_000, false],
];

function PriceList() {
  const currency = useCurrencyStore((s) => s.currency);
  return (
    <dl className="divide-y divide-ink/10 rounded-[calc(16*var(--u))] border border-ink/10">
      {prices.map(([name, ngn, estimate]) => {
        const { symbol, digits } = formatPrice(ngn, currency);
        return (
          <div key={name} className="flex items-baseline justify-between gap-[calc(16*var(--u))] px-[calc(16*var(--u))] py-[calc(12*var(--u))]">
            <dt>{name}</dt>
            <dd className="shrink-0 font-semibold text-ink">
              {symbol}
              {digits}
              {estimate ? " est." : ""}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-[calc(4*var(--u))] text-hero-sub font-medium text-ink">{title}</h4>
      <p>{children}</p>
    </div>
  );
}

const items: { id: string; question: string; answer: ReactNode }[] = [
  {
    id: "pgtm",
    question: "About PGT-M",
    answer: (
      <div className="space-y-[calc(14*var(--u))]">
        <p>
          PGT-M checks embryos made through IVF for one inherited condition, such as sickle cell disease. First, a
          custom test is built from the family&apos;s own DNA. Then a few cells are taken from each embryo on day 5 or 6
          and tested, and only embryos without the condition are transferred.
        </p>
        <p>
          It doesn&apos;t change an embryo&apos;s genes. It&apos;s very accurate but not perfect, so a confirmatory test
          during pregnancy is still advised. It helps AS + AS, AS + SS, AS + SC and AC + SS couples; it can&apos;t help
          SS + SS couples.
        </p>
      </div>
    ),
  },
  {
    id: "age",
    question: "Who can book treatment?",
    answer:
      "Couples where the woman is 18 to 30 can book treatment online. If she is older, book counselling first. A doctor will talk through your options and chances of success.",
  },
  {
    id: "pay",
    question: "How do we pay?",
    answer:
      "In one payment at checkout. In Nigeria, pay by card, bank transfer or USSD. From abroad, pay by card, mobile money or international transfer.",
  },
  {
    id: "cost",
    question: "What does everything cost?",
    answer: (
      <div>
        <PriceList />
        <p className="mt-[calc(14*var(--u))]">
          Procedure prices are estimates until they are confirmed at your assessment. Some couples need more than one
          cycle.
        </p>
      </div>
    ),
  },
  {
    id: "dna",
    question: "Why does treatment start with DNA samples?",
    answer:
      "Embryo testing uses a custom test built from your family's DNA. The lab needs samples from both of you, ideally also from an affected relative, and takes about 3 to 6 weeks to build the test before IVF starts.",
  },
  {
    id: "together",
    question: "Can we book counselling and procedures together?",
    answer:
      "Yes. Choose a counselling option and add any procedures in step 4. You pay for everything in one checkout.",
  },
  {
    id: "edit",
    question: "Does this change or edit the embryo?",
    answer:
      "No. IVF creates several embryos. A few cells are taken from each and genotyped, and only embryos without sickle cell disease are transferred.",
  },
  {
    id: "skip",
    question: "Should we skip counselling?",
    answer:
      "Only if you both have lab confirmed genotypes, you understand the IVF process, and you're ready for the cost. If not, add counselling to your booking.",
  },
  {
    id: "abroad",
    question: "We don't live in Nigeria. Can we book?",
    answer:
      "Yes. Virtual counselling works from any country. Procedures happen at IMSA in Abuja. We arrange your appointments at IMSA, book accommodation near the clinic, and plan your trips around each stage, so you spend as few days in Abuja as possible.",
  },
  {
    id: "aa",
    question: "Why can't we choose AA?",
    answer:
      "If either of you is AA, your children can't inherit sickle cell disease. At most, a child could carry the trait (AS or AC), which doesn't cause illness. So you don't need IVF or embryo testing for sickle cell. If you're unsure of your genotype, choose \"Not sure\" and add a genotype test to your booking.",
  },
  {
    id: "others",
    question: "Which other couples don't need treatment?",
    answer:
      "AC + AC couples have no sickle cell risk; a child could at most have HbCC, a mild condition. Counselling can confirm what your results mean.",
  },
  {
    id: "who",
    question: "Who can embryo testing help?",
    answer:
      "AS + AS, AS + SS, AS + SC and AC + SS couples. SS + SS couples can't be helped by embryo testing, but counselling covers donor options.",
  },
  {
    id: "accurate",
    question: "Is it 100% accurate?",
    answer:
      "No test is perfect. Doctors usually recommend a confirmatory test during pregnancy, and your baby's genotype is checked again after birth.",
  },
  {
    id: "refund",
    question: "Can I get a refund?",
    answer:
      "Cancel at least 24 hours before your counselling session to reschedule once or get a full refund. Procedure payments are refunded in full if IMSA finds treatment isn't suitable at your assessment.",
  },
  {
    id: "see",
    question: "Who sees our information?",
    answer:
      "AwaDoc's care team, and IMSA once you're referred. We never share your genotype with anyone else without your permission.",
  },
  {
    id: "trust",
    question: "Why trust us?",
    answer: (
      <div className="space-y-[calc(16*var(--u))]">
        <Block title="Accredited partner">
          IMSA is accredited by the West African College of Surgeons and works with the University of Abuja.
        </Block>
        <Block title="Proven in Nigeria">
          Embryo testing for sickle cell has already led to healthy births in Nigeria, published in the African Journal
          of Reproductive Health.
        </Block>
        <Block title="Doctors who explain first">
          Counselling with an AwaDoc doctor before you commit, so every decision is informed.
        </Block>
      </div>
    ),
  },
  {
    id: "data",
    question: "How we protect your data",
    answer: (
      <div className="space-y-[calc(16*var(--u))]">
        <Block title="Who looks after your data">
          AwaDoc is responsible for the information you give on this page, under the Nigeria Data Protection Act 2023.
          We only use it with your explicit consent.
        </Block>
        <Block title="What we collect">
          Your names and contact details, address, both genotypes, lab reports you upload, basic fertility history, your
          bookings and payment records. We never see or store your card details; the payment provider handles them.
        </Block>
        <Block title="Why we use it">
          To counsel you, arrange tests and treatment, refer you to IMSA when you ask us to, take payments and remind
          you of appointments.
        </Block>
        <Block title="Who can see it">
          AwaDoc&apos;s care team. IMSA&apos;s clinical team, only once you&apos;re referred. Our payment provider, only
          for payments. Nobody else, unless the law requires it. We never sell your data.
        </Block>
        <Block title="How we protect it">
          Access is limited to the people caring for you. Genotypes are kept off receipts you share. We keep records only
          as long as your care and medical records rules require.
        </Block>
        <Block title="Your rights">
          You can ask to see, correct or delete your data, and withdraw consent at any time, by emailing
          AwaDoc&apos;s Data Protection Officer at dpo@awadoc.com. You can also complain to the Nigeria Data
          Protection Commission.
        </Block>
      </div>
    ),
  },
];

export default function Faq() {
  const uid = useId();
  const openChat = useNouraStore((s) => s.openChat);
  const openId = useFaqStore((s) => s.openId);
  const setOpenId = useFaqStore((s) => s.setOpenId);

  return (
    <section
      id="faq"
      aria-labelledby={`${uid}-title`}
      className="gutter relative z-10 scroll-mt-28 py-[calc(var(--spacing-section)*1.5)]"
    >
      <div className="mx-auto max-w-[calc(1100*var(--u))]">
        <h2
          id={`${uid}-title`}
          className="text-center font-heading text-h2 max-sm:text-[min(var(--text-h2),calc((100vw-3.6rem)/16.5))] font-medium leading-none [-webkit-text-stroke:0.015em_currentColor]"
        >
          FAQs
        </h2>
        <p className="mt-[calc(20*var(--u))] text-center text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted">
          Have more questions?{" "}
          <button
            type="button"
            onClick={openChat}
            aria-haspopup="dialog"
            className="cursor-pointer font-bold text-brand transition-opacity hover:opacity-80 focus-visible:underline"
          >
            Ask Noura
          </button>
        </p>

        <div className="mt-[calc(48*var(--u))] overflow-hidden rounded-[calc(28*var(--u))] border border-ink/10 bg-bg/60 backdrop-blur-sm">
          {items.map((item, i) => {
            const open = openId === item.id;
            const panelId = `${uid}-${item.id}-panel`;
            const buttonId = `${uid}-${item.id}-button`;
            return (
              <div
                key={item.id}
                id={`faq-${item.id}`}
                className={`scroll-mt-28 ${i > 0 ? "border-t border-ink/10" : ""} transition-colors duration-200 ${open ? "bg-ink/4" : "hover:bg-ink/2"}`}
              >
                <h3 className="max-sm:text-[calc(var(--text-h3)*0.8)] text-h3 font-medium leading-snug">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-[calc(24*var(--u))] px-card py-card text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-[calc(40*var(--u))] w-[calc(40*var(--u))] shrink-0 items-center justify-center rounded-full border border-ink/15 bg-bg"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-[calc(16*var(--u))] w-[calc(16*var(--u))]">
                        <path d="M5 12h14" />
                        <path
                          d="M12 5v14"
                          className={`origin-center transition-transform duration-200 motion-reduce:transition-none ${open ? "scale-y-0" : "scale-y-100"}`}
                        />
                      </svg>
                    </span>
                  </button>
                </h3>

                {/* Grid-rows trick: animates height from 0 to the content's natural height. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-card pb-card text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
