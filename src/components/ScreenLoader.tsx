"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LogoLoader from "@/components/ui/LogoLoader";
import { useLoaderStore } from "@/store/useLoaderStore";

// The full screen AwaDoc loader. It lives in the root layout, so it stays up while the page underneath changes: "Start booking" turns it on, the
// booking page turns it off once its options are in. It covers the whole screen with the pulsing icon, then fades away instead of cutting.
export default function ScreenLoader() {
  const visible = useLoaderStore((s) => s.visible);
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setLeaving(false);
      return;
    }
    if (!mounted) return;
    setLeaving(true);
    const t = setTimeout(() => setMounted(false), 420);
    return () => clearTimeout(t);
  }, [visible, mounted]);

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(
    <div className={`screen-loader${leaving ? " leaving" : ""}`}>
      <LogoLoader size={88} label="Loading" />
    </div>,
    document.body,
  );
}
