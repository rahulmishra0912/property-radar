import Link from "next/link";
import Image from "next/image";
import { BrandMark } from "@/components/BrandLogo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="inline-flex min-w-0 items-center" aria-label="PropertyRadar home">
          <Image
            src="/logo.png"
            alt="PropertyRadar"
            width={974}
            height={284}
            priority
            className="h-11 w-auto max-w-[min(100%,240px)] object-contain object-left sm:h-12 sm:max-w-[320px]"
          />
        </Link>
        <nav className="flex shrink-0 items-center gap-4 text-sm font-medium text-navy-2">
          <Link href="/search" className="hover:text-teal">
            Search
          </Link>
          <Link href="/leaderboard" className="hover:text-teal">
            Leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm leading-6 text-muted">
        <div className="flex items-start gap-3">
          <BrandMark className="mt-0.5 h-9 w-9 shrink-0" />
          <div>
            <p className="font-semibold text-ink">
              Property<span className="font-normal text-ink/70">Radar</span>
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-radar">
              Real estate due-diligence platform
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl">
          Crowdsourced due-diligence cards for Karnataka RERA projects, starting with
          Bengaluru. Public-record style fields (RERA id, dates, flags in our seed) are
          shown separately from buyer opinions. This is not a government website, not
          legal advice, and not financial advice. Always verify on the official RERA
          portal and with a lawyer or CA before you pay a booking amount.
        </p>
        <p className="mt-4 text-ink/40">
          MVP seed data · no live government scraping · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? "rounded-md border border-warn/25 bg-warn-soft px-3 py-2 text-xs leading-5 text-ink"
          : "rounded-lg border border-warn/25 bg-warn-soft px-4 py-3 text-sm leading-6 text-ink"
      }
    >
      <span className="font-semibold">Informational only.</span> Not legal or financial
      advice. Verify independently on Karnataka RERA and other public records. Reviews
      and red flags are opinions unless marked as structured public-record fields.
    </p>
  );
}
