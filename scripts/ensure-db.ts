import { existsSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

async function main() {
  const root = process.cwd();
  const envPath = path.join(root, ".env");

  if (!existsSync(envPath)) {
    writeFileSync(envPath, 'DATABASE_URL="file:./dev.db"\n');
    console.log("Wrote .env with SQLite DATABASE_URL");
  }

  execSync("npx prisma generate", { stdio: "inherit", cwd: root });
  execSync("npx prisma db push", { stdio: "inherit", cwd: root });

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const n = await prisma.project.count();

    if (n === 0) {
      await prisma.$disconnect();
      execSync("npx tsx prisma/seed.ts", { stdio: "inherit", cwd: root });
      return;
    }

    const { runCatalogRefresh } = await import("../src/ingestion/sync");
    await runCatalogRefresh(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
