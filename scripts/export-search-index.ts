import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import type { SearchIndex } from "../src/lib/client-search";

async function main() {
  const prisma = new PrismaClient();
  try {
    const [projects, developers] = await Promise.all([
      prisma.project.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          locality: true,
          reraId: true,
          reraStatus: true,
          delayMonths: true,
          developer: { select: { name: true, shortName: true, slug: true } },
        },
        orderBy: { delayMonths: "desc" },
      }),
      prisma.developer.findMany({
        select: { id: true, slug: true, name: true, shortName: true },
        orderBy: { name: "asc" },
      }),
    ]);

    const index: SearchIndex = { projects, developers };
    const dir = path.join(process.cwd(), "public");
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "search-index.json"), JSON.stringify(index));
    console.log(`Wrote public/search-index.json (${projects.length} projects)`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
