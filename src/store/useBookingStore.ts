import { create } from "zustand";
import type { ImsaConfig, PaymentStatus, Receipt } from "@/lib/imsa/types";

export type Genotype = "AS" | "AC" | "SS" | "SC" | "?";
/** The two things the booking service sells: a virtual consultation in a published slot, or the full package. */
export type Product = "virtual" | "package";

export const TOTAL_STEPS = 10;

/** The email check: a code is sent, then entered. `id` is the verification the API gave us. */
export interface EmailProof {
  /** The email address the code was sent to. */
  email: string;
  /** Set once a code has been sent. */
  id: string;
  sentAt: number;
  /** Set once the code was accepted. The proof then lasts 15 minutes. */
  verifiedAt: number | null;
}

export const PROOF_MS = 15 * 60 * 1000;

export interface BookingData {
  // Who the booking is for: yourself, or someone else (a dependent) whose care you arrange
  who: "self" | "dependent";
  dependentRel: string;
  patientFirst: string;
  patientLast: string;
  // You (the patient and the booker)
  first1: string;
  last1: string;
  email: string;
  dial: string;
  phone: string;
  relationship: string;
  gender1: string;
  yob1: string;
  geno1: Genotype | "";
  lab: string;
  ivf: string;
  children: string;
  // Your partner
  first2: string;
  last2: string;
  gender2: string;
  yob2: string;
  geno2: Genotype | "";
  // Where you live
  country: string;
  state: string;
  street: string;
  city: string;
  postal: string;
  // What you are booking
  product: Product | "";
  slotId: string; // the chosen consultation slot
  slotStartsAt: string; // that slot's start (UTC), to show it back
  date: string; // package preference, YYYY-MM-DD (WAT)
  hour: number | null; // 1-12
  ampm: "AM" | "PM";
  minute: 0 | 30;
  consentCare: boolean;
  consentShare: boolean;
  consentAuthority: boolean;
  // Optional genotype reports
  report1: File | null;
  report2: File | null;
}

const EMPTY: BookingData = {
  who: "self",
  dependentRel: "",
  patientFirst: "",
  patientLast: "",
  first1: "",
  last1: "",
  email: "",
  dial: "+234",
  phone: "",
  relationship: "",
  gender1: "",
  yob1: "",
  geno1: "",
  lab: "",
  ivf: "",
  children: "None",
  first2: "",
  last2: "",
  gender2: "",
  yob2: "",
  geno2: "",
  country: "",
  state: "",
  street: "",
  city: "",
  postal: "",
  product: "",
  slotId: "",
  slotStartsAt: "",
  date: "",
  hour: null,
  ampm: "AM",
  minute: 0,
  consentCare: false,
  consentShare: false,
  consentAuthority: false,
  report1: null,
  report2: null,
};

interface BookingState {
  step: number; // 1..10, 11 = finished
  /** Which way the last step change went, so the page slides in from the right side. */
  dir: "forward" | "back";
  data: BookingData;
  /** The service's settings: null until loaded. */
  config: ImsaConfig | null;
  configState: "loading" | "ready" | "unavailable";
  proof: EmailProof | null;
  /** One key per logical booking submission, so a retry after a lost answer never creates a second booking. */
  idem: { key: string; fingerprint: string } | null;
  /** The saved booking (and its authoritative price) once it has been created. */
  receipt: Receipt | null;
  payment: PaymentStatus | null;
  set: (patch: Partial<BookingData>) => void;
  setConfig: (config: ImsaConfig | null, state: "ready" | "unavailable") => void;
  setProof: (proof: EmailProof | null) => void;
  setIdem: (idem: { key: string; fingerprint: string } | null) => void;
  setReceipt: (receipt: Receipt | null) => void;
  setPayment: (payment: PaymentStatus | null) => void;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  dir: "forward",
  data: EMPTY,
  config: null,
  configState: "loading",
  proof: null,
  idem: null,
  receipt: null,
  payment: null,
  set: (patch) =>
    set((s) => {
      const data = { ...s.data, ...patch };
      // A different email address needs a new verification.
      const proof = s.proof && patch.email !== undefined && patch.email.trim().toLowerCase() !== s.proof.email ? null : s.proof;
      return { data, proof };
    }),
  setConfig: (config, state) => set({ config, configState: state }),
  setProof: (proof) => set({ proof }),
  setIdem: (idem) => set({ idem }),
  setReceipt: (receipt) => set({ receipt }),
  setPayment: (payment) => set({ payment }),
  next: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS + 1), dir: "forward" })),
  back: () => set((s) => ({ step: Math.max(s.step - 1, 1), dir: "back" })),
  goTo: (step) => set((s) => ({ step, dir: step < s.step ? "back" : "forward" })),
  reset: () => set({ step: 1, dir: "forward", data: EMPTY, proof: null, idem: null, receipt: null, payment: null }),
}));

/** True while the email proof is still good: the code was accepted, and less than 15 minutes ago. */
export const proofIsFresh = (proof: EmailProof | null, email: string) =>
  !!proof && proof.verifiedAt !== null && proof.email === email.trim().toLowerCase() && Date.now() - proof.verifiedAt < PROOF_MS;
