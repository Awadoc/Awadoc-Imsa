"use client";

import { formatPrice } from "@/lib/currency";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useFaqStore } from "@/store/useFaqStore";

// Amounts are in naira; they are converted for display when another currency is chosen.
const plans = [
  { ngn: 50_000, description: "Virtual counselling, any country", featured: false },
  { ngn: 7_500_000, description: "Full treatment package", featured: true },
];

const cardBase =
  "flex min-h-[calc(200*var(--u))] max-sm:min-h-[calc(140*var(--u))] flex-col gap-[calc(10*var(--u))] rounded-[calc(24*var(--u))] p-card transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export default function Pricing() {
  const currency = useCurrencyStore((s) => s.currency);
  const showQuestion = useFaqStore((s) => s.showQuestion);

  return (
    <section id="pricing" aria-label="Pricing" className="bg-bg px-6 py-24 max-md:px-4 max-md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 max-md:gap-6">
        <h2 className="m-0 text-center font-heading text-fl-h2 leading-[1.1] font-semibold tracking-tight text-ink">Know your costs upfront</h2>
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {plans.map(({ ngn, description, featured }) => {
            const { symbol, digits } = formatPrice(ngn, currency);
            return (
              <article
                key={ngn}
                className={`flex min-h-[180px] flex-col justify-between gap-6 rounded-[20px] border border-line p-8 max-md:min-h-0 max-md:gap-3 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)] motion-reduce:transition-none max-md:p-5 ${featured ? "bg-tint" : "bg-bg"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="m-0 font-heading text-fl-num leading-none font-semibold tracking-[-0.02em] whitespace-nowrap text-ink">
                    {/* Nohemi's naira sign is malformed (it renders as a dot), so the symbol is drawn in Inter. */}
                    <span className="font-sans font-semibold [-webkit-text-stroke:0]">{symbol}</span>
                    {digits}
                  </p>
                  {featured && (
                    <button
                      type="button"
                      onClick={() => showQuestion("cost")}
                      className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full border border-brand bg-card px-4 text-[14px] font-semibold whitespace-nowrap text-accent transition-colors duration-200 hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 in-data-[theme=dark]:hover:bg-band"
                    >
                      Breakdown
                    </button>
                  )}
                </div>
                <span className="text-fl-small text-muted">{description}</span>
              </article>
            );
          })}
        </div>

        {currency !== "NGN" && <p className="m-0 text-center text-fl-small text-muted">Prices are set in naira (₦) and shown here converted at approximate rates.</p>}
      </div>
    </section>
  );
}
