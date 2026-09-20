import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "1";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isGithubPages ? "/property-radar" : "");

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: isGithubPages },
  serverExternalPackages: ["@prisma/client", "prisma"],
  agentRules: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_HOST: isGithubPages ? "1" : (process.env.NEXT_PUBLIC_STATIC_HOST ?? ""),
  },
};

export default nextConfig;
