// The answers behind "Ask about travel". They work offline: a question is matched to a topic by keyword, no server involved.

export type Block = { p: string } | { ul: string[] };

export type TravelTopic = {
  id: string;
  chip: string;
  title: string;
  keys: Record<string, number>;
  answer: Block[];
  mail?: boolean;
};

export const TRAVEL_MAIL = "genomics@awadoc.com";

export const TRAVEL_TOPICS: TravelTopic[] = [
  {
    id: "trips",
    chip: "How many trips?",
    title: "How many trips will we make?",
    keys: { trip: 3, trips: 3, visit: 3, visits: 3, many: 2, often: 2, times: 2, how: 0.5, long: 2, stay: 2, days: 2, weeks: 2, leave: 3, off: 1 },
    answer: [
      { p: "Most couples make three trips to Abuja:" },
      { ul: ["Assessment and DNA samples, usually 1 to 2 days", "Stimulation and egg collection, about 2 weeks for the female partner", "Embryo transfer, usually 1 to 2 days"] },
      { p: "Between trips you're at home. The custom test takes 3 to 6 weeks to build, and embryo results take 1 to 3 weeks." },
    ],
  },
  {
    id: "partner",
    chip: "Do we both need to come?",
    title: "Do we both need to travel?",
    keys: { both: 4, partner: 4, husband: 4, wife: 4, man: 2, male: 3, sperm: 4, together: 3, alone: 3, need: 1, come: 2 },
    answer: [
      { p: "For the first visit, it's best if you both come, since you each give a DNA sample and meet the team." },
      { p: "For egg collection, the male partner is usually needed on the day to give a sperm sample. If he can't travel then, ask us about freezing a sample in advance." },
      { p: "For the embryo transfer, only the female partner needs to be there, though many couples come together." },
    ],
  },
  {
    id: "visa",
    chip: "Do I need a visa?",
    title: "Do I need a visa?",
    keys: { visa: 5, visas: 5, passport: 4, entry: 3, immigration: 4, british: 2, american: 2, canadian: 2, foreign: 3, citizen: 3, documents: 2 },
    answer: [
      { p: "If you travel on a Nigerian passport, you don't need a visa." },
      { p: "If you travel on another passport, you'll need a Nigerian visa before you fly. Apply through the official Nigeria Immigration Service website, and allow plenty of time." },
      { p: "Make sure your passport is valid for at least 6 months from your arrival date." },
    ],
  },
  {
    id: "health",
    chip: "Vaccines and malaria",
    title: "What about vaccines and malaria?",
    keys: { vaccine: 5, vaccines: 5, vaccination: 5, yellow: 5, fever: 3, malaria: 5, mosquito: 4, health: 3, jab: 4, jabs: 4, shots: 3, medicine: 2 },
    answer: [
      { p: "Yellow fever: you'll need a yellow fever vaccination certificate to enter Nigeria." },
      { p: "Malaria: it's present in Abuja. Use insect repellent, cover up in the evenings and sleep under a net or in an air conditioned room." },
      { p: "Before taking any antimalarial or other medicine, check with your doctor and the IMSA team, because some aren't suitable during fertility treatment." },
    ],
  },
  {
    id: "flights",
    chip: "When to book flights",
    title: "When should we book flights?",
    keys: { flight: 5, flights: 5, fly: 4, book: 2, ticket: 4, tickets: 4, airline: 4, airport: 3, arrive: 2, land: 2, date: 2, dates: 2, when: 1, abv: 4 },
    answer: [
      { p: "Fly into Nnamdi Azikiwe International Airport (ABV) in Abuja." },
      { p: "Book your first trip once your assessment date is confirmed. For the egg collection trip, dates depend on how your body responds to treatment, so choose a flexible or changeable ticket if you can." },
      { p: "We help you time each trip so you spend as few days away as possible." },
    ],
  },
  {
    id: "stay",
    chip: "Where will we stay?",
    title: "Where will we stay?",
    keys: { stay: 3, accommodation: 5, hotel: 5, hotels: 5, apartment: 4, room: 3, sleep: 2, lodging: 4, where: 2, near: 2, airbnb: 4, shortlet: 4 },
    answer: [
      { p: "We book accommodation for you near IMSA before you land, so you're close to the clinic for scans and procedures." },
      { p: "Tell us your budget and what you need, for example a kitchen for a longer stay. Accommodation is paid separately from the treatment package." },
    ],
  },
  {
    id: "costs",
    chip: "Costs not included",
    title: "What isn't included in the price?",
    keys: { cost: 3, costs: 3, price: 3, included: 5, include: 4, extra: 4, extras: 4, flights: 1, budget: 3, pay: 2, money: 3, cash: 4, naira: 4, card: 2 },
    answer: [
      { p: "The ₦7,500,000 package covers treatment. These are not included:" },
      { ul: ["Flights and visas", "Accommodation and local transport", "Meals and personal costs", "Extra IVF cycles, if needed"] },
      { p: "Cards work in many places, but bring some naira cash for small purchases." },
    ],
  },
  {
    id: "pack",
    chip: "What to bring",
    title: "What should we bring?",
    keys: { bring: 5, pack: 5, packing: 5, carry: 3, take: 2, need: 1, checklist: 4, reports: 3, results: 3, documents: 2 },
    answer: [
      { p: "A simple checklist:" },
      {
        ul: [
          "Passports, plus visa and yellow fever certificate if needed",
          "Your genotype results and any previous lab or fertility reports",
          "A list of any medicines you take",
          "Comfortable, loose clothing, especially for egg collection day",
          "Insect repellent and a phone charger adapter (Nigeria uses UK style plugs)",
        ],
      },
    ],
  },
  {
    id: "around",
    chip: "Getting around Abuja",
    title: "How do we get around?",
    keys: { around: 4, transport: 5, taxi: 5, uber: 5, bolt: 5, car: 3, drive: 3, driver: 4, pickup: 4, transfer: 4, getting: 2, move: 2, safe: 3, safety: 3 },
    answer: [
      { p: "Ride hailing apps such as Bolt and Uber work well in Abuja, and the city is easy to get around." },
      { p: "Tell us your arrival time, and we'll help you plan getting from the airport to your accommodation and on to the clinic." },
    ],
  },
  {
    id: "contact",
    chip: "Talk to the team",
    title: "Can I talk to someone?",
    keys: { talk: 4, speak: 4, contact: 5, person: 3, human: 4, email: 4, call: 3, someone: 4, team: 3, help: 1, question: 2 },
    answer: [{ p: "Of course. Email the care team and we'll help you plan your trip, usually within 2 working days." }],
    mail: true,
  },
];

export const TRAVEL_GREETING = "Hi! Planning a trip to Abuja for treatment? Ask me anything, or pick a question below.";

export const TRAVEL_FALLBACK: Block[] = [
  { p: "I don't have an answer for that yet. I can help with trips, visas, vaccines, flights, accommodation, costs and what to bring." },
  { p: "For anything else, email the care team:" },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const stem = (w: string) => (w.length > 4 ? w.replace(/(ing|ed|es|s)$/, "") : w);

/** The topic whose keywords best match the question, or null when nothing scores high enough. */
export function matchTravel(question: string): TravelTopic | null {
  const tokens = new Set<string>();
  for (const w of norm(question).split(" ")) {
    tokens.add(w);
    tokens.add(stem(w));
  }
  let best: TravelTopic | null = null;
  let bestScore = 0;
  for (const topic of TRAVEL_TOPICS) {
    let score = 0;
    for (const [k, weight] of Object.entries(topic.keys)) if (tokens.has(k) || tokens.has(stem(k))) score += weight;
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }
  return bestScore >= 3 ? best : null;
}
