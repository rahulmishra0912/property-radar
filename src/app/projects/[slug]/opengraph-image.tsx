import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { riskBand, riskScore } from "@/lib/risk";
import { averageRating } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PropertyRadar report card";

const paper = "#f8f5ef";
const cream = "#f3efe7";
const ink = "#2f2f2f";
const muted = "#6d757c";
const radar = "#7a8b96";
const terracotta = "#b56b5c";
const ok = "#6f8766";
const warn = "#a8885c";
const line = "#ddd8ce";
const alertSoft = "#f4ebe7";
const okSoft = "#e7eee4";

function Mark() {
  return (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
      <path
        d="M18 48 A30 30 0 1 1 62 18"
        stroke={radar}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M24 46 A22 22 0 1 1 58 22"
        stroke={radar}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M22 46 L40 26 L58 46 V64 H22 Z"
        stroke="#8FA083"
        strokeWidth="4.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 56 L40 44 L48 56"
        stroke="#8FA083"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { developer: true, reviews: true, redFlags: true },
  });

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: paper,
            color: ink,
            gap: 16,
          }}
        >
          <Mark />
          <div style={{ display: "flex", fontSize: 44, fontWeight: 600 }}>
            Property<span style={{ fontWeight: 400, opacity: 0.7 }}>Radar</span>
          </div>
        </div>
      ),
      size,
    );
  }

  const avg = averageRating(project.reviews.map((r) => r.rating));
  const score = riskScore({
    name: project.name,
    developerName: project.developer.name,
    reraStatus: project.reraStatus,
    delayMonths: project.delayMonths,
    litigationFlag: project.litigationFlag,
    consumerCourtFlag: project.consumerCourtFlag,
    promisedPossession: project.promisedPossession,
    actualPossession: project.actualPossession,
    avgRating: avg,
    reviewCount: project.reviews.length,
    redFlagCount: project.redFlags.length,
    validUntil: project.validUntil,
  });
  const band = riskBand(score);
  const bandColor = band.tone === "bad" ? terracotta : band.tone === "warn" ? warn : ok;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: paper,
          padding: 56,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Mark />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 28, color: ink, fontWeight: 600 }}>
                Property<span style={{ fontWeight: 400, color: "rgba(47,47,47,0.7)" }}>Radar</span>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 13,
                  letterSpacing: 3,
                  color: radar,
                  textTransform: "uppercase",
                }}
              >
                Real estate due-diligence platform
              </div>
            </div>
          </div>
          <span style={{ color: muted, fontSize: 20 }}>Bengaluru · KA RERA</span>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 52,
            color: ink,
            lineHeight: 1.15,
            display: "flex",
          }}
        >
          {project.name}
        </div>
        <div style={{ marginTop: 12, fontSize: 24, color: muted, display: "flex" }}>
          {project.locality} · {project.developer.shortName}
        </div>
        <div style={{ marginTop: 28, display: "flex", gap: 16, fontSize: 22 }}>
          <div
            style={{
              background: project.delayMonths > 0 ? alertSoft : okSoft,
              color: project.delayMonths > 0 ? terracotta : ok,
              padding: "10px 18px",
              borderRadius: 999,
              display: "flex",
              border: `1px solid ${line}`,
            }}
          >
            {project.delayMonths > 0 ? `${project.delayMonths} months delay` : "On-track"}
          </div>
          <div
            style={{
              background: cream,
              color: ink,
              padding: "10px 18px",
              borderRadius: 999,
              display: "flex",
              border: `1px solid ${line}`,
            }}
          >
            RERA {project.reraStatus}
          </div>
          <div
            style={{
              background: cream,
              color: bandColor,
              padding: "10px 18px",
              borderRadius: 999,
              display: "flex",
              border: `1px solid ${line}`,
            }}
          >
            {band.label} {score}
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            color: muted,
            fontSize: 20,
          }}
        >
          <span>{project.reraId}</span>
          <span>Informational only · verify independently</span>
        </div>
      </div>
    ),
    size,
  );
}
