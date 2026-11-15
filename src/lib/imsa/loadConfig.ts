"use client";

import { getConfig } from "@/app/actions/imsa";
import type { ImsaConfig } from "@/lib/imsa/types";
import { useBookingStore } from "@/store/useBookingStore";

/** Reads the booking options from the server into the booking store. Never throws and never hangs: a failure marks the booking as unavailable. */
export async function loadBookingConfig(): Promise<ImsaConfig | null> {
  const { setConfig } = useBookingStore.getState();
  try {
    const r = await getConfig();
    if (r.ok && r.data.enabled && r.data.ready) setConfig(r.data, "ready");
    else setConfig(r.ok ? r.data : null, "unavailable", r.ok ? (r.data.enabled ? "NOT_READY" : "BOOKING_DISABLED") : `${r.code}-${r.status}`);
    return r.ok ? r.data : null;
  } catch {
    // The server action itself failed to run (for example the deployed server is missing its settings or the action could not be reached).
    setConfig(null, "unavailable", "ACTION_FAILED");
    return null;
  }
}
