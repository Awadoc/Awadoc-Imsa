"use client";

import type { useRouter } from "next/navigation";
import { loadBookingConfig } from "@/lib/imsa/loadConfig";
import { useBookingStore } from "@/store/useBookingStore";
import { useLoaderStore } from "@/store/useLoaderStore";

// Every "Start booking" button does this: the AwaDoc loader covers the screen, the booking options are read, and only then the booking page opens,
// already filled in. The loader stays up for at least a moment so it never just flashes.
export async function startBooking(router: ReturnType<typeof useRouter>) {
  const { show } = useLoaderStore.getState();
  show();
  const started = Date.now();
  if (useBookingStore.getState().configState !== "ready") await loadBookingConfig();
  const wait = Math.max(0, 700 - (Date.now() - started));
  if (wait) await new Promise((r) => setTimeout(r, wait));
  router.push("/book");
}
