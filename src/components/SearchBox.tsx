"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Hit = {
  projects: {
    slug: string;
    name: string;
    locality: string;
    reraId: string;
    delayMonths: number;
    developer: { name: string };
  }[];
  developers: { slug: string; name: string }[];
};

export function SearchBox({
  autoFocus = false,
  size = "lg",
  initialQuery = "",
}: {
  autoFocus?: boolean;
  size?: "lg" | "sm";
  initialQuery?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Hit>({ projects: [], developers: [] });
  const boxRef = useRef<HTMLDivElement>(null);
  const skipAutoOpen = useRef(Boolean(initialQuery));

  useEffect(() => {
    const t = setTimeout(async () => {
      if (q.trim().length < 1) {
        setHits({ projects: [], developers: [] });
        return;
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) return;
      setHits(await res.json());
      if (skipAutoOpen.current) {
        skipAutoOpen.current = false;
        return;
      }
      setOpen(true);
    }, 160);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const large = size === "lg";
  const inputClass = large
    ? "h-14 w-full rounded-2xl border border-line bg-white pl-12 pr-28 text-base text-ink shadow-sm outline-none placeholder:text-muted focus:border-teal focus:ring-4 focus:ring-teal/15"
    : "h-10 w-full rounded-full border border-line bg-cream/80 pl-10 pr-4 text-sm outline-none placeholder:text-muted focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/15";

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={go}>
        <span className={`pointer-events-none absolute ${large ? "left-4" : "left-3.5"} top-1/2 -translate-y-1/2 text-muted`}>
          ⌕
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim() && setOpen(true)}
          autoFocus={autoFocus}
          placeholder={large ? "Search a project, developer, or KA RERA ID" : "Search projects"}
          className={inputClass}
          aria-label="Search projects"
        />
        {large ? (
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal-2"
          >
            Search
          </button>
        ) : (
          <button type="submit" className="sr-only">
            Search
          </button>
        )}
      </form>
      {open && (hits.projects.length > 0 || hits.developers.length > 0) && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
          {hits.projects.length > 0 && (
            <ul className="max-h-80 overflow-auto py-1">
              {hits.projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-cream"
                    onClick={() => setOpen(false)}
                  >
                    <span>
                      <p className="text-sm font-semibold text-navy">{p.name}</p>
                      <p className="text-xs text-muted">
                        {p.locality} · {p.developer.name}
                        {p.delayMonths > 0 ? ` · ${p.delayMonths} mo delay` : ""}
                      </p>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-teal">Open →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {hits.developers.length > 0 && (
            <div className="border-t border-line py-1">
              <p className="px-4 py-1 text-[11px] uppercase tracking-wide text-muted">
                Developers
              </p>
              {hits.developers.map((d) => (
                <Link
                  key={d.slug}
                  href={`/developers/${d.slug}`}
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-cream"
                  onClick={() => setOpen(false)}
                >
                  <span className="font-medium text-navy">{d.name}</span>
                  <span className="text-xs font-semibold text-teal">Open →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
