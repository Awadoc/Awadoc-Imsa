import type { Metadata } from "next";
import ContentsCard from "@/components/ContentsCard";
import Footer from "@/components/Footer";
import PageNav from "@/components/PageNav";

export const metadata: Metadata = {
  title: "PGT-M Evidence Hub | AwaDoc",
  description: "How common sickle cell disease is, how embryo testing (PGT-M) works, and what published studies have recorded about its success and accuracy.",
};

// In the text, [12] is a reference number: it becomes a small superscript link to that source at the bottom of the page.
function Cited({ t }: { t: string }) {
  return (
    <>
      {t.split(/\[(\d+)\]/).map((part, i) =>
        i % 2 ? (
          <sup key={i}>
            <a href={`#source-${part}`} aria-label={`Source ${part}`} className="font-semibold text-accent no-underline hover:text-brand">
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

// Pale card colours, light and dark.
const BLUE = "bg-[#e6ebff] in-data-[theme=dark]:bg-[#1e2340]";
const PEACH = "bg-[#fde6db] in-data-[theme=dark]:bg-[#2c211c]";
const MINT = "bg-tint";
const LIME = "bg-[#faf9e8] in-data-[theme=dark]:bg-[#232b12]";

const FIGURES: [string, string, string][] = [
  ["7.74 million", "people were living with sickle cell disease worldwide in 2021.[1]", BLUE],
  ["515,000", "babies are born with sickle cell disease each year.[1]", PEACH],
  ["1 in 4", "Nigerian adults carries the sickle cell gene (AS).[4]", LIME],
  ["63%", "of couples had a live birth after PGT-M for sickle cell in a London study of 60 couples.[10]", MINT],
];

const BURDEN: [string, string][] = [
  ["376,000", "deaths worldwide were linked to sickle cell disease in 2021, about 11 times the deaths recorded with it as the single cause.[1]"],
  ["81,100", "of those deaths were in children under 5, making it the 12th leading cause of death in that age group.[1]"],
  ["13.7%", "is how much yearly births with sickle cell disease have risen since 2000, driven by population growth in Africa and the Caribbean.[1]"],
  ["50–80%", "of babies born with sickle cell disease in Africa die before age 5, and about 1,000 are born with it every day.[3]"],
  ["30%", "of the world’s sickle cell burden is in Nigeria, about 1 in 3 affected babies.[5]"],
  ["91,000 to 140,800", "is the projected rise in Nigerian newborns with sickle cell anaemia (HbSS) a year, from 2010 to 2050. India is projected at 33,900 (from 44,400) and DR Congo at 44,700 (from 39,700).[2]"],
];

type Verdict = "yes" | "no" | "cant";
const PAIRS: [string, string, Verdict][] = [
  ["AS + AS", "25% AA, 50% AS, 25% SS in each pregnancy. PGT-M can help.", "yes"],
  ["AS + SS", "50% AS, 50% SS. PGT-M can help.", "yes"],
  ["AS + SC", "25% AS, 25% AC, 25% SS, 25% SC in each pregnancy. That’s a 50% chance of sickle cell disease. PGT-M can help.", "yes"],
  ["AC + SS", "50% AS, 50% SC. PGT-M can help.", "yes"],
  ["AC + AC", "25% AA, 50% AC, 25% CC. No child can have sickle cell disease, so PGT-M isn’t needed for sickle cell.", "no"],
  ["AA + SS", "every child is AS (a carrier). PGT-M isn’t needed.", "no"],
  ["SS + SS", "every embryo is affected, so PGT-M can’t help. Donor eggs or sperm are the option.", "cant"],
];
const VERDICT: Record<Verdict, { tag: string; pill: string; border: string; icon: string }> = {
  yes: { tag: "PGT-M can help", pill: "bg-brand text-white in-data-[theme=dark]:text-[#07110c]", border: "border-brand/40", icon: "M5 12l5 5L20 7" },
  no: { tag: "Not needed", pill: "bg-band text-muted", border: "border-line", icon: "M5 12h14" },
  cant: { tag: "Can’t help", pill: "bg-[#fde6db] text-[#6b2e14] in-data-[theme=dark]:bg-[#2c211c] in-data-[theme=dark]:text-[#fbe3d8]", border: "border-[#f6cdb9] in-data-[theme=dark]:border-[#5a3a2e]", icon: "M6 6l12 12M18 6L6 18" },
};

const PROCESS: [string, string, string][] = [
  ["Family DNA workup", "3–6 weeks", "Both partners give blood or cheek swab samples, ideally with an affected relative. The lab designs a test specific to the family.[17]"],
  ["Ovarian stimulation", "10–14 days", "Daily hormone injections help several eggs mature, with scans to track them."],
  ["Egg collection and ICSI", "1 day", "Eggs are collected under sedation and fertilised in the lab, usually by injecting one sperm into each egg."],
  ["Embryo biopsy", "day 5–6", "A few cells are taken from the outer layer of each blastocyst, the part that becomes the placenta."],
  ["Genetic testing", "1–3 weeks", "Each sample is tested for the family’s sickle cell variant. Embryos are frozen while results come back."],
  ["Transfer and confirmation", "later cycle", "An unaffected embryo is transferred. A confirmatory test during pregnancy is advised.[12]"],
];

const MILESTONES: [string, boolean, string][] = [
  ["1990", false, "Handyside and colleagues in London report the first pregnancies from biopsied embryos, tested to avoid X linked disease.[6]"],
  ["1999", false, "Weill Cornell, New York, reports the first unaffected pregnancy after embryo testing for sickle cell anaemia: healthy twins, neither affected nor carriers.[7]"],
  ["2012", true, "an AS + AS couple who already had a child with sickle cell anaemia delivered a baby boy with genotype AS after embryo testing.[8]"],
  ["2020", false, "Guy’s and St Thomas’, London, reports results for 60 couples: 63% had a live birth, with no misdiagnoses.[10]"],
  ["2020", true, "at Nisa Premier Hospital, Abuja, 12 embryos from an AS + AS couple were biopsied and genotyped locally. Two AA embryos were transferred, and a healthy AA boy was born at 38 weeks.[9]"],
  ["2025", false, "a study of one widely used testing method covered 9,020 PGT-M cases, 1,017 conditions and about 68,000 embryo biopsies, with no misdiagnoses found among the 73% of cases that could be checked.[13]"],
  ["2026", true, "a 5 year review in Abuja (2019–2023) recorded 90 PGT-M cycles; 94.4% were for sickle cell.[16]"],
];

const STUDY_STATS: [string, string, string, boolean][] = [
  ["63%", "live birth per couple starting PGT-M, and 54% per IVF cycle started.", MINT, false],
  ["59%", "of biopsied embryos were unaffected and suitable to transfer.", LIME, false],
  ["55%", "clinical pregnancy per frozen embryo transfer; 9% of pregnancies ended in miscarriage.", BLUE, false],
  ["No misdiagnoses", "in any cycle.", PEACH, true],
];

const ACCURACY: [string, string, string][] = [
  ["Early methods", "PCR based single gene testing had a 0.40% misdiagnosis rate (10 in 2,473 cycles) in European registry data. Main causes were contamination, sample mix ups and allele dropout.[12]", "M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"],
  ["Sickle cell series", "no misdiagnoses across all PGT-M cycles for 60 sickle cell couples in London, 2012–2017.[10]", "M5 12l5 5L20 7"],
  ["Modern methods", "9,020 PGT-M cases with no detected misdiagnoses among the 73% that could be checked; 2.35% of samples gave no result.[13]", "M4 19V5M4 19h16M8 15l4-4 3 3 5-6"],
];

const LIMITS: [string, string][] = [
  ["It can’t help SS + SS couples.", "Every embryo will be affected; donor eggs or sperm are the option."],
  ["Pregnancy isn’t guaranteed.", "Success falls with age, and some couples need more than one cycle."],
  ["Some cycles have no embryo to transfer.", "In London, 59% of biopsied embryos were suitable; some cycles produced none.[10]"],
  ["It needs IVF.", "Couples who conceive naturally can use prenatal testing instead."],
  ["It isn’t regulated nationally in Nigeria.", "Choose a centre that publishes its methods and results."],
  ["It doesn’t treat sickle cell.", "It prevents it in a future child; people living with the disease still need care."],
];

// [text, where it was found, doi]
const SOURCES: [string, string, string?][] = [
  ["GBD 2021 Sickle Cell Disease Collaborators. Global, regional, and national prevalence and mortality burden of sickle cell disease, 2000–2021. The Lancet Haematology, 2023.", "thelancet.com · IHME summary"],
  ["Piel FB, Hay SI, Gupta S, Weatherall DJ, Williams TN. Global burden of sickle cell anaemia in children under five, 2010–2050. PLoS Medicine 10(7): e1001484, 2013.", "doaj.org"],
  ["World Health Organization Regional Office for Africa. Regional factsheet on sickle cell disease, May 2024.", "afro.who.int"],
  ["Federal Ministry of Health and Social Welfare, Nigeria. World Sickle Cell Day statement, 19 June 2025, reported by Leadership.", "leadership.ng"],
  ["Africa Check. Weighing Nigeria’s sickle cell burden: is it the world’s highest?", "africacheck.org"],
  ["Handyside AH, Kontogianni EH, Hardy K, Winston RM. Pregnancies from biopsied human preimplantation embryos sexed by Y specific DNA amplification. Nature 344: 768–770, 1990.", "pubmed"],
  ["Xu K, Shi ZM, Veeck LL, Hughes MR, Rosenwaks Z. First unaffected pregnancy using preimplantation genetic diagnosis for sickle cell anemia. JAMA, 1999.", "jamanetwork.com"],
  ["Okeke et al. Pre implantation genetic diagnosis for sickle cell disease (case report). Nigerian Medical Journal.", "ajol.info"],
  ["Wada I, Danga C, Chair M. Live birth following preimplantation genetic testing to prevent sickle cell disease in a low resource setting: a case report. African Journal of Reproductive Health 24(4): 218–220, 2020.", "ajol.info"],
  ["Guy’s and St Thomas’ NHS Foundation Trust. Cumulative outcome of pre implantation genetic diagnosis for sickle cell disease: a 5 year review. British Journal of Haematology, 2020.", "LSHTM repository", "10.1111/bjh.16930"],
  ["ESHRE PGT Consortium. Data collection XXII–XXIV: PGT analyses from 2019 to 2021. Human Reproduction 41(7): 1050, 2026.", "academic.oup.com"],
  ["Wilton L et al., ESHRE PGD Consortium. The causes of misdiagnosis and adverse outcomes in PGD. Human Reproduction, 2009.", "eshre.eu"],
  ["Schadwell A, Griffin DK et al. Universal preimplantation genetic testing for monogenic disease (Karyomapping): diagnosis of more than 1,000 unique disorders with no detected misdiagnoses. Human Reproduction 40(12): 2440, 2025.", "academic.oup.com"],
  ["Human Fertilisation and Embryology Authority (UK). Fertility treatment 2023: trends and figures.", "hfea.gov.uk"],
  ["Kumar W, Schulman K, Shah A. Health Affairs Forefront, 2023, reported by Stanford Medicine.", "med.stanford.edu"],
  ["Wada I, Adebayo AO et al. Indications for preimplantation genetic testing at a Nigerian fertility and genetic center: a 5 year retrospective study. African Journal of Reproduction and Gynaecological Endoscopy, 2026.", "summary", "10.4103/ajrge.ajrge_2_25"],
  ["Igenomix. PGT-M outline for clinicians (probe development timelines).", "igenomix.com"],
];

const TITLES = [
  "Key figures",
  "The burden of sickle cell disease",
  "Who PGT-M can help",
  "How PGT-M works",
  "Milestones",
  "What studies have recorded",
  "How accurate PGT-M is",
  "Prevention compared with lifelong care",
  "What PGT-M can’t do",
  "Sources",
];
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "");

const body = "text-fl-body leading-[1.7] text-muted";
const h2 = "m-0 font-heading text-[clamp(1.5rem,1.2rem+0.9vw,1.875rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-ink";
const section = "flex scroll-mt-28 flex-col gap-5";
const num = "font-heading text-[clamp(1.5rem,1.2rem+1.6vw,2.75rem)] leading-none font-semibold tracking-[-0.03em] text-ink";
const noteBox = "flex gap-3 rounded-2xl bg-band p-4.5 text-fl-small leading-[1.65] text-muted";

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className={noteBox}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.75 size-4.5 shrink-0 text-accent">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

export default function EvidencePage() {
  return (
    <div data-page className="book-fade bg-bg font-sans text-muted">
      <PageNav />

      <header className="bg-band px-6 pt-10 pb-14 max-md:px-4 max-md:pt-6 max-md:pb-10">
        <div className="book-rise mx-auto flex max-w-7xl flex-col items-start gap-4" style={{ animationDelay: "80ms" }}>
          <h1 className="m-0 max-w-225 font-heading text-fl-h1 leading-[1.05] font-semibold tracking-[-0.03em] text-ink">The evidence behind sickle cell free pregnancies</h1>
          <p className="m-0 max-w-180 text-fl-lead leading-[1.65] text-muted">
            How common sickle cell disease is, how embryo testing (PGT-M) works, and what published studies have recorded about its success and accuracy. Reviewed November 2026.
          </p>
        </div>
      </header>

      <main className="px-6 py-16 max-md:px-4 max-md:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="book-rise flex min-w-0 max-w-200 flex-col gap-16 max-md:gap-12" style={{ animationDelay: "200ms" }}>
            {/* Key figures */}
            <section id={slug(TITLES[0])} className={section}>
              <h2 className={h2}>{TITLES[0]}</h2>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                {FIGURES.map(([n, t, tint]) => (
                  <div key={n} className={`flex min-h-37.5 flex-col gap-2.5 rounded-[20px] p-6 text-ink max-sm:min-h-0 max-sm:p-5 ${tint}`}>
                    <span className={num}>{n}</span>
                    <span className="text-fl-small leading-[1.55]">
                      <Cited t={t} />
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Burden */}
            <section id={slug(TITLES[1])} className={section}>
              <h2 className={h2}>{TITLES[1]}</h2>
              <p className={`m-0 ${body}`}>Sickle cell disease is one of the most common inherited blood disorders. Most affected babies are born in sub Saharan Africa, and Nigeria carries the largest share.</p>
              <div className="overflow-hidden rounded-[20px] border border-line">
                {BURDEN.map(([lead, t], i) => (
                  <div key={lead} className={`grid grid-cols-[200px_minmax(0,1fr)] gap-x-5 gap-y-1 px-5.5 py-4.5 max-sm:grid-cols-1 ${i ? "border-t border-line" : ""}`}>
                    <span className="font-heading text-[22px] leading-[1.2] font-semibold tracking-[-0.01em] text-ink">{lead}</span>
                    <span className="text-fl-small leading-[1.6]">
                      <Cited t={t} />
                    </span>
                  </div>
                ))}
              </div>
              <Note>
                <Cited t="The WHO estimates about 150,000 Nigerian babies are born with sickle cell disease each year.[5] Estimates differ because Nigeria has no national newborn screening: the 150,000 figure covers all forms of sickle cell disease, while 91,000 counts sickle cell anaemia only." />
              </Note>
            </section>

            {/* Who can help */}
            <section id={slug(TITLES[2])} className={section}>
              <h2 className={h2}>{TITLES[2]}</h2>
              <p className={`m-0 ${body}`}>
                Each parent passes one of their two haemoglobin genes to each child. When both partners carry the gene, every natural pregnancy carries a risk of sickle cell disease. PGT-M lets the
                couple transfer only unaffected embryos.
              </p>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                {PAIRS.map(([pair, t, v]) => {
                  const d = VERDICT[v];
                  return (
                    <div key={pair} className={`flex flex-col gap-2.5 rounded-[18px] border bg-card p-5 ${d.border}`}>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="font-heading text-2xl font-bold tracking-[-0.01em] text-ink">{pair}</span>
                        <span className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap ${d.pill}`}>
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="size-3">
                            <path d={d.icon} />
                          </svg>
                          {d.tag}
                        </span>
                      </div>
                      <span className="text-fl-small leading-[1.6]">{t}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* How it works */}
            <section id={slug(TITLES[3])} className={section}>
              <h2 className={h2}>{TITLES[3]}</h2>
              <p className={`m-0 ${body}`}>PGT-M tests embryos made through IVF for one inherited condition. Embryos are tested and selected. Nothing in an embryo is edited.</p>
              <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
                {PROCESS.map(([title, dur, t], i) => (
                  <li key={title} className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 rounded-[18px] bg-band px-5 py-4.5 max-sm:gap-3 max-sm:px-4">
                    <span className="grid size-11 place-items-center rounded-full border-2 border-brand bg-card font-sans text-base leading-none font-bold text-ink">{i + 1}</span>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                        <span className="text-base font-semibold text-ink">{title}</span>
                        <span className="inline-flex h-6.5 items-center gap-1.25 rounded-full border border-line bg-card px-2.5 text-xs font-semibold text-muted">
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                          </svg>
                          {dur}
                        </span>
                      </div>
                      <span className="text-fl-small leading-[1.6]">
                        <Cited t={t} />
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Milestones */}
            <section id={slug(TITLES[4])} className={section}>
              <h2 className={h2}>{TITLES[4]}</h2>
              <ol className="relative m-0 flex list-none flex-col gap-5.5 p-0">
                <li aria-hidden="true" className="absolute top-2 bottom-2 left-1.75 w-0.5 bg-line" />
                {MILESTONES.map(([year, ng, t], i) => (
                  <li key={i} className="relative grid grid-cols-[16px_minmax(0,1fr)] gap-4.5">
                    <span aria-hidden="true" className="mt-1.5 size-4 rounded-full border-[3px] border-bg bg-brand shadow-[0_0_0_1px_var(--color-brand)]" />
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xl font-bold text-ink">{year}</span>
                        {ng && <span className="inline-flex h-6 items-center rounded-full bg-tint px-2.25 text-xs font-semibold text-accent">Nigeria</span>}
                      </div>
                      <span className="text-fl-small leading-[1.6]">
                        <Cited t={t} />
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Studies */}
            <section id={slug(TITLES[5])} className={section}>
              <h2 className={h2}>{TITLES[5]}</h2>
              <p className={`m-0 ${body}`}>
                <Cited t="The clearest sickle cell specific data comes from a 5 year review of every couple treated at one London centre, 2012–2017.[10] Of 60 couples, 70 IVF cycles were started, leading to 76 embryo transfers, 42 clinical pregnancies and 38 live births." />
              </p>
              <div className="grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
                {STUDY_STATS.map(([n, t, tint, small]) => (
                  <div key={n} className={`flex flex-col gap-2 rounded-[18px] p-4.5 text-ink ${tint}`}>
                    <span className={`font-heading leading-[1.05] font-semibold tracking-[-0.02em] ${small ? "text-[22px]" : "text-[clamp(1.75rem,1.4rem+1vw,2.125rem)]"}`}>{n}</span>
                    <span className="text-[13px] leading-normal text-muted">{t}</span>
                  </div>
                ))}
              </div>
              <p className={`m-0 ${body}`}>
                <Cited t="Wider data puts this in context. Across 3,782 PGT-M analyses at 45 mainly European centres (2019–2021), 87% of embryos were given a result, the clinical pregnancy rate per transfer was 35%, and the live birth rate per transfer was 26%.[11] In the UK in 2023, 33% of frozen embryo transfers led to a birth across all IVF; for fresh transfers with the woman’s own eggs, the rate was 35% at age 18–34 and 5% at 43–44.[14]" />
              </p>
              <Note>
                Results depend strongly on the woman’s age and on the centre. Rates per couple are higher than rates per transfer because many couples have more than one transfer. Nigerian centres
                have not yet published comparable outcome series.
              </Note>
            </section>

            {/* Accuracy */}
            <section id={slug(TITLES[6])} className={section}>
              <h2 className={h2}>{TITLES[6]}</h2>
              <p className={`m-0 ${body}`}>PGT-M is very accurate, and accuracy has improved as testing methods have changed. No test is perfect, so confirmation during pregnancy is still advised.</p>
              <div className="flex flex-col gap-2.5">
                {ACCURACY.map(([lead, t, icon]) => (
                  <div key={lead} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3.5 rounded-[18px] border border-line bg-card px-5 py-4.5">
                    <span className="grid size-10 place-items-center rounded-xl bg-tint text-accent">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
                        <path d={icon} />
                      </svg>
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-ink">{lead}</span>
                      <span className="text-fl-small leading-[1.6]">
                        <Cited t={t} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Note>
                <Cited t="The 2025 study was run and funded by the testing provider, and a quarter of its cases could not be independently checked. European registry authors recommend that any confirmatory prenatal test use a different method from the embryo test.[12]" />
              </Note>
            </section>

            {/* Prevention vs care */}
            <section id={slug(TITLES[7])} className={section}>
              <h2 className={h2}>{TITLES[7]}</h2>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <div className="flex flex-col gap-2 rounded-[20px] bg-brand p-6 text-white in-data-[theme=dark]:text-[#07110c]">
                  <span className="text-xs font-semibold tracking-[0.08em] uppercase opacity-90">IVF with PGT-M</span>
                  <span className="font-heading text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] leading-none font-semibold tracking-[-0.03em]">$15,000–25,000</span>
                  <span className="text-sm leading-normal">to prevent one case</span>
                </div>
                <div className="flex flex-col gap-2 rounded-[20px] bg-[#1d1d29] p-6 text-white">
                  <span className="text-xs font-semibold tracking-[0.08em] uppercase opacity-70">Lifetime cost of care</span>
                  <span className="font-heading text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] leading-none font-semibold tracking-[-0.03em]">$602,000</span>
                  <span className="text-sm leading-normal opacity-80">average, with estimates up to $1.7 million</span>
                </div>
              </div>
              <p className={`m-0 ${body}`}>
                <Cited t="A 2023 US analysis estimated that IVF with PGT-M costs $15,000–25,000 to prevent one case of sickle cell disease, compared with an average lifetime cost of care of $602,000, with estimates up to $1.7 million. Extra yearly costs of care range from $6,636 to $63,436.[15] These are US figures; costs in Nigeria differ, but the same comparison applies to families and health budgets." />
              </p>
            </section>

            {/* Limits */}
            <section id={slug(TITLES[8])} className={section}>
              <h2 className={h2}>{TITLES[8]}</h2>
              <ul className={`m-0 list-none overflow-hidden rounded-[20px] p-0 ${PEACH}`}>
                {LIMITS.map(([lead, t], i) => (
                  <li key={lead} className={`grid grid-cols-[28px_minmax(0,1fr)] gap-3 px-5 py-4 ${i ? "border-t border-[#f6cdb9] in-data-[theme=dark]:border-[#5a3a2e]" : ""}`}>
                    <span className="grid size-7 place-items-center rounded-full bg-card text-[#6b2e14] in-data-[theme=dark]:text-[#fbe3d8]">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="size-3">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </span>
                    <span className="text-fl-small leading-[1.6] text-ink/80">
                      <b className="font-semibold text-ink">{lead}</b> <Cited t={t} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Sources */}
            <section id={slug(TITLES[9])} className="flex scroll-mt-28 flex-col gap-4">
              <h2 className={h2}>{TITLES[9]}</h2>
              <p className="m-0 text-fl-small leading-[1.6]">Figures are quoted as published. Where a source gave a range, the range is shown.</p>
              <ol className="m-0 list-none border-t border-line p-0">
                {SOURCES.map(([t, tail, doi], i) => (
                  <li key={i} id={`source-${i + 1}`} className="grid scroll-mt-28 grid-cols-[32px_minmax(0,1fr)] gap-2 border-b border-line py-3">
                    <span className="text-[13px] font-semibold text-accent">{i + 1}</span>
                    <span className="text-[13px] leading-[1.6]">
                      {t}
                      {doi && (
                        <>
                          {" "}
                          <a href={`https://doi.org/${doi}`} className="font-semibold text-accent underline underline-offset-4 hover:text-brand">
                            doi:{doi}
                          </a>
                          .
                        </>
                      )}{" "}
                      <span className="opacity-70">{tail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </article>

          <ContentsCard items={TITLES.map((t) => ({ href: `#${slug(t)}`, label: t }))} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
