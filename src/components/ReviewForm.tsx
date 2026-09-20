"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReviewForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, projectId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not save review");
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("done");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-line bg-cream/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-navy">Write a review</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
          Opinion · anonymous
        </span>
      </div>
      <p className="text-xs text-muted">
        No account needed. This is your opinion, not a public-record fact.
      </p>
      <label className="block text-sm">
        Stars
        <select
          name="rating"
          required
          defaultValue="4"
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Title
        <input
          name="title"
          required
          minLength={4}
          placeholder="Short headline"
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        What happened
        <textarea
          name="body"
          required
          minLength={20}
          rows={4}
          placeholder="Possession, quality, communication — be specific."
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Display name (optional)
        <input
          name="author"
          placeholder="Anonymous homebuyer"
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-alert">{error}</p> : null}
      {status === "done" ? (
        <p className="text-sm text-ok">Published. Thank you.</p>
      ) : null}
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-paper disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Publish review"}
      </button>
    </form>
  );
}
