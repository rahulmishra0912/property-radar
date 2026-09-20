import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCatalogRefresh } from "@/ingestion/sync";

export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const alt = request.headers.get("x-cron-secret");
  return bearer === secret || alt === secret;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runCatalogRefresh(prisma);
    return NextResponse.json({
      ok: true,
      source: result.source,
      developersUpserted: result.developersUpserted,
      projectsUpserted: result.projectsUpserted,
      runId: result.runId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Refresh failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export const POST = GET;
