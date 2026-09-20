import { existsSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

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
const n = await prisma.project.count();
await prisma.$disconnect();

if (n === 0) {
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", cwd: root });
}
