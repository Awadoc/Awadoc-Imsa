// The shapes of the IMSA website API (contract revision 2026-11-11, see 30-IMSA_WEB_API.md). Money is always an integer in kobo
// (minor NGN units). Only these website endpoints are used; the admin endpoints are never called from this site.

export type Gender = "male" | "female";
export type ApiGenotype = "AA" | "AS" | "AC" | "SS" | "SC" | "CC" | "unknown" | "other";
export type PurchaseType = "virtual_consultation" | "full_package";

export interface PackageItem {
  id: string;
  name: string;
  priceMinor: number;
}

export interface PackageEntry {
  id: string;
  name: string;
  minAge: number | null;
  maxAge: number | null;
  items: PackageItem[];
  totalMinor: number;
}

/** GET /web/imsa/config: only the fields the site uses. */
export interface ImsaConfig {
  enabled: boolean;
  ready: boolean;
  packageEnabled: boolean;
  reportsAvailable: boolean;
  startDate: string; // YYYY-MM-DD (WAT), first allowed appointment day
  endDate: string;
  minLeadDays: number;
  excludedWeekdays: number[]; // 0 Sunday ... 6 Saturday
  virtualFeeMinor: number;
  packages: PackageEntry[];
  defaultPackageId: string;
  fullPackageFeeMinor: number;
  slotMinutes: number;
  holdMinutes: number;
  consentVersion: string;
  timeZone: string;
}

export interface Slot {
  slotId: string;
  startsAt: string; // UTC ISO
  endsAt: string;
}

export type PricingSource = "female_year_of_birth" | "patient" | "partner" | "default";

export interface PackageSelection {
  id: string;
  name: string;
  minAge: number | null;
  maxAge: number | null;
  pricingAge: number | null;
  /** Absent or null on bookings saved before this field existed: never guess it. */
  pricingSource?: PricingSource | null;
  pricingDate: string;
}

export interface Pricing {
  amountMinor: number;
  currency: "NGN";
  packageItems: PackageItem[];
  packageSelection: PackageSelection | null;
}

/** The receipt returned by registration and access recovery. The continuation token is NOT part of this: it stays on the server. */
export interface Receipt {
  registrationId: string;
  reference: string;
  status: string;
  createdAt: string;
  pricing: Pricing;
}

export type PaymentState = "pending" | "paid";
export type AppointmentStatus = "awaiting_payment" | "confirmed" | "awaiting_confirmation" | "scheduling_required" | "awaiting_scheduling";

/** The payment and status shape (payment POST, payment-status GET and the paid slot PUT). */
export interface PaymentStatus {
  invoiceId: string;
  pricing: Pricing;
  paymentStatus: PaymentState;
  appointmentStatus: AppointmentStatus;
  purchaseType: PurchaseType | "legacy_consultation";
  reconciliationRequired: boolean;
  slotId: string | null;
  holdExpiresAt: string | null;
  confirmedFor: string | null;
  preferredAt: string | null;
  timeZone: string;
  amountMinor: number;
  currency: string;
  paymentUrl?: string;
  reference?: string;
}

// ---- What the site submits ------------------------------------------------------------------

export interface SubmissionPerson {
  fullName: string;
  yearOfBirth: number | null;
  gender: Gender | null;
  genotype: ApiGenotype;
  genotypeOther: string | null;
}

export interface Submission {
  emailVerificationId: string;
  booker: { fullName: string; email: string; phoneNumber: string };
  applicationType: "self" | "dependent";
  dependentRelationship: "parent" | "guardian" | "other" | null;
  relationship: "single" | "married" | "engaged" | "planning_to_marry" | "other" | null;
  femaleYearOfBirth: null;
  patient: SubmissionPerson & {
    labResultsStatus: "tested" | "not_tested" | "not_sure" | null;
    priorIvf: boolean | null;
    childrenStatus: string | null;
  };
  partner: (Omit<SubmissionPerson, "fullName"> & { fullName: string | null; email: null; phoneNumber: null }) | null;
  location: { countryCode: string; region: string; city: string; addressLine: string; postalCode: string | null };
  booking: { purchaseType: "virtual_consultation"; slotId: string } | { purchaseType: "full_package"; preferredDate: string; preferredTime: string };
  consents: { healthDataProcessing: true; referralSharing: true; authorityToBook: true; version: string };
  preparation: null;
}

// ---- What the server actions return to the browser ------------------------------------------

export type ActionError = {
  ok: false;
  /** The API's error code (for example CONFLICT), or a site code: NOT_CONFIGURED, NETWORK, RATE_LIMITED, BAD_RESPONSE. */
  code: string;
  /** A message that is safe to show to the visitor. */
  message: string;
  status: number;
  /** Field level problems for a 422, keyed by the API's dot path (for example body.patient.yearOfBirth). */
  fields?: { path: string; message: string }[];
  /** Seconds to wait before trying again, when the API or our own limiter asked for it. */
  retryAfter?: number;
};

export type ActionResult<T> = { ok: true; data: T } | ActionError;
