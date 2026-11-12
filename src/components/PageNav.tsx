import Link from "next/link";
import HomeButton from "@/components/HomeButton";
import Logo from "@/components/Logo";
import NavLinks from "@/components/NavPills";
import StickyNav from "@/components/StickyNav";
import ThemeToggle from "@/components/ThemeToggle";

// The nav on the inner pages (Contact, Donate and the legal pages): the same floating pill as the home page, with the logo, the three links, a home
// button and the theme switch. It sits on the grey band (`band`), so the pill and the grey top of the page read as one area.
export default function PageNav({ spacer = true }: { spacer?: boolean }) {
  return (
    <StickyNav band spacer={spacer}>
      <Link href="/" aria-label="AwaDoc home">
        <Logo className="h-8 w-auto max-sm:h-7" />
      </Link>
      <NavLinks faqHref="/#faq" />
      <div className="flex items-center gap-2">
        <HomeButton />
        <ThemeToggle />
      </div>
    </StickyNav>
  );
}
