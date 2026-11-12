"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { leaveTo } from "@/lib/leaveTo";

// A round home button: a house in a circle, back to the home page. Same size as the sun / moon switch.
export default function HomeButton() {
  const router = useRouter();
  // Load the home page in the background, so it is ready when the button is pressed.
  useEffect(() => {
    router.prefetch("/");
  }, [router]);
  return (
    <Link
      href="/"
      onClick={(e) => {
        e.preventDefault();
        leaveTo(router, "/");
      }}
      aria-label="Back to the home page"
      className="grid size-11 place-items-center rounded-full border border-line bg-card text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
      </svg>
    </Link>
  );
}
