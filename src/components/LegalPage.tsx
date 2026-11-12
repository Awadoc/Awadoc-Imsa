import Link from "next/link";
import ContentsCard from "@/components/ContentsCard";
import Footer from "@/components/Footer";
import PageNav from "@/components/PageNav";

// A list item is either plain text or a short bold lead and the rest of the sentence.
type Item = string | [lead: string, text: string];
export type Block = { p: string } | { ul: Item[] } | { table: { head: string[]; rows: string[][] } };
export type Section = { title: string; blocks: Block[] };

const EMAIL = "genomics@awadoc.com";
const DPO = "dpo@awadoc.com";

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "");
const body = "text-fl-small leading-[1.7] text-muted";
const link = "font-semibold text-accent underline underline-offset-4 transition-colors hover:text-brand";

// A paragraph, with its {privacy}, {contact}, {email} and {dpo} markers turned into links.
function Text({ t }: { t: string }) {
  return (
    <>
      {t.split(/(\{privacy\}|\{contact\}|\{email\}|\{dpo\})/).map((part, i, all) => {
        if (part === "{privacy}")
          return (
            <Link key={i} href="/privacy" className={link}>
              {i === 0 ? "Privacy policy" : "privacy policy"}
            </Link>
          );
        if (part === "{contact}")
          return (
            <Link key={i} href="/contact" className={link}>
              Contact us
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
        return all.length > 1 ? <span key={i}>{part}</span> : part;
      })}
    </>
  );
}

// A long legal page: a grey top with a "Legal" kicker, the title and the date it was last updated, then the numbered sections beside a table of
// contents that follows you down the page.
export default function LegalPage({ title, updated, intro = [], sections }: { title: string; updated: string; intro?: string[]; sections: Section[] }) {
  return (
    <div data-page className="book-fade bg-bg font-sans text-muted">
      <PageNav />

      <header className="bg-band px-6 pt-10 pb-14 max-md:px-4 max-md:pt-6 max-md:pb-10">
        <div className="book-rise mx-auto flex max-w-7xl flex-col items-start gap-4" style={{ animationDelay: "80ms" }}>
          <span className="text-fl-kicker font-semibold tracking-[0.08em] text-accent uppercase">Legal</span>
          <h1 className="m-0 font-heading text-fl-h1 leading-[1.05] font-semibold tracking-[-0.03em] text-ink">{title}</h1>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-[13px] font-medium text-muted ring-1 ring-line/60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-accent">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            Last updated {updated}
          </span>
        </div>
      </header>

      <main className="px-6 py-16 max-md:px-4 max-md:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="book-rise min-w-0 max-w-3xl" style={{ animationDelay: "200ms" }}>
            {intro.map((p) => (
              <p key={p} className={`m-0 mb-10 ${body}`}>
                <Text t={p} />
              </p>
            ))}
            {sections.map((section, i) => (
              <section id={slug(section.title)} key={section.title} className="mt-12 grid scroll-mt-28 grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 first:mt-0 max-sm:grid-cols-[1.9rem_minmax(0,1fr)]">
                <span aria-hidden="true" className="pt-2 text-[13px] font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex min-w-0 flex-col gap-3.5">
                  <h2 className="m-0 font-heading text-[24px] leading-[1.2] font-semibold tracking-[-0.02em] text-ink max-sm:text-[21px]">
                    <span className="sr-only">{i + 1}. </span>
                    {section.title}
                  </h2>
                  {section.blocks.map((block, j) =>
                    "p" in block ? (
                      <p key={j} className={`m-0 ${body}`}>
                        <Text t={block.p} />
                      </p>
                    ) : "ul" in block ? (
                      <ul key={j} className={`m-0 flex list-none flex-col gap-2.5 p-0 ${body}`}>
                        {block.ul.map((item) => (
                          <li key={typeof item === "string" ? item : item[0]} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand" />
                            <span>
                              {typeof item === "string" ? (
                                item
                              ) : (
                                <>
                                  <strong className="font-semibold text-ink">{item[0]}:</strong> {item[1]}
                                </>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div key={j} className="grid gap-3 sm:grid-cols-2">
                        {block.table.rows.map((row) => (
                          <section key={row[0]} className="rounded-2xl bg-band p-5">
                            <h3 className="m-0 font-heading text-[17px] font-semibold text-ink">{row[0]}</h3>
                            <dl className={`m-0 mt-3 flex flex-col gap-2.5 ${body}`}>
                              {block.table.head.map((label, k) => (
                                <div key={label}>
                                  <dt className="font-semibold text-ink">{label}</dt>
                                  <dd className="m-0">{row[k + 1]}</dd>
                                </div>
                              ))}
                            </dl>
                          </section>
                        ))}
                      </div>
                    ),
                  )}
                </div>
              </section>
            ))}
          </article>

          <ContentsCard items={sections.map((section) => ({ href: `#${slug(section.title)}`, label: section.title }))} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
