import { formatMonth } from "./format";

type RiskInput = {
  name: string;
  developerName: string;
  reraStatus: string;
  delayMonths: number;
  litigationFlag: boolean;
  consumerCourtFlag: boolean;
  promisedPossession: Date;
  actualPossession: Date | null;
  avgRating: number | null;
  reviewCount: number;
  redFlagCount: number;
  validUntil: Date;
};

export function riskScore(input: RiskInput) {
  let score = 12;
  score += Math.min(40, input.delayMonths);
  if (input.litigationFlag) score += 18;
  if (input.consumerCourtFlag) score += 10;
  if (input.reraStatus === "LAPSED" || input.reraStatus === "EXPIRED") score += 16;
  if (input.reraStatus === "REVOKED") score += 28;
  if (input.reraStatus === "EXTENDED") score += 6;
  if (input.reraStatus === "UNVERIFIED") score += 4;
  if (input.avgRating != null && input.avgRating <= 2.5) score += 12;
  if (input.avgRating != null && input.avgRating >= 4.2) score -= 8;
  score += Math.min(12, input.redFlagCount * 2);
  return Math.max(8, Math.min(98, score));
}

export function riskBand(score: number) {
  if (score >= 70) return { label: "High caution", tone: "bad" as const };
  if (score >= 45) return { label: "Watch closely", tone: "warn" as const };
  return { label: "Lower relative risk", tone: "ok" as const };
}

export function riskSummary(input: RiskInput) {
  const score = riskScore(input);
  const band = riskBand(score);
  const bits: string[] = [];

  if (input.delayMonths >= 24) {
    bits.push(
      `Possession is about ${input.delayMonths} months behind the promised ${formatMonth(input.promisedPossession)} date — a serious slip versus the agreement window.`,
    );
  } else if (input.delayMonths >= 12) {
    bits.push(
      `Handover looks roughly ${input.delayMonths} months late versus the promised ${formatMonth(input.promisedPossession)} window.`,
    );
  } else if (input.delayMonths >= 3) {
    bits.push(
      `There is a modest recorded delay of ${input.delayMonths} months against the promised possession month.`,
    );
  } else if (input.actualPossession) {
    bits.push(
      `Records show handover around ${formatMonth(input.actualPossession)}, in line with the promised date.`,
    );
  } else {
    bits.push(
      `No large possession slip is recorded in this dataset relative to ${formatMonth(input.promisedPossession)}.`,
    );
  }

  if (input.reraStatus === "REGISTERED") {
    bits.push(
      `Karnataka RERA status in our file is registered, with validity through ${formatMonth(input.validUntil)} — still re-check the portal.`,
    );
  } else if (input.reraStatus === "EXTENDED") {
    bits.push(
      `Registration appears extended (valid until ${formatMonth(input.validUntil)}). Extensions often follow delayed completion; read the latest RERA order.`,
    );
  } else if (input.reraStatus === "LAPSED" || input.reraStatus === "EXPIRED") {
    bits.push(
      `RERA validity is marked ${input.reraStatus.toLowerCase()} in this file. That is a hard stop-the-line item before any booking.`,
    );
  } else if (input.reraStatus === "UNVERIFIED") {
    bits.push(
      `RERA status is unverified in the catalog. Confirm registration, validity, and the official PRM/KA number on Karnataka RERA before you act.`,
    );
  } else if (input.reraStatus === "REVOKED") {
    bits.push(
      `RERA registration is marked revoked in this file. Treat this as a high-severity public-record style flag.`,
    );
  }

  if (input.litigationFlag) {
    bits.push(
      `A litigation flag is on for ${input.name}. Confirm case status yourself; this app does not give legal advice.`,
    );
  }
  if (input.consumerCourtFlag) {
    bits.push(`A consumer-court style flag is also tagged for this project in our structured fields.`);
  }

  if (input.avgRating != null && input.reviewCount > 0) {
    bits.push(
      `Crowd reviews average ${input.avgRating.toFixed(1)}/5 from ${input.reviewCount} opinion${input.reviewCount === 1 ? "" : "s"} — opinions, not facts.`,
    );
  }
  if (input.redFlagCount > 0) {
    bits.push(
      `There ${input.redFlagCount === 1 ? "is" : "are"} ${input.redFlagCount} crowdsourced red flag${input.redFlagCount === 1 ? "" : "s"} (delay, quality, litigation, or misrepresentation).`,
    );
  }

  bits.push(
    `Promoter: ${input.developerName}. Compare their other Bengaluru projects on the developer page before you forward this card.`,
  );

  return { score, band, text: bits.join(" ") };
}
