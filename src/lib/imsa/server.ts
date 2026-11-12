// Server only. Everything that talks to the IMSA website API goes through here, and only the server actions in
// src/app/actions/imsa.ts import it. The API address and the website key come from environment variables that have
// no NEXT_PUBLIC_ prefix, so they are never sent to the browser:
//   IMSA_API_URL      the HTTPS origin of the core API, without a trailing slash
//   IMSA_WEB_API_KEY  the website server key (sent as the x-web-api-key header)
import { cookies, headers } from "next/headers";
import type { ActionError, ActionResult } from "@/lib/imsa/types";

const BASE = (process.env.IMSA_API_URL ?? "").trim().replace(/\/+$/, "");
const KEY = (process.env.IMSA_WEB_API_KEY ?? "").trim();

export const ID_RE = /^[a-f0-9]{24}$/;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(status: number, code: string, message: string, extra: Partial<ActionError> = {}): ActionError {
  return { ok: false, status, code, message, ...extra };
}

export const invalid = (message = "Something in this request isn't right. Please check it and try again.") => fail(400, "VALIDATION_ERROR", message);

// What the visitor sees for the codes the guide lists (section 6.1). Anything else keeps the API's own message.
const FRIENDLY: Record<string, string> = {
  MISSING_API_KEY: "Booking is temporarily unavailable. Please try again later.",
  INVALID_API_KEY: "Booking is temporarily unavailable. Please try again later.",
  AUTH_REQUIRED: "Your booking link has expired. Please recover your booking with your reference and email.",
  INVALID_TOKEN: "Your booking link has expired. Please recover your booking with your reference and email.",
  IMSA_REGISTRATION_NOT_FOUND: "We couldn't find that booking. Please check your reference and email.",
  EMAIL_NOT_VERIFIED: "Please verify your email again to continue.",
  EMAIL_CODE_INVALID: "That code isn't right, or it has expired. Please check it or ask for a new one.",
  RESEND_TOO_SOON: "Please wait a minute before asking for another code.",
  RATE_LIMIT_EXCEEDED: "Too many attempts. Please wait a moment and try again.",
  PROVIDER_ERROR: "We couldn't confirm the payment with our payment partner. Please check your booking status before trying again.",
  IMSA_INTAKE_UNAVAILABLE: "Booking isn't available right now. Please try again later.",
  PAYLOAD_TOO_LARGE: "That request was too large.",
  FILE_TOO_LARGE: "A report is too large. Reports can be up to 20 MB each.",
  UNSUPPORTED_FILE_TYPE: "That file type isn't supported. Use a PDF or an image (JPEG, PNG, GIF, WebP or HEIC).",
  INTERNAL_ERROR: "Something went wrong on our side. Please try again in a moment.",
};

// A small in memory limiter per visitor IP. The core limits per calling server, so it can't tell visitors apart; this
// stops one visitor from using up everyone's allowance. It resets when the server restarts and isn't shared between
// server instances, so it is a first line of defence rather than a guarantee.
const hits = new Map<string, number[]>();

export async function visitorId(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || h.get("x-real-ip") || "unknown";
}

export async function limited(bucket: string, max: number, windowMs: number): Promise<ActionError | null> {
  const key = `${bucket}:${await visitorId()}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    return fail(429, "RATE_LIMITED", "Too many attempts. Please wait a few minutes and try again.", { retryAfter });
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing forever.
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return null;
}

interface Options {
  token?: string;
  json?: unknown;
  form?: FormData;
  idempotencyKey?: string;
  timeoutMs?: number;
}

/** One call to the IMSA website API. Never throws: every failure comes back as an ActionError. */
export async function imsa<T>(method: "GET" | "POST" | "PUT", path: string, opts: Options = {}): Promise<ActionResult<T>> {
  if (!BASE || !KEY) {
    console.error("[imsa] IMSA_API_URL or IMSA_WEB_API_KEY is not set");
    return fail(503, "NOT_CONFIGURED", "Booking isn't available right now. Please try again later.");
  }

  const h: Record<string, string> = { "x-web-api-key": KEY, Accept: "application/json" };
  if (opts.token) h.Authorization = `Bearer ${opts.token}`;
  if (opts.idempotencyKey) h["Idempotency-Key"] = opts.idempotencyKey;
  let body: BodyInit | undefined;
  if (opts.form) body = opts.form; // the HTTP library sets the multipart boundary itself
  else if (opts.json !== undefined) {
    h["Content-Type"] = "application/json";
    body = JSON.stringify(opts.json);
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers: h, body, cache: "no-store", signal: AbortSignal.timeout(opts.timeoutMs ?? 30_000) });
  } catch (e) {
    console.error(`[imsa] ${method} ${path.split("?")[0]} network error`, e instanceof Error ? e.name : "unknown");
    return fail(503, "NETWORK", "We couldn't reach the booking service. Please check your connection and try again.");
  }

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    // Not JSON (for example a gateway error page).
  }
  const p = (payload && typeof payload === "object" ? payload : {}) as {
    success?: boolean;
    message?: string;
    data?: unknown;
    error?: { code?: string; details?: unknown };
  };

  if (!res.ok || p.success === false) {
    const code = p.error?.code ?? (res.status === 429 ? "RATE_LIMIT_EXCEEDED" : "ERROR");
    const retry = Number(res.headers.get("Retry-After"));
    if (res.status >= 500 || res.status === 401) console.error(`[imsa] ${method} ${path.split("?")[0]} -> ${res.status} ${code}`);
    // `details` is a list of { path, message } for a validation error; for other errors it may be missing or another shape, so only a list is used.
    const details = Array.isArray(p.error?.details) ? (p.error.details as { path?: unknown; message?: unknown }[]) : [];
    const fields = details.filter((d) => d && d.path && d.message).map((d) => ({ path: String(d.path), message: String(d.message) }));
    return fail(res.status, code, FRIENDLY[code] ?? (p.message && res.status < 500 ? p.message : "Something went wrong. Please try again."), {
      fields: fields.length ? fields : undefined,
      retryAfter: Number.isFinite(retry) && retry > 0 ? retry : undefined,
    });
  }

  if (p.data === undefined) return fail(502, "BAD_RESPONSE", "We got an unexpected answer from the booking service. Please try again.");
  return { ok: true, data: p.data as T };
}

// ---- The booking's continuation token ----------------------------------------------------------
// It lasts seven days. It is kept in an httpOnly cookie (one per registration) so page scripts can never read it; the
// server actions read it back and send it as the bearer token.

const cookieName = (id: string) => `imsa_t_${id}`;

export async function saveToken(registrationId: string, token: string) {
  (await cookies()).set(cookieName(registrationId), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function readToken(registrationId: string): Promise<string | null> {
  return (await cookies()).get(cookieName(registrationId))?.value ?? null;
}

export async function clearToken(registrationId: string) {
  (await cookies()).delete(cookieName(registrationId));
}

export const noToken = (): ActionError => fail(401, "AUTH_REQUIRED", FRIENDLY.AUTH_REQUIRED);
