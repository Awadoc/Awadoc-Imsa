import Link from "next/link";

// The table of contents beside a long page: a grey rounded card on the right that follows you down the page, with the sections listed
// and a "Contact us" button at the bottom. Hidden on a phone and tablet, where the page is read straight through.
export default function ContentsCard({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Table of contents" style={{ animationDelay: "200ms" }} className="book-rise hidden self-start rounded-[20px] bg-band p-6 lg:sticky lg:top-28 lg:block">
      <p className="m-0 pb-3 text-fl-kicker font-semibold tracking-[0.08em] text-accent uppercase">Table of contents</p>
      <ol className="m-0 flex max-h-[calc(100dvh-17rem)] list-none flex-col gap-0.5 overflow-y-auto p-0 pr-1 [scrollbar-width:thin]">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="flex rounded-lg py-1.5 text-[14px] leading-snug text-ink no-underline transition-colors hover:text-brand focus-visible:text-brand focus-visible:outline-none">
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
      <Link
        href="/contact"
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full border border-brand text-[14px] font-semibold text-accent no-underline transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        Contact us
      </Link>
    </nav>
  );
}
