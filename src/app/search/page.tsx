import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { StatusBadge } from "@/components/Badges";
import { Crumbs } from "@/components/SiteChrome";
import { SEARCH_HINTS } from "@/lib/constants";
import { searchAll } from "@/lib/search";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { projects, developers } = await searchAll(q, 40);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <Crumbs items={[{ href: "/", label: "Home" }, { label: "Search" }]} />
      <h1 className="serif mt-3 text-3xl text-navy">Find a project</h1>
      <p className="mt-2 text-sm text-muted">
        Search by project name, developer, locality, or Karnataka RERA ID.
      </p>
      <div className="mt-4">
        <SearchBox initialQuery={q} />
      </div>
      {!q.trim() ? (
        <div className="mt-8">
          <p className="text-sm font-medium text-navy">Popular starting points</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SEARCH_HINTS.map((hint) => (
              <Link
                key={hint}
                href={`/search?q=${encodeURIComponent(hint === "PRM/KA" ? "PRM" : hint)}`}
                className="rounded-full border border-line bg-cream px-3 py-1.5 text-sm text-navy-2 hover:border-teal hover:text-teal"
              >
                {hint}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Projects ({projects.length})
            </h2>
            <ul className="mt-3 space-y-3">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="report-card block rounded-2xl p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={p.reraStatus} />
                      {p.delayMonths > 0 ? (
                        <span className="text-xs font-semibold text-alert">
                          {p.delayMonths} mo delay
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-ok">On track</span>
                      )}
                    </div>
                    <p className="mt-2 font-semibold text-navy">{p.name}</p>
                    <p className="flex items-center justify-between gap-3 text-sm text-muted">
                      <span>
                        {p.locality} · {p.developer.name} · {p.reraId}
                      </span>
                      <span className="shrink-0 font-semibold text-teal">Open →</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            {projects.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-dashed border-line bg-cream/60 px-4 py-6 text-sm text-muted">
                No matching projects in the Bengaluru catalog. Try Brigade, Prestige, Sobha, or a
                developer name.
              </p>
            ) : null}
          </section>
          {developers.length > 0 ? (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Developers ({developers.length})
            </h2>
            <ul className="mt-3 space-y-2">
              {developers.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/developers/${d.slug}`}
                    className="report-card flex items-center justify-between rounded-xl px-4 py-3"
                  >
                    <span className="font-semibold text-navy">{d.name}</span>
                    <span className="text-sm font-semibold text-teal">Open →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          ) : null}
        </div>
      )}
    </main>
  );
}
