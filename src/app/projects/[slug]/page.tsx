import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, DisclaimerBanner } from "@/components/SiteChrome";
import { FlagChip, OpinionTag, RecordTag, StatusBadge } from "@/components/Badges";
import { StarRating } from "@/components/StarRating";
import { ShareBar } from "@/components/ShareBar";
import { ReviewForm } from "@/components/ReviewForm";
import { RedFlagForm, UpvoteButton } from "@/components/RedFlagForm";
import { prisma } from "@/lib/prisma";
import { projectCardInclude } from "@/lib/search";
import { averageRating, formatDate, formatMonth } from "@/lib/format";
import { riskSummary } from "@/lib/risk";
import { PROJECT_TYPES, RED_FLAG_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { developer: true },
  });
  if (!project) return { title: "Project" };
  return {
    title: `${project.name} report card`,
    description: `${project.name} in ${project.locality}, Bengaluru. RERA ${project.reraId}. Informational only.`,
    openGraph: { title: `${project.name} · PropertyRadar`, description: project.reraId },
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      ...projectCardInclude,
      developer: { include: { projects: { select: { slug: true, name: true, delayMonths: true, locality: true } } } },
    },
  });
  if (!project) notFound();

  const avg = averageRating(project.reviews.map((r) => r.rating));
  const summary = riskSummary({
    name: project.name,
    developerName: project.developer.name,
    reraStatus: project.reraStatus,
    delayMonths: project.delayMonths,
    litigationFlag: project.litigationFlag,
    consumerCourtFlag: project.consumerCourtFlag,
    promisedPossession: project.promisedPossession,
    actualPossession: project.actualPossession,
    avgRating: avg,
    reviewCount: project.reviews.length,
    redFlagCount: project.redFlags.length,
    validUntil: project.validUntil,
  });

  const others = project.developer.projects.filter((p) => p.slug !== project.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: project.name,
    url: `/projects/${project.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.locality,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    identifier: project.reraId,
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Crumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/search", label: "Search" },
          { label: "Report card" },
        ]}
      />
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="serif text-3xl text-navy md:text-4xl">{project.name}</h1>
          <p className="mt-1 text-muted">
            {project.locality}, {project.city} ·{" "}
            <Link href={`/developers/${project.developer.slug}`} className="text-teal">
              {project.developer.name}
            </Link>
          </p>
        </div>
        <ShareBar title={project.name} path={`/projects/${project.slug}`} />
      </div>

      <div className="mt-4">
        <DisclaimerBanner />
      </div>

      <article
        id="report-card"
        className="report-card mt-6 rounded-2xl border border-line p-5 md:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-radar">
            PropertyRadar · report card
          </p>
          <p className="text-xs text-muted">Last verified {formatDate(project.lastVerifiedAt)}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={project.reraStatus} />
          <FlagChip tone={project.delayMonths >= 12 ? "bad" : project.delayMonths > 0 ? "warn" : "ok"}>
            {project.delayMonths > 0 ? `${project.delayMonths} mo delay` : "On-track / delivered"}
          </FlagChip>
          {project.litigationFlag ? <FlagChip>Litigation flag</FlagChip> : <FlagChip tone="ok">No litigation flag</FlagChip>}
          {project.consumerCourtFlag ? <FlagChip>Consumer-court flag</FlagChip> : null}
          <FlagChip
            tone={
              summary.band.tone === "bad" ? "bad" : summary.band.tone === "warn" ? "warn" : "ok"
            }
          >
            {summary.band.label} · {summary.score}/100
          </FlagChip>
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-line bg-white p-3">
            <dt className="flex items-center gap-2 text-xs text-muted">
              RERA ID <RecordTag />
            </dt>
            <dd className="mt-1 font-semibold break-all">{project.reraId}</dd>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <dt className="text-xs text-muted">Type / units</dt>
            <dd className="mt-1 font-semibold">
              {PROJECT_TYPES[project.projectType] ?? project.projectType}
              {project.totalUnits ? ` · ${project.totalUnits} units` : ""}
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <dt className="text-xs text-muted">Registered</dt>
            <dd className="mt-1 font-semibold">{formatDate(project.registeredOn)}</dd>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <dt className="text-xs text-muted">RERA valid until</dt>
            <dd className="mt-1 font-semibold">{formatDate(project.validUntil)}</dd>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <dt className="text-xs text-muted">Promised possession</dt>
            <dd className="mt-1 font-semibold">{formatMonth(project.promisedPossession)}</dd>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <dt className="text-xs text-muted">Actual / latest</dt>
            <dd className="mt-1 font-semibold">
              {project.actualPossession
                ? formatMonth(project.actualPossession)
                : project.delayMonths > 0
                  ? "Not handed over in our file"
                  : "Pending (on calendar)"}
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <dt className="text-xs text-muted">Crowd rating</dt>
            <dd className="mt-1">
              <StarRating value={avg} count={project.reviews.length} />
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <dt className="text-xs text-muted">Share URL</dt>
            <dd className="mt-1 font-mono text-xs">/projects/{project.slug}</dd>
          </div>
        </dl>
        <div className="mt-6 rounded-xl border border-line bg-cream/80 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Plain-English risk note (heuristic)
          </p>
          <p className="mt-2 text-sm leading-7 text-navy">{summary.text}</p>
        </div>
      </article>

      <section className="mt-10">
        <h2 className="serif text-2xl text-navy">Developer’s other Bengaluru projects</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {others.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="report-card flex items-center justify-between px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-semibold text-navy">{p.name}</span>
                  <span className="block text-muted">{p.locality}</span>
                </span>
                <span className={p.delayMonths > 0 ? "font-semibold text-alert" : "text-ok"}>
                  {p.delayMonths > 0 ? `+${p.delayMonths} mo` : "On track"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="serif text-2xl text-navy">Star reviews</h2>
          <p className="mt-1 text-sm text-muted">All reviews are labelled opinions. Anonymous by default.</p>
          <div className="mt-4">
            <ReviewForm projectId={project.id} />
          </div>
          <ul className="mt-4 space-y-3">
            {project.reviews.map((r) => (
              <li key={r.id} className="report-card rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <StarRating value={r.rating} />
                  <OpinionTag />
                </div>
                <p className="mt-2 font-semibold text-navy">{r.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink/90">{r.body}</p>
                <p className="mt-2 text-xs text-muted">
                  {r.author} · {formatDate(r.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="serif text-2xl text-navy">Red flags</h2>
          <p className="mt-1 text-sm text-muted">
            Structured crowd reports. Upvote if you saw the same issue. Not a court record.
          </p>
          <div className="mt-4">
            <RedFlagForm projectId={project.id} />
          </div>
          <ul className="mt-4 space-y-3">
            {project.redFlags.map((f) => (
              <li key={f.id} className="report-card rounded-xl border-alert/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-alert">
                      {RED_FLAG_CATEGORIES.find((c) => c.value === f.category)?.label ?? f.category}
                    </p>
                    <p className="mt-1 font-semibold text-navy">{f.title}</p>
                  </div>
                  <UpvoteButton id={f.id} initial={f.upvotes} />
                </div>
                <p className="mt-2 text-sm leading-6">{f.body}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <OpinionTag />
                  {f.proofLabel ? <span>Proof: {f.proofLabel}</span> : <span>No proof attached</span>}
                  <span>{formatDate(f.createdAt)}</span>
                </div>
              </li>
            ))}
            {project.redFlags.length === 0 ? (
              <p className="text-sm text-muted">No crowd red flags yet.</p>
            ) : null}
          </ul>
        </div>
      </section>
    </main>
  );
}
