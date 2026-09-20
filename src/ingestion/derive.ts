import type { CatalogProject, CatalogReraStatus } from "./types";

export function monthsBetween(from: Date, to: Date) {
  return (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
}

export function deriveDelayMonths(
  promisedPossession: Date,
  actualPossession: Date | null,
  now: Date,
) {
  if (actualPossession) {
    return Math.max(0, monthsBetween(promisedPossession, actualPossession));
  }
  if (now.getTime() <= promisedPossession.getTime()) return 0;
  return Math.max(0, monthsBetween(promisedPossession, now));
}

export function deriveReraStatus(base: CatalogReraStatus, validUntil: Date, now: Date): CatalogReraStatus {
  if (base === "REVOKED" || base === "LAPSED" || base === "UNVERIFIED") return base;
  if (validUntil.getTime() < now.getTime() && (base === "REGISTERED" || base === "EXTENDED")) {
    return "EXPIRED";
  }
  return base;
}

export function parseIsoDate(value: string) {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid catalog date: ${value}`);
  }
  return parsed;
}

export function hydrateProjectDates(project: CatalogProject, now: Date) {
  const promisedPossession = parseIsoDate(project.promisedPossession);
  const actualPossession = project.actualPossession ? parseIsoDate(project.actualPossession) : null;
  const validUntil = parseIsoDate(project.validUntil);
  return {
    registeredOn: parseIsoDate(project.registeredOn),
    validUntil,
    promisedPossession,
    actualPossession,
    delayMonths: deriveDelayMonths(promisedPossession, actualPossession, now),
    reraStatus: deriveReraStatus(project.reraStatus, validUntil, now),
  };
}

/** Milliseconds until the next 00:00 in Asia/Kolkata. */
export function msUntilNextMidnightIST(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  const wall = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  const nextMidnight = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day) + 1, 0, 0, 0, 0);
  const wait = nextMidnight - wall;
  return wait > 0 ? wait : 24 * 60 * 60 * 1000;
}
