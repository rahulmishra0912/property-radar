import type { Metadata } from "next";
import Link from "next/link";
import { Crumbs, DisclaimerBanner } from "@/components/SiteChrome";
import { prisma } from "@/lib/prisma";
import { averageRating } from "@/lib/format";

export const metadata: Metadata = { title: "Bengaluru leaderboard" };

export default async function LeaderboardPage() {
  const projects = await prisma.project.findMany({
    include: { developer: true, reviews: true, redFlags: true },
  });

  const delayed = [...projects].sort((a, b) => b.delayMonths - a.delayMonths).slice(0, 12);
  const rated = projects
    .map((p) => ({ ...p, avg: averageRating(p.reviews.map((r) => r.rating)) }))
    .filter((p) => p.avg != null)
    .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))
    .slice(0, 12);

  const developers = await prisma.developer.findMany({
    include: { projects: { include: { reviews: true } } },
  });
  const worstPromoters = developers
    .map((d) => ({
      ...d,
      avgDelay: Math.round(
        d.projects.reduce((s, p) => s + p.delayMonths, 0) / Math.max(1, d.projects.length),
      ),
    }))
    .sort((a, b) => b.avgDelay - a.avgDelay)
    .slice(0, 8);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <Crumbs items={[{ href: "/", label: "Home" }, { label: "Leaderboard" }]} />
      <h1 className="serif mt-3 text-3xl text-navy">Bengaluru leaderboard</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Ranked from the Bengaluru builder catalog — not official RERA rankings. Compare, then open a report card.
      </p>
      <div className="mt-4">
        <DisclaimerBanner compact />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-alert">Most delayed projects</h2>
          <ol className="mt-3 space-y-2">
            {delayed.map((p, i) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="report-card flex items-center justify-between px-4 py-3"
                >
                  <span className="flex min-w-0 items-start gap-3 pr-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-alert-soft text-xs font-semibold text-alert">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-semibold text-navy">{p.name}</span>
                      <span className="block text-xs text-muted">{p.developer.shortName}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-semibold text-alert">{p.delayMonths} mo</span>
                    <span className="text-xs font-semibold text-teal">Open →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ok">Highest crowd-rated</h2>
          <ol className="mt-3 space-y-2">
            {rated.map((p, i) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="report-card flex items-center justify-between px-4 py-3"
                >
                  <span className="flex min-w-0 items-start gap-3 pr-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ok-soft text-xs font-semibold text-ok">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-semibold text-navy">{p.name}</span>
                      <span className="block text-xs text-muted">{p.reviews.length} opinions</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-semibold text-ok">{p.avg?.toFixed(1)}</span>
                    <span className="text-xs font-semibold text-teal">Open →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy">Promoters by average delay</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {worstPromoters.map((d) => (
            <li key={d.id}>
              <Link
                href={`/developers/${d.slug}`}
                className="report-card flex items-center justify-between px-4 py-3"
              >
                <span className="font-semibold text-navy">{d.name}</span>
                <span className="text-right">
                  <span className="block text-sm text-alert">{d.avgDelay} mo avg</span>
                  <span className="text-xs font-semibold text-teal">Open →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-6 text-xs text-muted">
        Highest-rated list uses crowd opinions only. Delayed list uses structured possession fields.
      </p>
    </main>
  );
}
