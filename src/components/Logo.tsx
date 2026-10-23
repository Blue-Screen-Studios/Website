import { Link } from "react-router-dom";

// logo-mark.svg is a cat-head crop of logo.png; lighten blending hides its black background on navy.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img src="/logo-mark.svg" alt="" className="size-9 mix-blend-lighten" />
      <span className="text-[15px] font-semibold tracking-tight text-white">Blue Screen Studios</span>
    </Link>
  );
}
