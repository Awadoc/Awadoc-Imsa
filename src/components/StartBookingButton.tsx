"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startBooking } from "@/lib/startBooking";

// The hero's main button: a 48px brand green pill with a chevron. It brings up the AwaDoc loader while the booking options load, then opens /book.
export default function StartBookingButton() {
  const router = useRouter();
  return (
    <Link
      href="/book"
      onClick={(e) => {
        // A new tab or window (ctrl, cmd, shift, middle click) just opens the page.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        void startBooking(router);
      }}
      className="inline-flex h-12 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-brand px-5.5 text-fl-small font-semibold text-white no-underline transition-[background-color] duration-200 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 motion-reduce:transition-none"
    >
      Start booking
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
