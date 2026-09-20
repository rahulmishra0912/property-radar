# Property Radar

Search-first due-diligence for **Bengaluru / Karnataka RERA** projects. Type a project, developer, or RERA ID and open a public report card. Informational only — not legal or financial advice.

Coverage starts with large Bengaluru promoters (Brigade, Prestige, Sobha, Sumadhura, Godrej, Salarpuria Sattva, and peers). Structured fields refresh from a builder catalog every night at midnight IST. Live government-portal scraping is **not** included (see `src/ingestion/README.md`).

## Quick start

```bash
npm install
npm run dev
```

`npm run dev` generates Prisma Client, creates a local SQLite database (`prisma/dev.db`) if needed, seeds the Bengaluru catalog when the database is empty (or upserts it when projects already exist), then starts [http://localhost:3000](http://localhost:3000).

If you already had the older fictional seed, run `npm run db:reset` once so search is only the catalogued builders.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Ensure DB + catalog refresh + Next.js (Turbopack). Midnight IST timer starts with the server. |
| `npm run setup` | Prisma generate, `db push`, seed if empty otherwise catalog refresh |
| `npm run db:seed` | Re-run seed (**wipes** projects/reviews/flags, reloads catalog) |
| `npm run db:refresh` | Upsert catalog and recompute delays — **keeps** reviews and red flags |
| `npm run db:reset` | Recreate schema and seed |
| `npm run build` | Production build (also ensures DB) |
| `npm start` | Serve the production build (midnight refresh stays armed) |

## Environment

Copy `.env.example` to `.env` (done automatically on first `dev` if missing):

```
DATABASE_URL="file:./dev.db"
```

SQLite path is relative to `prisma/schema.prisma`, so the file is `prisma/dev.db`.

Optional:

```
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
INGEST_SCHEDULE=0
CRON_SECRET="replace-me"
```

`NEXT_PUBLIC_SITE_URL` is used for canonical URLs, sitemap, and Open Graph `metadataBase`. `INGEST_SCHEDULE=0` turns off the in-process midnight timer. `CRON_SECRET` protects `GET`/`POST /api/ingestion/run` in production (Vercel Cron hits that path at 00:00 IST).

To use Postgres later, point `DATABASE_URL` at Postgres and change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`, then `npx prisma db push` and `npm run db:seed`.

## What you can do in the MVP

- Search projects, developers, and catalog / RERA-style IDs
- Open `/projects/[slug]` report cards (shareable URL + OG image)
- Read catalogued status/validity, promised vs actual possession, delay vs today
- See the developer’s other projects and crowd star reviews / red flags
- Submit **anonymous** reviews and structured red flags (delay, quality, litigation, misrepresentation)
- Upvote flags; proof upload is a **stub** (filename stored, file not uploaded)
- `/leaderboard` — most delayed and highest rated in the Bengaluru catalog
- Disclaimer on every report: informational only, verify independently

Opinions (reviews, red flags) are labelled separately from structured record fields. Catalog RERA placeholders begin with `UNVERIFIED/` until a public-record adapter is added.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Prisma, SQLite.
