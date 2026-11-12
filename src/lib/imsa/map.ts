// Client safe helpers for the booking form: what the form's choices become in the API, dates in West Africa Time, and the
// submission that is sent. Nothing secret lives here.
import type { ApiGenotype, Gender, Submission } from "@/lib/imsa/types";
import type { BookingData, Genotype } from "@/store/useBookingStore";

export const TIME_ZONE = "Africa/Lagos";

// ---- The form's choices -----------------------------------------------------------------------

export const RELATIONSHIPS = ["Married", "Engaged", "Planning to marry", "Other"] as const;
const RELATIONSHIP_API: Record<string, NonNullable<Submission["relationship"]>> = {
  Married: "married",
  Engaged: "engaged",
  "Planning to marry": "planning_to_marry",
  Other: "other",
};

export const GENDERS = ["Male", "Female"] as const;
// The API only knows parent, guardian and other, so Spouse and Partner are sent as "other".
export const DEPENDENT_RELATIONSHIPS = ["Parent", "Guardian", "Spouse", "Partner", "Other"] as const;
const DEPENDENT_API: Record<string, "parent" | "guardian" | "other"> = { Parent: "parent", Guardian: "guardian", Spouse: "other", Partner: "other", Other: "other" };
export const LAB_OPTIONS = ["Yes, I have a lab report", "No, not yet", "Not sure"] as const;
const LAB_API: Record<string, "tested" | "not_tested" | "not_sure"> = {
  "Yes, I have a lab report": "tested",
  "No, not yet": "not_tested",
  "Not sure": "not_sure",
};
export const IVF_OPTIONS = ["No, never", "Yes, once", "Yes, more than once"] as const;
export const CHILDREN = ["None", "1", "2", "3 or more"] as const;

const GENOTYPE_API: Record<Genotype, ApiGenotype> = { AS: "AS", AC: "AC", SS: "SS", SC: "SC", "?": "unknown" };

/** Two letter country codes for the countries on offer (the API wants an uppercase ISO code). */
export const COUNTRY_CODES: Record<string, string> = {
  Nigeria: "NG", Ghana: "GH", Kenya: "KE", "South Africa": "ZA", Cameroon: "CM", Senegal: "SN", Egypt: "EG", Ethiopia: "ET",
  Uganda: "UG", Tanzania: "TZ", Rwanda: "RW", "Côte d'Ivoire": "CI", Benin: "BJ", Togo: "TG", "Sierra Leone": "SL", Liberia: "LR",
  Gambia: "GM", Zambia: "ZM", Zimbabwe: "ZW", Morocco: "MA", "United Kingdom": "GB", Ireland: "IE", "United States": "US", Canada: "CA",
  "United Arab Emirates": "AE", "Saudi Arabia": "SA", Qatar: "QA", Germany: "DE", France: "FR", Netherlands: "NL", Belgium: "BE",
  Spain: "ES", Italy: "IT", Portugal: "PT", Sweden: "SE", Norway: "NO", Denmark: "DK", Switzerland: "CH", Australia: "AU",
  "New Zealand": "NZ", India: "IN", China: "CN", Brazil: "BR", Jamaica: "JM",
};
export const COUNTRIES = Object.keys(COUNTRY_CODES);

// ---- Dates and times (West Africa Time, never the browser's zone) -----------------------------

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, ...opts });

/** Today in WAT as YYYY-MM-DD. */
export function watToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** The current year in WAT (supplied birth years may not be later than this). */
export const watYear = () => Number(watToday().slice(0, 4));

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 Sunday ... 6 Saturday, for a YYYY-MM-DD day. */
export const weekdayOf = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay();

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Thursday 10 December" for a YYYY-MM-DD day. */
export function dayLabel(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${WEEKDAYS[weekdayOf(iso)]} ${d} ${MONTHS[m - 1]}`;
}

/** The WAT day (YYYY-MM-DD) and the clock time ("10:00 AM") of a UTC instant. */
export function watParts(isoUtc: string): { day: string; time: string } {
  const d = new Date(isoUtc);
  return {
    day: watToday(d),
    time: fmt({ hour: "numeric", minute: "2-digit", hour12: true }).format(d).toUpperCase(),
  };
}

/** "Thursday 10 December, 10:00 AM (West Africa Time)". */
export const watLabel = (isoUtc: string) => {
  const { day, time } = watParts(isoUtc);
  return `${dayLabel(day)}, ${time} (West Africa Time)`;
};

/** The chosen half hour in the form (1 to 12, AM or PM) as the API's 24 hour HH:mm. */
export function to24h(hour: number, minute: number, ampm: "AM" | "PM"): string {
  const h = (hour % 12) + (ampm === "PM" ? 12 : 0);
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** Years of birth on offer: everyone must be at least 18 (the service is for adults). Newest first. */
export function birthYears(): string[] {
  const latest = watYear() - 18;
  return Array.from({ length: 63 }, (_, i) => String(latest - i));
}

// ---- Small helpers ---------------------------------------------------------------------------

export const fullName = (first: string, last: string) => `${first.trim()} ${last.trim()}`.replace(/\s+/g, " ").trim();

/** "+234" and "0803 000 0000" become "+2348030000000". Leading zeros are the local trunk prefix, so they are dropped. */
export function internationalPhone(dial: string, phone: string): string {
  return `${dial.trim()}${phone.replace(/\D/g, "").replace(/^0+/, "")}`;
}

const asGender = (g: string): Gender | null => (g === "Female" ? "female" : g === "Male" ? "male" : null);

/** The submission for a booking. `verificationId` and `consentVersion` come from the verified email and the current config. */
export function buildSubmission(d: BookingData, verificationId: string, consentVersion: string): Submission {
  const booking: Submission["booking"] =
    d.product === "virtual"
      ? { purchaseType: "virtual_consultation", slotId: d.slotId }
      : { purchaseType: "full_package", preferredDate: d.date, preferredTime: to24h(d.hour ?? 0, d.minute, d.ampm) };
  const name = fullName(d.first1, d.last1);
  const dependent = d.who === "dependent";
  const patientName = dependent ? fullName(d.patientFirst, d.patientLast) : name;
  const hasPartner = !dependent;
  return {
    emailVerificationId: verificationId,
    booker: { fullName: name, email: d.email.trim().toLowerCase(), phoneNumber: internationalPhone(d.dial, d.phone) },
    applicationType: dependent ? "dependent" : "self",
    dependentRelationship: dependent ? (DEPENDENT_API[d.dependentRel] ?? "other") : null,
    relationship: dependent ? null : (RELATIONSHIP_API[d.relationship] ?? null),
    femaleYearOfBirth: null,
    patient: {
      fullName: patientName,
      yearOfBirth: d.yob1 ? Number(d.yob1) : null,
      gender: asGender(d.gender1),
      genotype: d.geno1 ? GENOTYPE_API[d.geno1] : "unknown",
      genotypeOther: null,
      labResultsStatus: LAB_API[d.lab] ?? null,
      priorIvf: !dependent && d.ivf ? d.ivf !== "No, never" : null,
      childrenStatus: !dependent ? d.children || null : null,
    },
    partner: !hasPartner ? null : {
      fullName: fullName(d.first2, d.last2) || null,
      yearOfBirth: d.yob2 ? Number(d.yob2) : null,
      gender: asGender(d.gender2),
      genotype: d.geno2 ? GENOTYPE_API[d.geno2] : "unknown",
      genotypeOther: null,
      email: null,
      phoneNumber: null,
    },
    location: {
      countryCode: COUNTRY_CODES[d.country] ?? "",
      region: d.state.trim(),
      city: d.city.trim(),
      addressLine: d.street.trim(),
      postalCode: d.postal.trim() || null,
    },
    booking,
    consents: { healthDataProcessing: true, referralSharing: true, authorityToBook: true, version: consentVersion },
    preparation: null,
  };
}

/** The API's human message for a field path such as "body.patient.yearOfBirth", used to point at what to fix. */
export const FIELD_LABELS: Record<string, string> = {
  "booker.fullName": "your name",
  "booker.phoneNumber": "your WhatsApp number",
  "booker.email": "your email",
  "patient.fullName": "the patient's name",
  "patient.yearOfBirth": "your year of birth",
  "patient.gender": "your gender",
  "patient.genotype": "your genotype",
  "partner.fullName": "your partner's name",
  "partner.yearOfBirth": "your partner's year of birth",
  "partner.gender": "your partner's gender",
  "partner.genotype": "your partner's genotype",
  "location.countryCode": "your country",
  "location.region": "your state or region",
  "location.city": "your city",
  "location.addressLine": "your street address",
  "location.postalCode": "your postal code",
  "booking.slotId": "your appointment time",
  "booking.preferredDate": "your preferred date",
  "booking.preferredTime": "your preferred time",
};
