import Abroad from "@/components/Abroad";
import ClinicSlider from "@/components/ClinicSlider";
import FreeGuide from "@/components/FreeGuide";
import Journey from "@/components/Journey";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import HelixBackground from "@/components/HelixBackground";
import Pricing from "@/components/Pricing";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import NavLinks, { CurrencyMenu } from "@/components/NavPills";
import ReadMorePgtmButton from "@/components/ReadMorePgtmButton";
import StartBookingButton from "@/components/StartBookingButton";
import Specialist from "@/components/Specialist";
import StepsStory from "@/components/StepsStory";
import StickyNav from "@/components/StickyNav";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    // Fades in, so arriving from the booking page is a soft change rather than a cut.
    <div data-page className="home-nohemi book-fade bg-bg font-sans text-muted">
      {/* The nav pill sits on the same grey as the hero, so the two read as one grey area. */}
      <StickyNav band>
        <Logo className="h-8 w-auto max-sm:h-7" />
        <NavLinks />
        <div className="flex items-center gap-2">
          <CurrencyMenu />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </StickyNav>

      {/* Hero: the words on the left, the DNA helix in a rounded dark card on the right. */}
      <section data-hero className="bg-band px-6 pt-16 pb-24 max-md:px-4 max-md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-12 max-[1024px]:grid-cols-1">
          <div className="flex flex-col items-start gap-6">
            <h1 className="m-0 font-heading text-fl-h1 leading-[1.05] font-semibold tracking-[-0.03em] text-ink">
              Your genotype shouldn&apos;t decide <span className="text-brand">who you marry.</span>
            </h1>
            <p className="m-0 max-w-115 text-fl-lead leading-[1.6] text-muted">AS + AS or AS + SS? IVF with embryo testing can prevent sickle cell. Book now, wherever you are.</p>
            <div className="flex flex-wrap gap-3">
              <StartBookingButton />
              <ReadMorePgtmButton />
            </div>
          </div>
          <div aria-hidden="true" className="relative aspect-5/4 overflow-hidden rounded-3xl bg-[#0a0d12]">
            <HelixBackground className="absolute inset-0 size-full" offsetX={0} />
          </div>
        </div>
      </section>

      <ClinicSlider />

      <Specialist />

      <StepsStory />

      <Pricing />

      <Journey />

      <Abroad />

      <FreeGuide />

      <Faq />

      <Footer />
    </div>
  );
}
