import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const stashRoot = path.join(root, ".pages-build-stash");
const apiDir = path.join(root, "src/app/api");
const stashedApi = path.join(stashRoot, "api");

function restore() {
  if (existsSync(stashedApi) && !existsSync(apiDir)) {
    renameSync(stashedApi, apiDir);
  }
  if (existsSync(stashRoot) && !existsSync(stashedApi)) {
    rmSync(stashRoot, { recursive: true, force: true });
  }
}

function main() {
  execSync("npx tsx scripts/ensure-db.ts", { stdio: "inherit", cwd: root });

  mkdirSync(stashRoot, { recursive: true });
  if (existsSync(apiDir)) {
    if (existsSync(stashedApi)) {
      rmSync(stashedApi, { recursive: true, force: true });
    }
    renameSync(apiDir, stashedApi);
  }

  rmSync(path.join(root, ".next"), { recursive: true, force: true });

  const env = {
    ...process.env,
    GITHUB_PAGES: "1",
    NEXT_PUBLIC_STATIC_HOST: "1",
    INGEST_SCHEDULE: "0",
    NEXT_PUBLIC_BASE_PATH:
      process.env.NEXT_PUBLIC_BASE_PATH ?? "/property-radar",
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://rahulmishra0912.github.io/property-radar",
  };

  try {
    execSync("npx next build", { stdio: "inherit", cwd: root, env });
  } finally {
    restore();
  }
}

process.on("SIGINT", () => {
  restore();
  process.exit(1);
});

main();
