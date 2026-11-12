"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import NouraChat from "@/components/NouraChat";
import { useNouraStore } from "@/store/useNouraStore";

// Floating "Ask Noura" pill, pinned to the bottom-right corner. Opens the chat.
export default function AskNoura() {
  const { open, openChat } = useNouraStore();
  // On the booking page the pill would cover the Continue button on a phone, so it is hidden there (it stays on wider screens).
  const onBooking = usePathname().startsWith("/book");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Give focus back to the pill when the chat closes.
  useEffect(() => {
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Ask Noura"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openChat}
        className={`${onBooking ? "max-sm:hidden" : ""} right-6 max-sm:right-4 fixed bottom-6 max-sm:bottom-4 z-20 inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-full border border-line bg-card pr-5 pl-2 text-[15px] font-semibold text-ink shadow-[0_8px_24px_rgba(16,24,40,0.12)] transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(16,24,40,0.18)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500`}
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-tint">
          <Image src="/noura-logo.png" alt="" width={828} height={754} className="h-[56%] w-auto" />
        </span>
        Ask Noura
      </button>

      <NouraChat />
    </>
  );
}
