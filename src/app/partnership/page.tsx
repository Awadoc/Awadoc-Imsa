import type { Metadata } from "next";
import LegalPage, { type Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "The partnership | AwaDoc and IMSA",
  description: "How AwaDoc and IMSA are helping couples who carry the sickle cell gene have children free of the disease.",
};

const SECTIONS: Section[] = [
  {
    title: "Introduction",
    blocks: [
      {
        p: "AwaDoc and the Institute of Medical Sciences Africa (IMSA) have formed a partnership to prevent sickle cell disease in the next generation of African children. Through the Genotype Match Programme, couples who both carry the sickle cell gene can have biological children free of the disease, using in vitro fertilisation (IVF) combined with preimplantation genetic testing for monogenic disorders (PGT-M).",
      },
      {
        p: "The programme was developed by the AwaDoc Research Team together with IMSA and released in November 2026. It brings together two complementary strengths. AwaDoc is a digital health company building AI powered care across Africa, from patient facing tools to clinical decision support for hospitals. IMSA is an Abuja based medical institution with specialised expertise in reproductive health, fertility care and medical training.",
      },
      {
        p: "The partnership places AwaDoc at the frontier of genetic health in Africa. For generations, the only answer offered to carrier couples has been avoidance: do not marry, or accept the risk. This partnership offers a third path, grounded in established science and delivered within Africa, for Africans.",
      },
    ],
  },
  {
    title: "The problem",
    blocks: [
      {
        p: "Nigeria carries the heaviest sickle cell burden in the world. About one in four Nigerians, over 40 million people, are healthy carriers of the sickle cell gene (HbAS), and over 150,000 children are born with the disease every year (BusinessDay). That is roughly a third of all sickle cell births worldwide (Dataphyte).",
      },
      {
        p: "The disease is one of the leading causes of early childhood death on the continent. Across sub Saharan Africa, between 50% and 90% of children born with sickle cell disease do not survive past age five. It accounts for 20% of newborn deaths and 5% of all deaths in children under five in Africa (The Guardian Nigeria).",
      },
      {
        p: "Those who survive face a lifetime of pain crises, chronic anaemia, stroke risk, organ damage and frequent hospital admissions. Families carry the cost in lost income, school days, medical bills and emotional strain. Health systems carry it in emergency care and long term specialist treatment.",
      },
      { h3: "A prevention gap" },
      {
        p: "The main prevention strategy in Nigeria is premarital genotype screening and advice to avoid marrying another carrier. This approach has two serious weaknesses.",
      },
      {
        ul: [
          ["Misdiagnosis.", "Poor quality laboratory testing and fake reagents lead many couples to be told wrongly that they are compatible. They discover they are both carriers only after a child is born with the disease (Leadership)."],
          ["A forced choice.", "Even with accurate results, avoidance asks couples to choose between the person they love and a healthy family. Many couples go ahead and take the risk. Others separate, often with great personal and social cost."],
        ],
      },
      {
        p: "Until now, very few African couples have had access to a medical option that removes this choice. The technology exists, but access within Africa has been limited, and travelling abroad for treatment is out of reach for most families.",
      },
    ],
  },
  {
    title: "The science of sickle cell disease",
    blocks: [
      { h3: "The gene" },
      {
        p: "Haemoglobin is the protein in red blood cells that carries oxygen. Its beta chain is made by the HBB gene on chromosome 11. Sickle cell disease is caused by a single change in this gene, which replaces one amino acid (glutamic acid) with another (valine) at position 6 of the beta chain. The altered protein is called haemoglobin S (HbS).",
      },
      { h3: "What happens in the body" },
      {
        p: "When oxygen levels fall, HbS molecules bind together into long, rigid fibres. These fibres distort red blood cells from flexible discs into stiff crescent or “sickle” shapes. Sickled cells block small blood vessels, causing severe pain and damage to the brain, lungs, kidneys and spleen. They also break down after 10 to 20 days instead of the normal 120, which causes chronic anaemia.",
      },
      { h3: "Carriers" },
      {
        p: "People with one normal gene (A) and one sickle gene (S) have sickle cell trait (AS). They are usually healthy, but they can pass the S gene to their children. The gene is common in Africa because carrying a single copy gives partial protection against severe malaria, an advantage that spread the gene over many generations.",
      },
      { h3: "How it is inherited" },
      {
        p: "Every person has two copies of the HBB gene, one from each parent, and passes one of them at random to each child. A child develops sickle cell disease only when they receive an S gene from both parents.",
      },
      {
        p: "When both partners are AS, each pregnancy has a 25% chance of a child with a normal genotype (AA), a 50% chance of a healthy carrier (AS), and a 25% chance of a child with sickle cell disease (SS).",
      },
      {
        p: "When one partner is AS and the other is SS, each pregnancy has a 50% chance of a healthy carrier (AS) and a 50% chance of a child with sickle cell disease (SS).",
      },
      {
        p: "These chances apply to every pregnancy independently. A healthy first child does not lower the risk for the next.",
      },
    ],
  },
  {
    title: "The intervention: IVF with PGT-M",
    blocks: [
      {
        p: "Preimplantation genetic testing for monogenic disorders (PGT-M) tests embryos created through IVF for a specific inherited condition before they are transferred to the womb. It has been used for sickle cell disease since the late 1990s and is now an established technique in fertility centres worldwide. The Genotype Match Programme brings this technique within reach of African couples.",
      },
      { h3: "The treatment process" },
      {
        ol: [
          ["Ovarian stimulation.", "The female partner takes hormone injections for about 10 to 14 days, so that several eggs mature instead of one. More eggs give more embryos to test. Ultrasound scans and blood tests track her response."],
          ["Egg retrieval.", "Mature eggs are collected in a short procedure under sedation, using a fine needle guided by ultrasound."],
          ["Fertilisation by ICSI.", "A single sperm is injected directly into each egg (intracytoplasmic sperm injection). This prevents stray sperm from contaminating the genetic test."],
          ["Embryo culture.", "Embryos grow in the laboratory for five to six days until they reach the blastocyst stage. A blastocyst has an inner cell mass, which becomes the baby, and an outer layer (the trophectoderm), which becomes the placenta."],
          ["Embryo biopsy.", "An embryologist removes a few cells from the trophectoderm. The inner cell mass is not touched."],
          ["Vitrification.", "Embryos are frozen by ultra rapid freezing while the analysis is done. Vitrified embryos survive thawing at very high rates."],
          ["Genetic analysis.", "The small amount of DNA is amplified, and the HBB gene is tested directly. Nearby genetic markers inherited from each parent are also analysed (haplotyping), which cross checks the result and reduces error."],
          ["Selection.", "Each embryo is identified as AA, AS or SS. Only embryos free of sickle cell disease (AA or AS) are considered for transfer."],
          ["Frozen embryo transfer.", "In a later cycle, once the womb lining is prepared, a healthy embryo is thawed and placed in the womb. Other healthy embryos can stay frozen for future pregnancies."],
          ["Pregnancy test.", "A blood test is done about 10 to 14 days after transfer."],
        ],
      },
      { h3: "Expected yield" },
      {
        p: "In an AS + AS couple, about three in four embryos are expected to be free of the disease. In an AS + SS couple, about half are. Actual numbers vary from cycle to cycle.",
      },
      { h3: "Accuracy and confirmation" },
      {
        p: "PGT-M is highly accurate, but no laboratory test is 100% certain. In line with international practice, couples are advised to have confirmatory prenatal testing during pregnancy, by chorionic villus sampling (around 11 to 14 weeks) or amniocentesis (from about 15 weeks).",
      },
      { h3: "Limits of the intervention" },
      {
        p: "PGT-M prevents sickle cell disease in future children. It does not treat anyone already living with the condition. It also cannot help couples where both partners are SS, because every embryo they create will also be SS.",
      },
    ],
  },
  {
    title: "The partners",
    blocks: [
      { h3: "AwaDoc" },
      {
        p: "AwaDoc is a Nigerian digital health company using AI to unify Africa’s fragmented health system. Its products span the full care journey: Noura, an AI health assistant available in seven or more African languages, including voice notes for people who cannot read or type; a Clinical Decision Support Tool covering more than 50 specialties; AI documentation and workflow tools for hospitals; and a partner network for teleconsultations, laboratory services and medication delivery.",
      },
      {
        p: "As of September 2026, AwaDoc had 227,962 registered patients across 34 African countries, 2,892,563 patient interactions, 25,420 teleconsultations and 85,112 medication deliveries. This reach gives the programme a direct channel to couples across Africa and the diaspora.",
      },
      { h3: "IMSA" },
      {
        p: "The Institute of Medical Sciences Africa (IMSA) is an Abuja based medical institution focused on specialised medical training and reproductive health. IMSA has worked with the North East Development Commission to train IVF nurses and improve fertility care in the region (Daily Trust). It also runs postgraduate programmes jointly with the Institute of Reproductive Health at the University of Abuja (Medical World Nigeria). All fertility procedures and embryo testing in the programme take place at IMSA’s laboratory in Abuja.",
      },
      { h3: "Why this partnership works" },
      {
        p: "The two partners bring what the other lacks. AwaDoc brings reach, technology and a trusted digital relationship with patients across the continent. IMSA brings clinical expertise, laboratory infrastructure and a track record in reproductive health training. Together they connect couples who need the programme with the specialists who can deliver it.",
      },
    ],
  },
  {
    title: "Programme design",
    blocks: [
      { h3: "Eligibility" },
      {
        p: "The programme is open to couples where both partners carry the sickle cell gene, specifically AS + AS or AS + SS, and where the female partner is 35 years old or younger. The age limit reflects the decline in egg quality and number with age, which lowers IVF success rates. SS + SS couples are not eligible, because embryo testing alone cannot produce an unaffected embryo for them.",
      },
      { h3: "Global access" },
      {
        p: "The programme is open to couples anywhere in the world. International and diaspora couples complete registration and counselling online, then travel to Abuja for treatment. This model lets African couples abroad receive care on the continent, close to family and at a lower cost than many overseas fertility centres.",
      },
      { h3: "The patient journey" },
      {
        ol: [
          ["Registration.", "Both partners register together and share their genotype results."],
          ["Genotype confirmation.", "Because misdiagnosis is common, both partners may be asked to repeat their genotype test at an accredited laboratory, preferably by high performance liquid chromatography (HPLC) or DNA testing."],
          ["Genetic counselling.", "A specialist explains the results, the options, what IVF and PGT-M involve, and realistic outcomes. Counselling is available virtually or in person."],
          ["Medical assessment.", "Both partners complete fertility and health assessments, including hormone tests and an ultrasound for the female partner and a semen analysis for the male partner."],
          ["IVF and embryo testing.", "Treatment takes place at IMSA’s facility in Abuja."],
          ["Embryo transfer.", "Only embryos free of sickle cell disease are transferred."],
          ["Pregnancy and follow up.", "Couples receive guidance on confirmatory prenatal testing and continued follow up support."],
        ],
      },
      { p: "Couples book counselling and procedures together, in a single payment." },
    ],
  },
  {
    title: "Ethics, safety and quality",
    blocks: [
      { p: "The partnership is built on a commitment to responsible, transparent and patient centred care." },
      {
        ul: [
          ["Medical purpose only.", "Embryo testing in this programme is used only to prevent sickle cell disease."],
          ["Informed consent.", "No procedure takes place until both partners fully understand it and agree, including the decision on what happens to unused embryos."],
          ["Honest counselling.", "Couples are told clearly that IVF success varies with age and health, that some couples need more than one cycle, and that not every cycle produces unaffected embryos."],
          ["Carrier disclosure.", "Couples are informed that an AS embryo will not develop the disease but the child will carry the gene, which is important for the child to know as an adult."],
          ["Patient safety.", "Hormone stimulation can cause bloating and discomfort, and a small number of women develop ovarian hyperstimulation syndrome (OHSS). Care teams monitor closely for it."],
          ["Privacy.", "Genetic and medical information is handled with strict confidentiality."],
          ["Clinical excellence.", "All procedures are carried out by trained fertility specialists and embryologists at IMSA."],
        ],
      },
    ],
  },
  {
    title: "Expected impact",
    blocks: [
      {
        ul: [
          ["For families.", "Every child born through the programme is spared a lifetime of pain crises, hospital stays and the risk of early death. Parents are spared years of emotional and financial strain, and couples no longer have to choose between each other and a healthy family."],
          ["For the health system.", "Each prevented case removes decades of emergency admissions, blood transfusions, specialist care and long term treatment costs from an already stretched health system."],
          ["For prevention in Africa.", "The programme adds a new tool to Africa’s sickle cell prevention efforts, alongside genotype screening and public education. By making PGT-M available within Africa, it reduces dependence on overseas treatment and builds local capacity in reproductive genetics."],
          ["For public awareness.", "Every couple who registers receives accurate genotype confirmation and genetic counselling. This helps correct misdiagnosis and spreads reliable knowledge about how sickle cell is inherited."],
        ],
      },
      { h3: "Alignment with global health goals" },
      {
        p: "The programme supports Sustainable Development Goal 3, in particular target 3.2 on ending preventable deaths of newborns and children under five. It also supports national efforts in Nigeria to reduce the burden of sickle cell disease through prevention.",
      },
    ],
  },
  {
    title: "Conclusion",
    blocks: [
      {
        p: "Sickle cell disease has shaped the lives of millions of African families for generations. Couples have been separated, children have been lost, and parents have carried a heavy burden of pain and grief. For too long, the only answer offered was avoidance.",
      },
      {
        p: "Science now offers a better answer. Through IVF and preimplantation genetic testing, couples who both carry the sickle cell gene can have biological children free of the disease. The technique is established, highly accurate and used in fertility centres worldwide, and through this partnership it is now accessible to African couples on African soil.",
      },
      {
        p: "With the Genotype Match Programme, AwaDoc stands at the frontier of genetic health in Africa. Together with IMSA, we are combining research, clinical expertise and technology to prevent sickle cell disease one family at a time. Every healthy child born through this programme is a step towards a future where sickle cell disease no longer defines African families, and where a genotype no longer decides who a person can love.",
      },
    ],
  },
];

// The partnership page uses the same layout as the privacy policy: a grey top, then numbered sections beside a contents card.
export default function PartnershipPage() {
  return <LegalPage title="AwaDoc × IMSA Genotype Match Programme" sections={SECTIONS} />;
}
