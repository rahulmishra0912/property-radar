import Link from "next/link";
import { withBasePath } from "@/lib/site";

export function BrandLogoImage({
  className = "h-12 w-auto",
  alt = "PropertyRadar",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath("/logo.png")}
      alt={alt}
      className={className}
    />
  );
}

const SAGE = "#8FA083";
const RADAR = "#7A8B96";

/** Faithful recreation of the house + incomplete radar arcs from public/logo.png */
export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 48 A30 30 0 1 1 62 18"
        stroke={RADAR}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M24 46 A22 22 0 1 1 58 22"
        stroke={RADAR}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M22 46 L40 26 L58 46 V64 H22 Z"
        stroke={SAGE}
        strokeWidth="4.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 56 L40 44 L48 56"
        stroke={SAGE}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandWordmark({
  className = "",
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={`leading-tight ${className}`}>
      <span className="block font-semibold tracking-tight text-ink">
        Property
        <span className="font-normal text-ink/70">Radar</span>
      </span>
      {showTagline ? (
        <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.18em] text-ink/55">
          Real estate due-diligence platform
        </span>
      ) : null}
    </span>
  );
}

export function BrandLockup({
  href = "/",
  showTagline = false,
  size = "md",
}: {
  href?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const mark =
    size === "lg" ? "h-14 w-14" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const type = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  const inner = (
    <span className="flex items-center gap-2.5">
      <BrandMark className={mark} />
      <BrandWordmark className={type} showTagline={showTagline} />
    </span>
  );
  if (!href) return inner;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="PropertyRadar home">
      {inner}
    </Link>
  );
}
