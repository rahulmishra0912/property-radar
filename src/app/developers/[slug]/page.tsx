import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, DisclaimerBanner } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/Badges";
import { prisma } from "@/lib/prisma";
import { averageRating, formatMonth } from "@/lib/format";
import { developerSlugParams } from "@/lib/static-params";

export const dynamicParams = false;

export async function generateStaticParams() {
  return developerSlugParams();
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const developer = await prisma.developer.findUnique({ where: { slug } });
  if (!developer) return { title: "Developer" };
  return {
    title: developer.name,
    description: `${developer.name} Bengaluru projects on PropertyRadar. Informational only.`,
  };
}

export default async function DeveloperPage({ params }: Props) {
  const { slug } = await params;
  const developer = await prisma.developer.findUnique({
    where: { slug },
    include: { projects: { include: { reviews: true, redFlags: true }, orderBy: { delayMonths: "desc" } } },
  });
  if (!developer) notFound();

  const delays = developer.projects.map((p) => p.delayMonths);
  const avgDelay = Math.round(delays.reduce((a, b) => a + b, 0) / Math.max(1, delays.length));
  const ratings = developer.projects.flatMap((p) => p.reviews.map((r) => r.rating));
  const avg = averageRating(ratings);
  const lit = developer.projects.filter((p) => p.litigationFlag).length;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <Crumbs items={[{ href: "/", label: "Home" }, { href: "/search", label: "Search" }, { label: developer.name }]} />
      <h1 className="serif mt-3 text-3xl text-navy md:text-4xl">{developer.name}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{developer.summary}</p>
      <p className="mt-2 text-sm text-muted">
        {developer.city}
        {developer.foundedYear ? ` · est. ${developer.foundedYear}` : ""} · {developer.projects.length}{" "}
        catalogued projects
      </p>
      <div className="mt-4">
        <DisclaimerBanner compact />
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="report-card rounded-xl p-4">
          <dt className="text-xs text-muted">Avg delay</dt>
          <dd className="mt-1 text-xl font-semibold text-navy">{avgDelay} mo</dd>
        </div>
        <div className="report-card rounded-xl p-4">
          <dt className="text-xs text-muted">Crowd rating</dt>
          <dd className="mt-1 text-xl font-semibold text-navy">{avg == null ? "—" : avg.toFixed(1)}</dd>
        </div>
        <div className="report-card rounded-xl p-4">
          <dt className="text-xs text-muted">Litigation flags</dt>
          <dd className="mt-1 text-xl font-semibold text-alert">{lit}</dd>
        </div>
      </dl>
      <ul className="mt-8 space-y-3">
        {developer.projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projects/${p.slug}`}
              className="report-card flex flex-col gap-1 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-navy">{p.name}</p>
                <p className="text-sm text-muted">
                  {p.locality} · promised {formatMonth(p.promisedPossession)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={p.reraStatus} />
                <span className={p.delayMonths > 0 ? "text-sm font-semibold text-alert" : "text-sm text-ok"}>
                  {p.delayMonths > 0 ? `${p.delayMonths} mo late` : "On track"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
