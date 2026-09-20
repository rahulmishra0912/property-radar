import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "./SearchView";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-3xl px-4 py-8">
          <p className="text-sm text-muted">Loading search…</p>
        </main>
      }
    >
      <SearchView />
    </Suspense>
  );
}
