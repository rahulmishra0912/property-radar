import { PrismaClient } from "@prisma/client";
import { runCatalogRefresh } from "../src/ingestion/sync";

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await runCatalogRefresh(prisma);
    console.log("Catalog refresh", result);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
