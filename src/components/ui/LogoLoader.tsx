import Image from "next/image";
import "./logo-loader.css";

// The loader used everywhere in the app: the AwaDoc icon breathing in and out.
// `dark` darkens the icon for use on a light (lime) button tile.
export default function LogoLoader({ size = 72, dark = false, label = "Loading" }: { size?: number; dark?: boolean; label?: string }) {
  return (
    <span className="logo-loader-wrap" role="status" aria-label={label}>
      <Image className={`logo-loader ${dark ? "dark" : ""}`} src="/FaviconIcon.png" alt="" width={size} height={size} priority />
    </span>
  );
}
