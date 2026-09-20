# Property Radar

Search-first due-diligence for **Bengaluru / Karnataka RERA** projects. Type a project, developer, or RERA ID and open a public report card. Informational only — not legal or financial advice.

This MVP ships with seeded data. Live government-portal scraping is intentionally **not** included (see `src/ingestion/README.md`).

## Quick start

```bash
npm install
npm run dev
```

`npm run dev` generates Prisma Client, creates a local SQLite database (`prisma/dev.db`) if needed, seeds ~80 Bengaluru projects when the database is empty, then starts [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Ensure DB + seed if empty + Next.js (Turbopack) |
| `npm run setup` | Prisma generate, `db push`, seed if empty |
| `npm run db:seed` | Re-run seed (**wipes** projects/reviews/flags) |
| `npm run db:reset` | Recreate schema and seed |
| `npm run build` | Production build (also ensures DB) |
| `npm start` | Serve the production build |

## Environment

Copy `.env.example` to `.env` (done automatically on first `dev` if missing):

```
DATABASE_URL="file:./dev.db"
```

SQLite path is relative to `prisma/schema.prisma`, so the file is `prisma/dev.db`.

Optional:

```
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Used for canonical URLs, sitemap, and Open Graph `metadataBase`.

To use Postgres later, point `DATABASE_URL` at Postgres and change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`, then `npx prisma db push` and `npm run db:seed`.

## What you can do in the MVP

- Search projects, developers, and Karnataka-style RERA IDs
- Open `/projects/[slug]` report cards (shareable URL + OG image)
- Read RERA status/validity, promised vs actual possession, litigation/consumer-court flags
- See the developer’s other projects and crowd star reviews / red flags
- Submit **anonymous** reviews and structured red flags (delay, quality, litigation, misrepresentation)
- Upvote flags; proof upload is a **stub** (filename stored, file not uploaded)
- `/leaderboard` — most delayed and highest rated in the Bengaluru seed
- Disclaimer on every report: informational only, verify independently

Opinions (reviews, red flags) are labelled separately from structured record fields.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Prisma, SQLite.
