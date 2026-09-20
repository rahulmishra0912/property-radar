import Link from "next/link";
import { BrandMark } from "@/components/BrandLogo";

export { SiteHeader } from "@/components/SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-cream/70 text-ink">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm leading-6 text-muted md:grid-cols-[1.4fr_1fr]">
        <div>
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
          <p className="mt-4 max-w-xl">
            Crowdsourced due-diligence cards for Karnataka RERA projects, starting with
            Bengaluru. Public-record fields stay separate from buyer opinions. This is not a
            government website and not legal or financial advice.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy">Explore</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                <Link href="/search" className="hover:text-teal">
                  Search projects
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-teal">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy">Verify</p>
            <p className="mt-2 text-xs leading-5">
              Check the official Karnataka RERA portal and a lawyer or CA before you pay a
              booking amount.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-line/80">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink/40">
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
          ? "rounded-xl border border-line bg-warn-soft/80 px-3 py-2 text-xs leading-5 text-navy-2"
          : "rounded-2xl border border-line bg-warn-soft/80 px-4 py-3 text-sm leading-6 text-navy-2"
      }
    >
      <span className="font-semibold text-navy">Informational only.</span> Not legal or financial
      advice. Verify independently on Karnataka RERA and other public records. Reviews and red
      flags are opinions unless marked as structured public-record fields.
    </p>
  );
}

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-medium text-muted">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {i > 0 ? <span className="mx-1.5 text-line">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-teal">
              {item.label}
            </Link>
          ) : (
            <span className="text-navy-2">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
