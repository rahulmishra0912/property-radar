"use client";

import { useState } from "react";
import { STATIC_HOST, withBasePath } from "@/lib/site";

export function ShareBar({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  function url() {
    const prefixed = withBasePath(path);
    const trailing =
      STATIC_HOST && !prefixed.endsWith("/") ? `${prefixed}/` : prefixed;
    if (typeof window === "undefined") return trailing;
    return `${window.location.origin}${trailing}`;
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
        className="rounded-xl bg-ok-soft px-3 py-2 text-sm font-semibold text-ok hover:bg-ok hover:text-white"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={copy}
        className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-navy hover:border-teal"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={nativeShare}
        className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-navy hover:border-teal"
      >
        Share
      </button>
    </div>
  );
}
