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

  useEffect(() => {
    const t = setTimeout(async () => {
      if (q.trim().length < 1) {
        setHits({ projects: [], developers: [] });
        return;
      }
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) return;
      setHits(await res.json());
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

  const inputClass =
    size === "lg"
      ? "h-14 w-full rounded-xl border border-line bg-paper pl-12 pr-28 text-base text-ink outline-none ring-radar/25 placeholder:text-muted focus:border-radar focus:ring-2"
      : "h-11 w-full rounded-lg border border-line bg-paper pl-10 pr-24 text-sm outline-none ring-radar/25 placeholder:text-muted focus:border-radar focus:ring-2";

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={go}>
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          ⌕
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim() && setOpen(true)}
          autoFocus={autoFocus}
          placeholder="Project, developer, or KA RERA ID"
          className={inputClass}
          aria-label="Search projects"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-teal px-3 py-2 text-sm font-semibold text-paper hover:bg-teal-2"
        >
          Search
        </button>
      </form>
      {open && (hits.projects.length > 0 || hits.developers.length > 0) && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-paper">
          {hits.projects.length > 0 && (
            <ul className="max-h-80 overflow-auto py-1">
              {hits.projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="block px-4 py-2.5 hover:bg-cream"
                    onClick={() => setOpen(false)}
                  >
                    <p className="text-sm font-semibold text-navy">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.locality} · {p.developer.name} · {p.reraId}
                      {p.delayMonths > 0 ? ` · ${p.delayMonths} mo delay` : ""}
                    </p>
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
                  className="block px-4 py-2 text-sm hover:bg-cream"
                  onClick={() => setOpen(false)}
                >
                  {d.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
