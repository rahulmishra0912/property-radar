export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  const { startMidnightRefresh } = await import("./ingestion/schedule");
  startMidnightRefresh();
}
