import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import AskNoura from "@/components/AskNoura";
import ScreenLoader from "@/components/ScreenLoader";
import "./globals.css";

// The new design: Inter for text, Inter Tight for headings, buttons' numerals and the wordmark.
const inter = Inter({
  subsets: ["latin", "latin-ext"], // latin-ext carries the naira sign (₦)
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Nohemi: the home page's headings.
const nohemi = localFont({
  src: [
    { path: "../fonts/Nohemi-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Nohemi-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-nohemi",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

// Real device width on phones, and respect notches / rounded corners.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "AwaDoc Genomics",
  description: "AwaDoc Genomics helps couples who carry the sickle cell gene have children free of the disease.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${nohemi.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="font-sans">
        {/* Sets the theme before the first paint: light every time someone lands (a new visit or a refresh). A choice made with the switch only lasts while they move around the site. Also sends a refresh back to the top. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "try{var nv=performance.getEntriesByType('navigation')[0];if(nv&&nv.type==='reload')sessionStorage.removeItem('theme');var t=sessionStorage.getItem('theme');if(t!=='light'&&t!=='dark')t='light';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}" +
              // A refresh lands on the page again: back at the top (the hero), not where you had scrolled to. The browser and the
              // page restore the old position a little after load, so keep returning to the top until the visitor scrolls themselves.
              ";try{var n=performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload'){history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);var go=true,stop=function(){go=false};['wheel','touchstart','keydown','mousedown'].forEach(function(e){addEventListener(e,stop,{passive:true,once:true})});var toTop=function(){if(go&&scrollY!==0)scrollTo({top:0,left:0,behavior:'instant'})};toTop();var i=setInterval(toTop,50);setTimeout(function(){clearInterval(i)},2500)}}catch(e){}",
          }}
        />
        {children}
        {/* Outside any page wrapper so it stays pinned to the viewport on every page. */}
        <AskNoura />
        <ScreenLoader />
        <CookieBanner />
      </body>
    </html>
  );
}
