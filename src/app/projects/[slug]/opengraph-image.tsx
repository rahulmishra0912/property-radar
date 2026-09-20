import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { riskBand, riskScore } from "@/lib/risk";
import { averageRating } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Property Radar report card";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { developer: true, reviews: true, redFlags: true },
  });

  if (!project) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0b1f33",
          color: "#f4efe6",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
        }}
      >
        Property Radar
      </div>,
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

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f4efe6",
        padding: 56,
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", color: "#0f7b77", fontSize: 22 }}>
        <span>PROPERTY RADAR</span>
        <span>Bengaluru · KA RERA</span>
      </div>
      <div style={{ marginTop: 36, fontSize: 54, color: "#0b1f33", lineHeight: 1.15, display: "flex" }}>
        {project.name}
      </div>
      <div style={{ marginTop: 12, fontSize: 26, color: "#5b6b7a", display: "flex" }}>
        {project.locality} · {project.developer.shortName}
      </div>
      <div style={{ marginTop: 28, display: "flex", gap: 16, fontSize: 22 }}>
        <div
          style={{
            background: project.delayMonths > 0 ? "#fde8e6" : "#e4f4ec",
            color: project.delayMonths > 0 ? "#b42318" : "#0f6b4c",
            padding: "10px 18px",
            borderRadius: 999,
            display: "flex",
          }}
        >
          {project.delayMonths > 0 ? `${project.delayMonths} months delay` : "On-track"}
        </div>
        <div
          style={{
            background: "#14324c",
            color: "#f4efe6",
            padding: "10px 18px",
            borderRadius: 999,
            display: "flex",
          }}
        >
          RERA {project.reraStatus}
        </div>
        <div
          style={{
            background: band.tone === "bad" ? "#b42318" : band.tone === "warn" ? "#b45309" : "#0f6b4c",
            color: "white",
            padding: "10px 18px",
            borderRadius: 999,
            display: "flex",
          }}
        >
          {band.label} {score}
        </div>
      </div>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", color: "#5b6b7a", fontSize: 20 }}>
        <span>{project.reraId}</span>
        <span>Informational only · verify independently</span>
      </div>
    </div>,
    size,
  );
}
