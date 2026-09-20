import { RERA_STATUS_LABEL } from "@/lib/constants";

const TONE: Record<string, string> = {
  REGISTERED: "bg-ok-soft text-ok",
  EXTENDED: "bg-warn-soft text-warn",
  LAPSED: "bg-alert-soft text-alert",
  EXPIRED: "bg-alert-soft text-alert",
  REVOKED: "bg-alert-soft text-alert",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE[status] ?? "bg-cream text-navy"}`}
    >
      RERA {RERA_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function FlagChip({
  children,
  tone = "bad",
}: {
  children: React.ReactNode;
  tone?: "bad" | "warn" | "ok" | "neutral";
}) {
  const cls =
    tone === "bad"
      ? "bg-alert-soft text-alert"
      : tone === "warn"
        ? "bg-warn-soft text-warn"
        : tone === "ok"
          ? "bg-ok-soft text-ok"
          : "bg-cream text-navy";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

export function OpinionTag() {
  return (
    <span className="inline-flex rounded border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
      Opinion
    </span>
  );
}

export function RecordTag() {
  return (
    <span className="inline-flex rounded border border-radar/30 bg-radar/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-radar">
      Structured record
    </span>
  );
}
