import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { StatusBadge } from "@/components/Badges";
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
      <h1 className="serif text-3xl text-navy">Search</h1>
      <div className="mt-4">
        <SearchBox initialQuery={q} />
      </div>
      {!q.trim() ? (
        <p className="mt-6 text-sm text-muted">
          Search by project name, developer, locality, or Karnataka RERA ID.
        </p>
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
                    className="report-card block rounded-xl p-4 hover:border-radar/40"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={p.reraStatus} />
                      {p.delayMonths > 0 ? (
                        <span className="text-xs font-semibold text-alert">
                          {p.delayMonths} mo delay
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 font-semibold text-navy">{p.name}</p>
                    <p className="text-sm text-muted">
                      {p.locality} · {p.developer.name} · {p.reraId}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            {projects.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No matching projects in the Bengaluru seed.</p>
            ) : null}
          </section>
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Developers ({developers.length})
            </h2>
            <ul className="mt-3 space-y-2">
              {developers.map((d) => (
                <li key={d.id}>
                  <Link href={`/developers/${d.slug}`} className="font-semibold text-teal">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}
