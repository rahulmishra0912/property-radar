import Link from "next/link";
import Image from "next/image";
import { DisclaimerBanner } from "@/components/SiteChrome";
import { SearchBox } from "@/components/SearchBox";
import { FlagChip, StatusBadge } from "@/components/Badges";
import { prisma } from "@/lib/prisma";
import { averageRating, formatMonth } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [delayed, rated, sample] = await Promise.all([
    prisma.project.findMany({
      where: { delayMonths: { gt: 0 } },
      include: { developer: true, reviews: true },
      orderBy: { delayMonths: "desc" },
      take: 4,
    }),
    prisma.project.findMany({
      include: { developer: true, reviews: true },
      take: 24,
    }),
    prisma.project.findFirst({
      where: { delayMonths: { gte: 20 } },
      include: { developer: true },
      orderBy: { delayMonths: "desc" },
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
      <section className="px-4 pb-16 pt-10 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="PropertyRadar — Real estate due-diligence platform"
              width={974}
              height={284}
              priority
              className="h-20 w-auto max-w-full object-contain sm:h-24"
            />
          </div>
          <p className="mt-8 text-xs font-medium uppercase tracking-[0.22em] text-radar">
            Bengaluru · Karnataka RERA
          </p>
          <h1 className="serif mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            Type a project. Open the report card.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted md:text-base">
            Instant due-diligence for homebuyers: RERA status, promised vs actual
            possession, litigation flags, and crowd reviews — built to forward on
            WhatsApp.
          </p>
          <div className="mt-8 text-left text-ink">
            <SearchBox autoFocus />
          </div>
          <p className="mt-3 text-xs text-muted">
            Try “Whitefield”, “Summit”, or a PRM/KA/RERA id from any report card.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <DisclaimerBanner />
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 md:grid-cols-3">
        {[
          {
            t: "Public-record style fields",
            d: "RERA id, registration window, possession dates and structured flags from our seed file — labelled separately from opinions.",
          },
          {
            t: "Crowd signal",
            d: "Anonymous star reviews and upvotable red flags (delay, quality, litigation, misrepresentation). No login.",
          },
          {
            t: "Shareable card",
            d: "Every project has a stable URL and an OG image. Screenshot the report strip before you send it to family.",
          },
        ].map((item) => (
          <div key={item.t} className="report-card rounded-2xl p-5">
            <h2 className="font-semibold text-navy">{item.t}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{item.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="serif text-2xl text-navy">Most delayed (seed)</h2>
          <Link href="/leaderboard" className="text-sm font-semibold text-teal">
            Full leaderboard
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {delayed.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="report-card rounded-2xl p-5 hover:border-radar/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={p.reraStatus} />
                {p.litigationFlag ? <FlagChip>Litigation flag</FlagChip> : null}
              </div>
              <p className="mt-3 font-semibold text-navy">{p.name}</p>
              <p className="text-sm text-muted">
                {p.locality} · {p.developer.name}
              </p>
              <p className="mt-2 text-sm">
                Promised {formatMonth(p.promisedPossession)} ·{" "}
                <span className="font-semibold text-alert">{p.delayMonths} months late</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="serif mb-4 text-2xl text-navy">Highest rated</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {highest.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="report-card rounded-2xl p-5 hover:border-radar/40"
            >
              <p className="font-semibold text-navy">{p.name}</p>
              <p className="text-sm text-muted">
                {p.locality} · {p.developer.name}
              </p>
              <p className="mt-2 text-sm text-ok">
                {p.avg?.toFixed(1)} / 5 from {p.reviews.length} opinions
              </p>
            </Link>
          ))}
        </div>
        {sample ? (
          <p className="mt-8 text-center text-sm text-muted">
            Sample deep-link:{" "}
            <Link className="font-semibold text-teal" href={`/projects/${sample.slug}`}>
              {sample.name}
            </Link>
          </p>
        ) : null}
      </section>
    </main>
  );
}
