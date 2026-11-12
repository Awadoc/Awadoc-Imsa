// The six booking steps, in order, as a grid of white cards on a grey band: a big mint numeral, the step's name and a short line.
const STEPS = [
  { title: "Register", text: "Your names and contact details. One of you can register for both." },
  { title: "Genotypes", text: "Pick each genotype and see your odds. Not sure? We help confirm." },
  { title: "Location", text: "Your country and address. Couples in any country can book." },
  { title: "Book", text: "Choose counselling, add procedures, pick a date and time." },
  { title: "Results", text: "Share your lab reports for a doctor to check, or skip." },
  { title: "Payment", text: "Review it all and pay once, by card, bank transfer, USSD or mobile money." },
];

export default function StepsStory() {
  return (
    <section id="how-it-works" aria-label="How booking works" className="bg-band px-6 py-24 max-md:px-4 max-md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <h2 className="m-0 text-center font-heading text-fl-h2 leading-[1.1] font-semibold tracking-tight text-ink">Get started in seconds</h2>
        <ol className="m-0 grid list-none grid-cols-3 gap-4 p-0 max-md:grid-cols-1 max-md:gap-2.5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2.5 rounded-2xl bg-card p-7 max-md:grid max-md:grid-cols-[auto_1fr] max-md:items-center max-md:gap-x-4 max-md:gap-y-1 max-md:p-4 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)] motion-reduce:transition-none">
              <span aria-hidden="true" className="font-heading text-fl-num leading-none font-semibold tracking-[-0.03em] text-brand max-md:row-span-2 max-md:min-w-[2.2ch]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 mt-2 max-md:mt-0 font-sans text-fl-lead font-semibold text-ink">
                <span className="sr-only">{i + 1}. </span>
                {step.title}
              </h3>
              <p className="m-0 text-fl-small leading-[1.6] text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
