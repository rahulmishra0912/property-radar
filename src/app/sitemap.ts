import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [projects, developers] = await Promise.all([
    prisma.project.findMany({ select: { slug: true } }),
    prisma.developer.findMany({ select: { slug: true } }),
  ]);
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/leaderboard`, changeFrequency: "weekly", priority: 0.7 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...developers.map((d) => ({
      url: `${base}/developers/${d.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
