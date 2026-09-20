"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RED_FLAG_CATEGORIES } from "@/lib/constants";

export function RedFlagForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const proof = fd.get("proof");
    const proofLabel =
      proof instanceof File && proof.size > 0
        ? `${proof.name} (stub — file not stored in MVP)`
        : undefined;
    const res = await fetch("/api/red-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        category: fd.get("category"),
        title: fd.get("title"),
        body: fd.get("body"),
        proofLabel,
      }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Could not save flag");
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("done");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-alert/15 bg-alert-soft/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-navy">Flag a red issue</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-alert">
          Crowd opinion
        </span>
      </div>
      <label className="block text-sm">
        Category
        <select
          name="category"
          required
          className="field mt-1"
        >
          {RED_FLAG_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Title
        <input
          name="title"
          required
          minLength={6}
          placeholder="e.g. OC still pending after keys"
          className="field mt-1"
        />
      </label>
      <label className="block text-sm">
        Details
        <textarea
          name="body"
          required
          minLength={20}
          rows={4}
          className="field mt-1"
        />
      </label>
      <label className="block text-sm">
        Proof (optional stub)
        <input name="proof" type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm" />
        <span className="text-xs text-muted">
          MVP does not upload or store files. We only keep a label that you tried to attach proof.
        </span>
      </label>
      {error ? <p className="text-sm text-alert">{error}</p> : null}
      {status === "done" ? <p className="text-sm text-ok">Flag posted.</p> : null}
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-xl bg-alert px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Submit red flag"}
      </button>
    </form>
  );
}

export function UpvoteButton({ id, initial }: { id: string; initial: number }) {
  const [n, setN] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function vote() {
    if (busy) return;
    setBusy(true);
    const res = await fetch(`/api/red-flags/${id}/upvote`, { method: "POST" });
    if (res.ok) {
      const json = await res.json();
      setN(json.upvotes);
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={vote}
      className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-semibold text-navy hover:border-teal"
    >
      ▲ {n}
    </button>
  );
}
