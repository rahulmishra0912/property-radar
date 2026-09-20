"use client";

import { useState } from "react";

export function ShareBar({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  function url() {
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  }

  async function copy() {
    await navigator.clipboard.writeText(url());
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function whatsapp() {
    const text = `${title} — PropertyRadar report card\n${url()}\nInformational only; verify independently.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, text: `${title} · PropertyRadar`, url: url() });
    } else {
      await copy();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={whatsapp}
        className="rounded-lg bg-ok px-3 py-2 text-sm font-semibold text-paper"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={copy}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-navy"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={nativeShare}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-navy"
      >
        Share
      </button>
    </div>
  );
}
