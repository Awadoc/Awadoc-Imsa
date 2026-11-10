import ClinicSlider from "@/components/ClinicSlider";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import HelixBackground from "@/components/HelixBackground";
import Pricing from "@/components/Pricing";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import NavPills from "@/components/NavPills";
import ReadMorePgtmButton from "@/components/ReadMorePgtmButton";
import StartBookingButton from "@/components/StartBookingButton";
import Specialist from "@/components/Specialist";
import StepsStory from "@/components/StepsStory";
import StickyNav from "@/components/StickyNav";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    // Fades in, so arriving from the booking page is a soft change rather than a cut.
    <div data-page className="book-fade">
      {/* The helix is pinned to the screen behind the hero and the slider box: it carries on down behind the
          glass box and scrolls away with it. */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-clip [-webkit-mask-image:linear-gradient(to_bottom,#000_calc(100%-12rem),transparent)] [mask-image:linear-gradient(to_bottom,#000_calc(100%-12rem),transparent)]"
        >
          <div className="sticky top-0 h-lvh">
            <HelixBackground className="helix-bg" />
          </div>
        </div>

        {/* min-h (not h): on very short screens the page grows and scrolls instead of clipping. */}
        <main data-hero className="relative flex min-h-svh flex-col">
          {/* Logo left, pills dead center, theme switch right. Always one row: on small screens
              the logo, links and switch just get smaller instead of wrapping. */}
          <StickyNav>
            <Logo className="h-8 w-auto max-sm:h-6" />
            {/* Below 500px the links fold into the menu button on the right. */}
            <div className="hidden justify-self-center min-[500px]:block">
              <NavPills />
            </div>
            <div className="flex items-center gap-[calc(8*var(--u))] col-start-3 justify-self-end">
              <ThemeToggle />
              <MobileMenu />
            </div>
          </StickyNav>

          {/* Fills the rest of the screen below the nav and centers the copy in it, on every device, so
              the gap above the hero (from the nav) equals the gap below it. */}
          <div className="gutter relative z-10 flex flex-1 items-center py-6">
            {/* w-fit makes this block exactly as wide as "who you marry." at every screen size: line one is
                zero-width and overflows, and the paragraph and buttons fill the block, so the subtext
                never goes past "marry.". Below 780px line one breaks after "genotype". */}
            <div className="w-fit">
              <h1 className="mb-[0.35em] text-display font-heading font-medium [-webkit-text-stroke:0.015em_currentColor] leading-[1.05] tracking-normal">
                <span className="block w-0 whitespace-nowrap">
                  Your genotype{" "}
                  <br className="min-[780px]:hidden" />
                  shouldn&apos;t decide
                </span>
                <span className="block text-brand">who you marry.</span>
              </h1>
              <p className="mb-8 w-0 min-w-full text-hero-sub font-medium leading-relaxed tracking-[-0.035em] text-muted hero-sub">
                AS + AS or AS + SS? IVF with embryo testing can prevent sickle cell. Book now, wherever you are.
              </p>
              <div className="flex w-0 min-w-full flex-wrap gap-3 md:flex-nowrap">
                <StartBookingButton />
                <ReadMorePgtmButton />
              </div>
            </div>
          </div>
        </main>

        <ClinicSlider />

      </div>

      <Specialist />

      <StepsStory />

      <Pricing />

      <Faq />


      <Footer />
    </div>
  );
}
