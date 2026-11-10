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
      className="inline-flex min-h-btn cursor-pointer whitespace-nowrap items-center rounded-[calc(14*var(--u))] border border-ink/30 bg-ink/25 backdrop-blur-md px-[1.4em] py-[0.7em] text-btn font-bold text-ink md:border-ink md:bg-transparent md:backdrop-blur-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-[#07110c] md:hover:border-brand md:hover:bg-brand md:hover:text-[#07110c] hover:shadow-[0_10px_28px_-8px_var(--color-brand)] active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
    >
      Learn more about PGT-M
    </Link>
  );
}
