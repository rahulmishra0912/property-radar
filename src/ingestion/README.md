# Ingestion

Structured project fields are refreshed from a **Bengaluru builder catalog**, not from live Karnataka RERA scraping.

The pipeline:

1. Load `src/ingestion/catalog/builders.ts` (Brigade, Prestige, Sobha, Sumadhura, Godrej, Salarpuria Sattva, Embassy, Puravankara, Assetz, Shriram, Total Environment, Mantri).
2. Upsert `Developer` / `Project` rows by `externalKey`.
3. Recalculate `delayMonths` and time-based RERA status vs today.
4. Stamp `lastVerifiedAt` and write an `IngestionRun` row.
5. **Never** insert, update, or delete reviews or red flags.

RERA numbers in the catalog use `UNVERIFIED/KA/...` until a real public-record adapter is plugged in. Do not treat those strings as Karnataka RERA IDs.

## Schedule

- **Midnight IST** while the Next.js server is running (`src/instrumentation.ts`).
- **On `npm run dev` / `npm run build`** via `scripts/ensure-db.ts` (upsert if the DB already has projects).
- **Manual:** `npm run db:refresh`
- **HTTP:** `GET`/`POST` `/api/ingestion/run` (Bearer `CRON_SECRET` in production).
- **Vercel Cron:** `30 18 * * *` UTC (= 00:00 IST) in `vercel.json`.

Set `INGEST_SCHEDULE=0` to disable the in-process midnight timer. Set `CRON_SECRET` in production.

## Adding a live source later

Keep crowd opinions isolated. A future adapter should only write structured record fields (`reraId`, dates, status, units) and must use a documented public API or an authorised data dump — not ad-hoc government-portal scraping.
