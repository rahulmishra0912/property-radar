import { msUntilNextMidnightIST } from "./derive";
import { runCatalogRefresh } from "./sync";

const globalForSchedule = globalThis as unknown as {
  propertyRadarRefreshTimer?: ReturnType<typeof setTimeout>;
};

async function fireRefresh(reason: string) {
  const { prisma } = await import("@/lib/prisma");
  console.log(`[ingestion] ${reason} — starting Bengaluru catalog refresh`);
  const result = await runCatalogRefresh(prisma);
  console.log(
    `[ingestion] refreshed ${result.projectsUpserted} projects / ${result.developersUpserted} developers`,
  );
}

function arm(reason: string) {
  const wait = msUntilNextMidnightIST();
  const hours = (wait / 36e5).toFixed(2);
  console.log(`[ingestion] next midnight IST refresh in ${hours}h (${reason})`);
  globalForSchedule.propertyRadarRefreshTimer = setTimeout(() => {
    void fireRefresh("midnight IST")
      .catch((error) => {
        console.error("[ingestion] midnight refresh failed", error);
      })
      .finally(() => arm("reschedule"));
  }, wait);
  globalForSchedule.propertyRadarRefreshTimer.unref?.();
}

export function startMidnightRefresh() {
  if (process.env.INGEST_SCHEDULE === "0") return;
  if (globalForSchedule.propertyRadarRefreshTimer) return;
  arm("scheduler start");
}
