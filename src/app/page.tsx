import Link from "next/link";
import { DisclaimerBanner } from "@/components/SiteChrome";
import { SEARCH_HINTS } from "@/lib/constants";
import { SearchBox } from "@/components/SearchBox";
import { FlagChip, StatusBadge } from "@/components/Badges";
import { prisma } from "@/lib/prisma";
import { averageRating, formatDateTime, formatMonth } from "@/lib/format";

export default async function HomePage() {
  const [delayed, rated, sample, lastRun] = await Promise.all([
    prisma.project.findMany({
      where: { delayMonths: { gt: 0 } },
      include: { developer: true, reviews: true },
      orderBy: { delayMonths: "desc" },
      take: 4,
    }),
    prisma.project.findMany({
      include: { developer: true, reviews: true },
      take: 200,
    }),
    prisma.project.findFirst({
      where: { delayMonths: { gte: 20 } },
      include: { developer: true },
      orderBy: { delayMonths: "desc" },
    }),
    prisma.ingestionRun.findFirst({
      where: { status: "SUCCESS" },
      orderBy: { finishedAt: "desc" },
    }),
  ]);

  const highest = rated
    .map((p) => ({
      ...p,
      avg: averageRating(p.reviews.map((r) => r.rating)),
    }))
    .filter((p) => p.avg != null)
    .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))
    .slice(0, 4);

  return (
    <main>
      <section className="bg-gradient-to-b from-cream/80 to-white px-4 pb-12 pt-10 md:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-radar">
            Bengaluru · Karnataka RERA
          </p>
          <h1 className="serif mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            Type a project. Open the report card.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted md:text-base">
            Instant due-diligence for homebuyers covering Brigade, Prestige, Sobha,
            Sumadhura, Godrej and other large Bengaluru promoters: possession windows,
            catalogued record fields, and crowd reviews — built to forward on WhatsApp.
          </p>
          <div className="mt-8 text-left text-ink">
            <SearchBox autoFocus />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SEARCH_HINTS.map((hint) => (
              <Link
                key={hint}
                href={`/search?q=${encodeURIComponent(hint)}`}
                className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-navy-2 hover:border-teal hover:text-teal"
              >
                Try {hint}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <DisclaimerBanner />
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 md:grid-cols-3">
        {[
          {
            n: "1",
            t: "Search",
            d: "Look up a project name, locality, developer, or Karnataka RERA ID.",
          },
          {
            n: "2",
            t: "Read the card",
            d: "Public-record fields stay labelled separately from crowd opinions.",
          },
          {
            n: "3",
            t: "Share before you book",
            d: "Copy the link or send it on WhatsApp so family can review the same facts.",
          },
        ].map((item) => (
          <div key={item.t} className="report-card rounded-2xl p-5">
            <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ok-soft text-sm font-semibold text-ok">
              {item.n}
            </p>
            <h2 className="mt-3 font-semibold text-navy">{item.t}</h2>
            <p className="mt-1.5 text-sm leading-6 text-muted">{item.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="serif text-2xl text-navy">Most delayed</h2>
            <p className="mt-1 text-sm text-muted">
              Recalculated every night at midnight IST from catalogued possession dates.
            </p>
          </div>
          <Link href="/leaderboard" className="text-sm font-semibold text-teal hover:text-teal-2">
            Full leaderboard →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {delayed.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="report-card rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={p.reraStatus} />
                {p.litigationFlag ? <FlagChip>Litigation flag</FlagChip> : null}
              </div>
              <p className="mt-3 font-semibold text-navy">{p.name}</p>
              <p className="text-sm text-muted">
                {p.locality} · {p.developer.name}
              </p>
              <p className="mt-2 flex items-center justify-between text-sm">
                <span>
                  Promised {formatMonth(p.promisedPossession)} ·{" "}
                  <span className="font-semibold text-alert">{p.delayMonths} months late</span>
                </span>
                <span className="font-semibold text-teal">Open →</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="serif mb-1 text-2xl text-navy">Highest rated</h2>
        <p className="mb-4 text-sm text-muted">Crowd star reviews only — not an official ranking.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {highest.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="report-card rounded-2xl p-5"
            >
              <p className="font-semibold text-navy">{p.name}</p>
              <p className="text-sm text-muted">
                {p.locality} · {p.developer.name}
              </p>
              <p className="mt-2 flex items-center justify-between text-sm">
                <span className="font-medium text-ok">
                  {p.avg?.toFixed(1)} / 5 from {p.reviews.length} opinions
                </span>
                <span className="font-semibold text-teal">Open →</span>
              </p>
            </Link>
          ))}
        </div>
        {sample ? (
          <p className="mt-8 text-center text-sm text-muted">
            Sample report:{" "}
            <Link className="font-semibold text-teal" href={`/projects/${sample.slug}`}>
              {sample.name}
            </Link>
          </p>
        ) : null}
        {lastRun?.finishedAt ? (
          <p className="mt-3 text-center text-xs text-muted">
            Catalog last refreshed {formatDateTime(lastRun.finishedAt)} IST
          </p>
        ) : null}
      </section>
    </main>
  );
}
