import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="serif text-3xl text-navy">Not in our Bengaluru file</h1>
      <p className="mt-3 text-sm text-muted">
        That URL is not a seeded project or developer. Try search.
      </p>
      <Link href="/search" className="mt-6 inline-block font-semibold text-teal">
        Back to search
      </Link>
    </main>
  );
}
