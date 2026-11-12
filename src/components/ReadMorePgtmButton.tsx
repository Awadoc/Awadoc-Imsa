"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { leaveTo } from "@/lib/leaveTo";

// Sits beside "Start booking" in the hero: fades out and opens the PGT-M review article.
export default function ReadMorePgtmButton() {
  const router = useRouter();
  return (
    <Link
      href="/pgtm"
      onClick={(e) => {
        e.preventDefault();
        leaveTo(router, "/pgtm");
      }}
      className="inline-flex h-12 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#d0d5dd] bg-card px-5.5 text-fl-small font-semibold text-ink transition-[border-color] duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 motion-reduce:transition-none in-data-[theme=dark]:border-line"
    >
      Learn more about PGT-M
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
