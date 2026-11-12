"use server";

// The booking site's server actions. The browser calls these; they call the IMSA website API with the API key, which never
// leaves the server (see src/lib/imsa/server.ts). Each action checks what it is given, never throws, and returns an
// ActionResult. The booking's bearer token is kept in an httpOnly cookie and is never returned to the page.
import { clearToken, ID_RE, imsa, invalid, limited, noToken, readToken, saveToken, UUID_RE } from "@/lib/imsa/server";
import type { ActionResult, ImsaConfig, PaymentStatus, Receipt, Slot } from "@/lib/imsa/types";

const MINUTE = 60_000;
const MAX_REPORT = 20 * 1024 * 1024; // 20 MiB, the API's limit for one report
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_Z_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const REFERENCE_RE = /^[A-Za-z0-9-]{1,40}$/;

type RawReceipt = Receipt & { continuationToken?: string };

// Takes the token out of a receipt (it goes into the cookie) and returns only what the page may see.
async function keepToken(r: RawReceipt): Promise<Receipt> {
  const { continuationToken, ...receipt } = r;
  if (continuationToken && ID_RE.test(receipt.registrationId)) await saveToken(receipt.registrationId, continuationToken);
  return receipt;
}

// ---- Configuration and slots -------------------------------------------------------------------

export async function getConfig(): Promise<ActionResult<ImsaConfig>> {
  const r = await imsa<ImsaConfig>("GET", "/web/imsa/config", { timeoutMs: 12_000 });
  if (!r.ok) return r;
  const c = r.data;
  // Only what the site uses is passed on.
  return {
    ok: true,
    data: {
      enabled: c.enabled,
      ready: c.ready,
      packageEnabled: c.packageEnabled,
      reportsAvailable: c.reportsAvailable,
      startDate: c.startDate,
      endDate: c.endDate,
      minLeadDays: c.minLeadDays,
      excludedWeekdays: c.excludedWeekdays,
      virtualFeeMinor: c.virtualFeeMinor,
      packages: c.packages,
      defaultPackageId: c.defaultPackageId,
      fullPackageFeeMinor: c.fullPackageFeeMinor,
      slotMinutes: c.slotMinutes,
      holdMinutes: c.holdMinutes,
      consentVersion: c.consentVersion,
      timeZone: c.timeZone,
    },
  };
}

/** Published, unheld consultation slots between two UTC instants (at most 93 days apart). */
export async function getSlots(from: string, to: string): Promise<ActionResult<{ items: Slot[]; timeZone: string }>> {
  if (!ISO_Z_RE.test(from) || !ISO_Z_RE.test(to) || Date.parse(to) <= Date.parse(from) || Date.parse(to) - Date.parse(from) > 93 * 24 * 60 * MINUTE)
    return invalid("Those dates aren't valid.");
  return imsa("GET", `/web/imsa/slots?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

// ---- Email verification ------------------------------------------------------------------------

export async function sendEmailCode(email: string): Promise<ActionResult<{ verificationId: string; expiresInSeconds: number }>> {
  const e = String(email ?? "").trim().toLowerCase();
  if (e.length > 254 || !EMAIL_RE.test(e)) return invalid("Please enter a valid email address.");
  const limit = await limited("send-code", 6, 15 * MINUTE);
  if (limit) return limit;
  return imsa("POST", "/web/imsa/email-verifications", { json: { email: e } });
}

export async function verifyEmailCode(verificationId: string, email: string, code: string): Promise<ActionResult<{ verificationId: string; verified: boolean }>> {
  const e = String(email ?? "").trim().toLowerCase();
  const c = String(code ?? "");
  if (!UUID_RE.test(verificationId) || !EMAIL_RE.test(e) || !/^\d{6}$/.test(c)) return invalid("Please enter the six digit code.");
  const limit = await limited("verify-code", 12, 15 * MINUTE);
  if (limit) return limit;
  // The code is sent as a string so a leading zero survives.
  return imsa("POST", `/web/imsa/email-verifications/${verificationId}/verify`, { json: { email: e, verificationCode: c } });
}

// ---- Registration ------------------------------------------------------------------------------

/**
 * Creates the booking. `form` carries `registration` (the JSON submission), `idempotencyKey` (a UUID, kept the same when the
 * same booking is retried) and, optionally, the `patientReport` and `partnerReport` files.
 */
export async function registerBooking(form: FormData): Promise<ActionResult<Receipt>> {
  const key = String(form.get("idempotencyKey") ?? "");
  const registration = form.get("registration");
  if (!UUID_RE.test(key) || typeof registration !== "string" || registration.length === 0) return invalid();

  const files: [string, File][] = [];
  for (const name of ["patientReport", "partnerReport"] as const) {
    const f = form.get(name);
    if (f instanceof File && f.size > 0) {
      if (f.size > MAX_REPORT) return { ok: false, status: 422, code: "FILE_TOO_LARGE", message: "A report is too large. Reports can be up to 20 MB each." };
      files.push([name, f]);
    }
  }
  if (registration.length > (files.length ? 32 * 1024 : 100 * 1024)) return invalid("That booking is too large.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(registration);
  } catch {
    return invalid();
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return invalid();

  const limit = await limited("register", 8, 60 * MINUTE);
  if (limit) return limit;

  let r;
  if (files.length) {
    const upstream = new FormData();
    upstream.append("registration", registration);
    for (const [name, f] of files) upstream.append(name, f, f.name);
    r = await imsa<RawReceipt>("POST", "/web/imsa/registrations", { form: upstream, idempotencyKey: key, timeoutMs: 90_000 });
  } else {
    r = await imsa<RawReceipt>("POST", "/web/imsa/registrations", { json: parsed, idempotencyKey: key });
  }
  if (!r.ok) return r;
  return { ok: true, data: await keepToken(r.data) };
}

/** Recovers a booking after its link was lost: needs the registration reference and a freshly verified email. */
export async function recoverBooking(reference: string, email: string, emailVerificationId: string): Promise<ActionResult<Receipt>> {
  const ref = String(reference ?? "").trim();
  const e = String(email ?? "").trim().toLowerCase();
  if (!REFERENCE_RE.test(ref) || !EMAIL_RE.test(e) || !UUID_RE.test(emailVerificationId)) return invalid("Please check your reference and email.");
  const limit = await limited("access", 8, 15 * MINUTE);
  if (limit) return limit;
  const r = await imsa<RawReceipt>("POST", "/web/imsa/registrations/access", { json: { reference: ref, email: e, emailVerificationId } });
  if (!r.ok) return r;
  return { ok: true, data: await keepToken(r.data) };
}

/** Takes the token from a booking link (the part after # in the email link) and keeps it in the cookie, after checking it works. */
export async function openBooking(registrationId: string, token: string): Promise<ActionResult<PaymentStatus>> {
  const t = String(token ?? "");
  if (!ID_RE.test(registrationId) || t.length < 10 || t.length > 4096 || /\s/.test(t)) return invalid("That booking link isn't valid.");
  const limit = await limited("open", 30, 15 * MINUTE);
  if (limit) return limit;
  const r = await imsa<PaymentStatus>("GET", `/web/imsa/registrations/${registrationId}/payment-status`, { token: t });
  if (!r.ok) return r;
  await saveToken(registrationId, t);
  return r;
}

// ---- Payment and status ------------------------------------------------------------------------

// A checkout link is only passed on when it is a plain https address.
function safeUrl(u: unknown): string | undefined {
  if (typeof u !== "string") return undefined;
  try {
    return new URL(u).protocol === "https:" ? u : undefined;
  } catch {
    return undefined;
  }
}

/** Starts (or resumes) the hosted checkout for the saved price. The amount always comes from the saved booking, never from the page. */
export async function startPayment(registrationId: string): Promise<ActionResult<PaymentStatus>> {
  if (!ID_RE.test(registrationId)) return invalid();
  const token = await readToken(registrationId);
  if (!token) return noToken();
  const limit = await limited("pay", 20, 15 * MINUTE);
  if (limit) return limit;
  const r = await imsa<PaymentStatus>("POST", `/web/imsa/registrations/${registrationId}/payment`, { token });
  if (!r.ok) {
    if (r.code === "AUTH_REQUIRED" || r.code === "INVALID_TOKEN") await clearToken(registrationId);
    return r;
  }
  const paymentUrl = safeUrl(r.data.paymentUrl);
  // A checkout link that isn't https is dropped, and a booking that still needs paying then can't continue from here.
  if (r.data.paymentUrl && !paymentUrl) return { ok: false, status: 502, code: "BAD_RESPONSE", message: "We couldn't open the payment page. Please try again or contact help@awadoc.com." };
  return { ok: true, data: { ...r.data, paymentUrl } };
}

export async function getPaymentStatus(registrationId: string): Promise<ActionResult<PaymentStatus>> {
  if (!ID_RE.test(registrationId)) return invalid();
  const token = await readToken(registrationId);
  if (!token) return noToken();
  const limit = await limited("status", 90, 15 * MINUTE);
  if (limit) return limit;
  const r = await imsa<PaymentStatus>("GET", `/web/imsa/registrations/${registrationId}/payment-status`, { token });
  if (!r.ok && (r.code === "AUTH_REQUIRED" || r.code === "INVALID_TOKEN")) await clearToken(registrationId);
  return r;
}

/** For a paid consultation that needs another slot: moves it to a new slot with no new payment. */
export async function chooseSlot(registrationId: string, slotId: string): Promise<ActionResult<PaymentStatus>> {
  if (!ID_RE.test(registrationId) || !ID_RE.test(slotId)) return invalid();
  const token = await readToken(registrationId);
  if (!token) return noToken();
  const limit = await limited("slot", 20, 15 * MINUTE);
  if (limit) return limit;
  return imsa<PaymentStatus>("PUT", `/web/imsa/registrations/${registrationId}/slot`, { token, json: { slotId } });
}
