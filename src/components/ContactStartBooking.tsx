"use client";

import { useRouter } from "next/navigation";
import { startBooking } from "@/lib/startBooking";

// "Start booking" as a plain link-style button: it does the same as the hero's Start booking button.
export default function ContactStartBooking({ className }: { className: string }) {
  const router = useRouter();
  return (
    <button type="button" onClick={() => void startBooking(router)} className={className}>
      Start booking
    </button>
  );
}
