import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const projectCardInclude = {
  developer: true,
  reviews: { orderBy: { createdAt: "desc" as const } },
  redFlags: { orderBy: { upvotes: "desc" as const } },
} satisfies Prisma.ProjectInclude;

export async function searchAll(query: string, take = 12) {
  const q = query.trim();
  if (q.length < 1) {
    return { projects: [], developers: [] };
  }

  const [projects, developers] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { reraId: { contains: q } },
          { locality: { contains: q } },
          { developer: { name: { contains: q } } },
          { developer: { shortName: { contains: q } } },
        ],
      },
      include: { developer: true },
      take,
      orderBy: { delayMonths: "desc" },
    }),
    prisma.developer.findMany({
      where: {
        OR: [{ name: { contains: q } }, { shortName: { contains: q } }],
      },
      take: 6,
      orderBy: { name: "asc" },
    }),
  ]);

  return { projects, developers };
}
