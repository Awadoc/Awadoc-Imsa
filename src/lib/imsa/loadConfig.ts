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
    else setConfig(r.ok ? r.data : null, "unavailable");
    return r.ok ? r.data : null;
  } catch {
    setConfig(null, "unavailable");
    return null;
  }
}
