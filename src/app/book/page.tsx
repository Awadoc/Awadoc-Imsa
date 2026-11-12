import type { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";

export const metadata: Metadata = {
  title: "Book | AwaDoc Genomics",
  description: "Book a virtual consultation or the full treatment package for your couple, in ten steps.",
};

export default function BookPage() {
  return <BookingFlow />;
}
