# Ingestion (out of scope for MVP)

Live Karnataka RERA / government-portal scraping is **not** implemented.

This folder is the intended home for a later isolated pipeline:

- Fetch public RERA records (registration, validity, promoter, dates)
- Normalize into `Developer` / `Project` rows
- Stamp `lastVerifiedAt`
- Never mix scraped public-record fields with crowdsourced opinions

Until that lands, the app is driven entirely by `prisma/seed.ts` plus in-app reviews and red flags.
