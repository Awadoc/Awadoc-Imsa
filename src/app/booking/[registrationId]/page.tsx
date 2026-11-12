import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingStatus from "@/components/BookingStatus";

// The page the emails link to: https://genomics.awadoc.com/booking/<registrationId>#token=<continuationToken>.
// The token is after the # sign, so the browser never sends it to the server in the page request.
export const metadata: Metadata = {
  title: "Your booking | AwaDoc Genomics",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function BookingPage({ params }: { params: Promise<{ registrationId: string }> }) {
  const { registrationId } = await params;
  // Booking IDs are 24 hexadecimal characters.
  if (!/^[a-f0-9]{24}$/.test(registrationId)) notFound();
  return <BookingStatus registrationId={registrationId} />;
}
