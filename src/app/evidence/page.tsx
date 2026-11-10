import type { Metadata } from "next";
import Link from "next/link";
import ContentsCard from "@/components/ContentsCard";
import Footer from "@/components/Footer";
import HomeButton from "@/components/HomeButton";
import Logo from "@/components/Logo";
import StickyNav from "@/components/StickyNav";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "PGT-M Evidence Hub | AwaDoc",
  description:
    "How common sickle cell disease is, how embryo testing (PGT-M) works, and what published studies have recorded about its success and accuracy.",
};

// In the text, ^12 is a superscript reference number. A list item is plain text, or a bold lead and the rest of the sentence (the lead
// ends with a colon, or with a full stop when `sep` is ".").
type Item = string | [lead: string, text: string, sep?: ":" | "."];

type Block = { p: string } | { ul: Item[] } | { ol: Item[] } | { stats: [value: string, text: string][] } | { note: string };

const SECTIONS: { title: string; blocks: Block[] }[] = [
  {
    title: "Key figures",
    blocks: [
      {
        stats: [
          ["7.74 million", "people were living with sickle cell disease worldwide in 2021.^1"],
          ["515,000", "babies are born with sickle cell disease each year.^1"],
          ["1 in 4", "Nigerian adults carries the sickle cell gene (AS).^4"],
          ["63%", "of couples had a live birth after PGT-M for sickle cell in a London study of 60 couples.^10"],
        ],
      },
    ],
  },
  {
    title: "The burden of sickle cell disease",
    blocks: [
      {
        p: "Sickle cell disease is one of the most common inherited blood disorders. Most affected babies are born in sub Saharan Africa, and Nigeria carries the largest share.",
      },
      {
        ul: [
          ["376,000", "deaths worldwide were linked to sickle cell disease in 2021, about 11 times the deaths recorded with it as the single cause.^1"],
          ["81,100", "of those deaths were in children under 5, making it the 12th leading cause of death in that age group.^1"],
          ["13.7%", "is how much yearly births with sickle cell disease have risen since 2000, driven by population growth in Africa and the Caribbean.^1"],
          ["50–80%", "of babies born with sickle cell disease in Africa die before age 5, and about 1,000 are born with it every day.^3"],
          ["30%", "of the world’s sickle cell burden is in Nigeria, about 1 in 3 affected babies.^5"],
          ["91,000 to 140,800", "is the projected rise in Nigerian newborns with sickle cell anaemia (HbSS) a year, from 2010 to 2050. India is projected at 33,900 (from 44,400) and DR Congo at 44,700 (from 39,700).^2"],
        ],
      },
      {
        note: "The WHO estimates about 150,000 Nigerian babies are born with sickle cell disease each year.^5 Estimates differ because Nigeria has no national newborn screening: the 150,000 figure covers all forms of sickle cell disease, while 91,000 counts sickle cell anaemia only.",
      },
    ],
  },
  {
    title: "Who PGT-M can help",
    blocks: [
      {
        p: "Each parent passes one of their two haemoglobin genes to each child. When both partners carry the gene, every natural pregnancy carries a risk of sickle cell disease. PGT-M lets the couple transfer only unaffected embryos.",
      },
      {
        ul: [
          ["AS + AS", "25% AA, 50% AS, 25% SS in each pregnancy. PGT-M can help."],
          ["AS + SS", "50% AS, 50% SS. PGT-M can help."],
          ["AS + SC", "25% AS, 25% AC, 25% SS, 25% SC in each pregnancy. That’s a 50% chance of sickle cell disease. PGT-M can help."],
          ["AC + SS", "50% AS, 50% SC. PGT-M can help."],
          ["AC + AC", "25% AA, 50% AC, 25% CC. No child can have sickle cell disease, so PGT-M isn’t needed for sickle cell."],
          ["AA + SS", "every child is AS (a carrier). PGT-M isn’t needed."],
          ["SS + SS", "every embryo is affected, so PGT-M can’t help. Donor eggs or sperm are the option."],
        ],
      },
    ],
  },
  {
    title: "How PGT-M works",
    blocks: [
      { p: "PGT-M tests embryos made through IVF for one inherited condition. Embryos are tested and selected. Nothing in an embryo is edited." },
      {
        ol: [
          ["Family DNA workup (3–6 weeks).", "Both partners give blood or cheek swab samples, ideally with an affected relative. The lab designs a test specific to the family.^17"],
          ["Ovarian stimulation (10–14 days).", "Daily hormone injections help several eggs mature, with scans to track them."],
          ["Egg collection and ICSI (1 day).", "Eggs are collected under sedation and fertilised in the lab, usually by injecting one sperm into each egg."],
          ["Embryo biopsy (day 5–6).", "A few cells are taken from the outer layer of each blastocyst, the part that becomes the placenta."],
          ["Genetic testing (1–3 weeks).", "Each sample is tested for the family’s sickle cell variant. Embryos are frozen while results come back."],
          ["Transfer and confirmation (later cycle).", "An unaffected embryo is transferred. A confirmatory test during pregnancy is advised.^12"],
        ],
      },
    ],
  },
  {
    title: "Milestones",
    blocks: [
      {
        ul: [
          ["1990", "Handyside and colleagues in London report the first pregnancies from biopsied embryos, tested to avoid X linked disease.^6"],
          ["1999", "Weill Cornell, New York, reports the first unaffected pregnancy after embryo testing for sickle cell anaemia: healthy twins, neither affected nor carriers.^7"],
          ["2012, Nigeria", "an AS + AS couple who already had a child with sickle cell anaemia delivered a baby boy with genotype AS after embryo testing.^8"],
          ["2020", "Guy’s and St Thomas’, London, reports results for 60 couples: 63% had a live birth, with no misdiagnoses.^10"],
          ["2020, Nigeria", "at Nisa Premier Hospital, Abuja, 12 embryos from an AS + AS couple were biopsied and genotyped locally. Two AA embryos were transferred, and a healthy AA boy was born at 38 weeks.^9"],
          ["2025", "a study of one widely used testing method covered 9,020 PGT-M cases, 1,017 conditions and about 68,000 embryo biopsies, with no misdiagnoses found among the 73% of cases that could be checked.^13"],
          ["2026, Nigeria", "a 5 year review in Abuja (2019–2023) recorded 90 PGT-M cycles; 94.4% were for sickle cell.^16"],
        ],
      },
    ],
  },
  {
    title: "What studies have recorded",
    blocks: [
      {
        p: "The clearest sickle cell specific data comes from a 5 year review of every couple treated at one London centre, 2012–2017.^10 Of 60 couples, 70 IVF cycles were started, leading to 76 embryo transfers, 42 clinical pregnancies and 38 live births.",
      },
      {
        ul: [
          ["63%", "live birth per couple starting PGT-M, and 54% per IVF cycle started."],
          ["59%", "of biopsied embryos were unaffected and suitable to transfer."],
          ["55%", "clinical pregnancy per frozen embryo transfer; 9% of pregnancies ended in miscarriage."],
          ["No misdiagnoses", "in any cycle."],
        ],
      },
      {
        p: "Wider data puts this in context. Across 3,782 PGT-M analyses at 45 mainly European centres (2019–2021), 87% of embryos were given a result, the clinical pregnancy rate per transfer was 35%, and the live birth rate per transfer was 26%.^11 In the UK in 2023, 33% of frozen embryo transfers led to a birth across all IVF; for fresh transfers with the woman’s own eggs, the rate was 35% at age 18–34 and 5% at 43–44.^14",
      },
      {
        note: "Results depend strongly on the woman’s age and on the centre. Rates per couple are higher than rates per transfer because many couples have more than one transfer. Nigerian centres have not yet published comparable outcome series.",
      },
    ],
  },
  {
    title: "How accurate PGT-M is",
    blocks: [
      { p: "PGT-M is very accurate, and accuracy has improved as testing methods have changed. No test is perfect, so confirmation during pregnancy is still advised." },
      {
        ul: [
          ["Early methods", "PCR based single gene testing had a 0.40% misdiagnosis rate (10 in 2,473 cycles) in European registry data. Main causes were contamination, sample mix ups and allele dropout.^12"],
          ["Sickle cell series", "no misdiagnoses across all PGT-M cycles for 60 sickle cell couples in London, 2012–2017.^10"],
          ["Modern methods", "9,020 PGT-M cases with no detected misdiagnoses among the 73% that could be checked; 2.35% of samples gave no result.^13"],
        ],
      },
      {
        note: "The 2025 study was run and funded by the testing provider, and a quarter of its cases could not be independently checked. European registry authors recommend that any confirmatory prenatal test use a different method from the embryo test.^12",
      },
    ],
  },
  {
    title: "Prevention compared with lifelong care",
    blocks: [
      {
        p: "A 2023 US analysis estimated that IVF with PGT-M costs $15,000–25,000 to prevent one case of sickle cell disease, compared with an average lifetime cost of care of $602,000, with estimates up to $1.7 million. Extra yearly costs of care range from $6,636 to $63,436.^15 These are US figures; costs in Nigeria differ, but the same comparison applies to families and health budgets.",
      },
    ],
  },
  {
    title: "What PGT-M can’t do",
    blocks: [
      {
        ul: [
          ["It can’t help SS + SS couples", "Every embryo will be affected; donor eggs or sperm are the option.", "."],
          ["Pregnancy isn’t guaranteed", "Success falls with age, and some couples need more than one cycle.", "."],
          ["Some cycles have no embryo to transfer", "In London, 59% of biopsied embryos were suitable; some cycles produced none.^10", "."],
          ["It needs IVF", "Couples who conceive naturally can use prenatal testing instead.", "."],
          ["It isn’t regulated nationally in Nigeria", "Choose a centre that publishes its methods and results.", "."],
          ["It doesn’t treat sickle cell", "It prevents it in a future child; people living with the disease still need care.", "."],
        ],
      },
    ],
  },
];

// The numbered sources. A "doi:" in the text becomes a link. The short site names are as given, with no web address.
const SOURCES: string[] = [
  "GBD 2021 Sickle Cell Disease Collaborators. Global, regional, and national prevalence and mortality burden of sickle cell disease, 2000–2021. The Lancet Haematology, 2023. thelancet.com · IHME summary",
  "Piel FB, Hay SI, Gupta S, Weatherall DJ, Williams TN. Global burden of sickle cell anaemia in children under five, 2010–2050. PLoS Medicine 10(7): e1001484, 2013. doaj.org",
  "World Health Organization Regional Office for Africa. Regional factsheet on sickle cell disease, May 2024. afro.who.int",
  "Federal Ministry of Health and Social Welfare, Nigeria. World Sickle Cell Day statement, 19 June 2025, reported by Leadership. leadership.ng",
  "Africa Check. Weighing Nigeria’s sickle cell burden: is it the world’s highest? africacheck.org",
  "Handyside AH, Kontogianni EH, Hardy K, Winston RM. Pregnancies from biopsied human preimplantation embryos sexed by Y specific DNA amplification. Nature 344: 768–770, 1990. pubmed",
  "Xu K, Shi ZM, Veeck LL, Hughes MR, Rosenwaks Z. First unaffected pregnancy using preimplantation genetic diagnosis for sickle cell anemia. JAMA, 1999. jamanetwork.com",
  "Okeke et al. Pre implantation genetic diagnosis for sickle cell disease (case report). Nigerian Medical Journal. ajol.info",
  "Wada I, Danga C, Chair M. Live birth following preimplantation genetic testing to prevent sickle cell disease in a low resource setting: a case report. African Journal of Reproductive Health 24(4): 218–220, 2020. ajol.info",
  "Guy’s and St Thomas’ NHS Foundation Trust. Cumulative outcome of pre implantation genetic diagnosis for sickle cell disease: a 5 year review. British Journal of Haematology, 2020. doi:10.1111/bjh.16930. LSHTM repository",
  "ESHRE PGT Consortium. Data collection XXII–XXIV: PGT analyses from 2019 to 2021. Human Reproduction 41(7): 1050, 2026. academic.oup.com",
  "Wilton L et al., ESHRE PGD Consortium. The causes of misdiagnosis and adverse outcomes in PGD. Human Reproduction, 2009. eshre.eu",
  "Schadwell A, Griffin DK et al. Universal preimplantation genetic testing for monogenic disease (Karyomapping): diagnosis of more than 1,000 unique disorders with no detected misdiagnoses. Human Reproduction 40(12): 2440, 2025. academic.oup.com",
  "Human Fertilisation and Embryology Authority (UK). Fertility treatment 2023: trends and figures. hfea.gov.uk",
  "Kumar W, Schulman K, Shah A. Health Affairs Forefront, 2023, reported by Stanford Medicine. med.stanford.edu",
  "Wada I, Adebayo AO et al. Indications for preimplantation genetic testing at a Nigerian fertility and genetic center: a 5 year retrospective study. African Journal of Reproduction and Gynaecological Endoscopy, 2026. doi:10.4103/ajrge.ajrge_2_25. summary",
  "Igenomix. PGT-M outline for clinicians (probe development timelines). igenomix.com",
];

const SOURCES_TITLE = "Sources";

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "");

// The text under the page title (centred) and the body text; the body text is justified on a phone.
const bodyPlain = "text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted";
const body = `${bodyPlain} max-sm:text-justify`;

// Text with ^12 turned into a superscript reference number that links to that source.
function Text({ t }: { t: string }) {
  return (
    <>
      {t.split(/\^(\d+)/).map((part, i) =>
        i % 2 === 1 ? (
          <sup key={i} className="ml-[0.1em] text-[0.7em] font-semibold text-accent">
            <a href={`#source-${part}`} className="hover:underline">
              {part}
            </a>
          </sup>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Lead({ item }: { item: Exclude<Item, string> }) {
  const sep = item[2] ?? ":";
  return (
    <>
      <strong className="font-semibold text-ink">
        {item[0]}
        {sep}
      </strong>{" "}
      <Text t={item[1]} />
    </>
  );
}

// A source line, with any DOI as a link.
function Source({ t }: { t: string }) {
  return (
    <>
      {t.split(/(doi:10\.[^\s]+?)(?=\.?(?:\s|$))/).map((part, i) =>
        part.startsWith("doi:10.") ? (
          <a key={i} href={`https://doi.org/${part.slice(4)}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors hover:text-brand">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function EvidencePage() {
  const all = [...SECTIONS.map((s) => s.title), SOURCES_TITLE];
  return (
    <div data-page className="book-fade">
      <StickyNav>
        <Link href="/" aria-label="AwaDoc home">
          <Logo className="h-8 w-auto max-sm:h-6" />
        </Link>
        <div />
        <div className="col-start-3 flex items-center gap-[calc(8*var(--u))] justify-self-end">
          <HomeButton />
          <ThemeToggle />
        </div>
      </StickyNav>

      <main className="gutter relative z-10 pb-[calc(var(--spacing-section)*1.5)] pt-[calc(var(--spacing-section)*0.6)]">
                <header className="book-rise mx-auto max-w-[56em] text-center" style={{ animationDelay: "120ms" }}>
          <h1 className="font-heading text-display font-medium leading-[1.05] [-webkit-text-stroke:0.015em_currentColor]">
            The evidence behind sickle cell free pregnancies
          </h1>
          <p className={`mt-[1em] ${bodyPlain}`}>
            How common sickle cell disease is, how embryo testing (PGT-M) works, and what published studies have recorded about its success and
            accuracy. Reviewed November 2026.
          </p>
        </header>

        <div className="mx-auto mt-[calc(var(--spacing-section)*0.5)] grid min-w-0 max-w-[76em] grid-cols-[minmax(0,1fr)] gap-x-[calc(64*var(--u))] gap-y-[calc(40*var(--u))] lg:grid-cols-[minmax(0,1fr)_19em]">
          <article className="min-w-0">
            <div className="book-rise" style={{ animationDelay: "300ms" }}>
              {SECTIONS.map((section, i) => (
                <section id={slug(section.title)} key={section.title} className="mt-[calc(var(--spacing-section)*0.9)] scroll-mt-28 first:mt-0">
                  <h2 className="font-heading text-h2 font-medium leading-[1.06] [-webkit-text-stroke:0.015em_currentColor]">
                    {i + 1}. {section.title}
                  </h2>
                  {section.blocks.map((block, j) => {
                    if ("p" in block)
                      return (
                        <p key={j} className={`mt-[1em] ${body}`}>
                          <Text t={block.p} />
                        </p>
                      );
                    if ("note" in block)
                      return (
                        <p key={j} className={`mt-[1.4em] rounded-[20px] bg-ink/5 p-[1.1em] ${body}`}>
                          <Text t={block.note} />
                        </p>
                      );
                    if ("stats" in block)
                      return (
                        <div key={j} className="mt-[1.2em] grid gap-3 sm:grid-cols-2">
                          {block.stats.map(([value, text]) => (
                            <div key={value} className="rounded-[20px] bg-ink/5 p-[1.1em]">
                              <p className="font-heading text-h2 font-medium leading-none text-accent [-webkit-text-stroke:0.015em_currentColor]">{value}</p>
                              <p className={`mt-[0.6em] ${body}`}>
                                <Text t={text} />
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    const ordered = "ol" in block;
                    const items = ordered ? block.ol : block.ul;
                    const List = ordered ? "ol" : "ul";
                    return (
                      <List
                        key={j}
                        className={`mt-[1em] space-y-[0.8em] ${body} ${ordered ? "list-decimal pl-[1.6em] marker:font-semibold marker:text-accent" : "list-disc pl-[1.4em] marker:text-accent"}`}
                      >
                        {items.map((item) => (
                          <li key={typeof item === "string" ? item : item[0]}>{typeof item === "string" ? <Text t={item} /> : <Lead item={item} />}</li>
                        ))}
                      </List>
                    );
                  })}
                </section>
              ))}

              <section id={slug(SOURCES_TITLE)} className="mt-[calc(var(--spacing-section)*0.9)] scroll-mt-28">
                <h2 className="font-heading text-h2 font-medium leading-[1.06] [-webkit-text-stroke:0.015em_currentColor]">
                  {all.length}. {SOURCES_TITLE}
                </h2>
                <p className={`mt-[1em] ${body}`}>Figures are quoted as published. Where a source gave a range, the range is shown.</p>
                <ol className={`mt-[1em] list-decimal space-y-[0.8em] pl-[1.8em] marker:font-semibold marker:text-accent ${body}`}>
                  {SOURCES.map((s, i) => (
                    <li key={i} id={`source-${i + 1}`} className="scroll-mt-28">
                      <Source t={s} />
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </article>

          <ContentsCard items={all.map((title) => ({ href: `#${slug(title)}`, label: title }))} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
