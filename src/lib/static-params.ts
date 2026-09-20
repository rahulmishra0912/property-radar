import { prisma } from "./prisma";

export async function projectSlugParams() {
  const rows = await prisma.project.findMany({ select: { slug: true } });
  return rows.map((p) => ({ slug: p.slug }));
}

export async function developerSlugParams() {
  const rows = await prisma.developer.findMany({ select: { slug: true } });
  return rows.map((d) => ({ slug: d.slug }));
}
