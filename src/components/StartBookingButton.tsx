"use client";

import { useInProgressStore } from "@/store/useInProgressStore";

// The hero's main button. For now it opens the "booking is in progress" notice; the booking page is at /book.
export default function StartBookingButton() {
  const show = useInProgressStore((s) => s.show);
  return (
    <button
      type="button"
      onClick={show}
      aria-haspopup="dialog"
      className="inline-flex min-h-btn cursor-pointer whitespace-nowrap items-center rounded-[calc(14*var(--u))] border border-ink bg-ink px-[1.4em] py-[0.7em] text-btn font-bold text-bg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-[#07110c] hover:shadow-[0_10px_28px_-8px_var(--color-brand)] active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
    >
      Start booking
    </button>
  );
}
