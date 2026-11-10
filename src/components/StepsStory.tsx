// The six booking steps, in order, as a grid of cards.
const STEPS = [
  {
    title: "Register",
    note: "Names and contact",
    text: "Your names and contact details. One of you can register for both.",
  },
  {
    title: "Genotypes",
    note: "Your odds per pregnancy",
    text: "Pick each genotype and see your odds. Not sure? We help confirm.",
  },
  {
    title: "Location",
    note: "Country and address",
    text: "Your country and address. Couples in any country can book.",
  },
  {
    title: "Book",
    note: "Counselling, procedures, time",
    text: "Choose counselling, add procedures, pick a date and time.",
  },
  {
    title: "Results",
    note: "Lab reports and test prep",
    text: "Share your lab reports for a doctor to check, or skip.",
  },
  {
    title: "Payment",
    note: "One secure payment",
    text: "Review it all and pay once, by card, bank transfer, USSD or mobile money.",
  },
];

export default function StepsStory() {
  return (
    <section id="how-it-works" aria-label="How booking works" className="relative z-10 px-[max(1.25rem,5vw)] pt-[calc(var(--spacing-section)*1.5)]">
      <h2 className="mb-[calc(40*var(--u))] text-center font-heading text-h2 max-sm:text-[min(var(--text-h2),calc((100vw-3.6rem)/16.5))] font-medium leading-[1.06] [-webkit-text-stroke:0.015em_currentColor]">
        Get started in seconds
      </h2>

      {/* Big faded numbers cut off at the bottom, with the name and write-up under each. Hover (or tap) one and
          its number and name light up. */}
      <ol className="grid grid-cols-2 gap-x-[calc(24*var(--u))] gap-y-[calc(40*var(--u))] md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            tabIndex={0}
            className="group cursor-default text-center outline-none"
          >
            <div
              aria-hidden="true"
              className="mx-auto h-[0.62em] overflow-hidden font-heading text-[clamp(4rem,9vw,8.5rem)] font-medium leading-none text-ink/35 transition-colors duration-300 mask-[linear-gradient(to_bottom,#000_65%,transparent)] group-hover:text-accent group-focus-visible:text-accent motion-reduce:transition-none"
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-[0.9em] text-hero-sub font-semibold transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
              <span className="sr-only">{i + 1}. </span>
              {step.title}
            </h3>
            <p className="mx-auto mt-[0.6em] max-w-[18em] text-[calc(var(--text-hero-sub)*0.9)] font-medium leading-relaxed tracking-[-0.035em] text-muted">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
