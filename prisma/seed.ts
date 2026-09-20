import { PrismaClient } from "@prisma/client";
import { syncBengaluruCatalog } from "../src/ingestion/sync";

const prisma = new PrismaClient();

const GOOD_REVIEWS = [
  {
    rating: 5,
    title: "Possession on the promised quarter",
    body: "We got keys within the window in the allotment letter. Clubhouse was unfinished but the apartment was livable. Society formed without drama.",
  },
  {
    rating: 4,
    title: "Decent build, slow amenities",
    body: "Flat quality is acceptable for the price band. Lifts and power backup work. Kids’ play area came six months after move-in. No major RERA surprises.",
  },
];

const MIXED_REVIEWS = [
  {
    rating: 3,
    title: "Keys delayed, snag list ignored",
    body: "Took extra months beyond the agreement date. Plumbing snags took three visits. Sales team stopped answering after 80% payment.",
  },
  {
    rating: 3,
    title: "Brochure vs reality on carpet",
    body: "Usable carpet feels tighter than the walkthrough. Parking allotment was reshuffled. Not a scam, but sales pitch was optimistic.",
  },
];

const BAD_REVIEWS = [
  {
    rating: 1,
    title: "Still waiting after two years",
    body: "Promised possession has lapsed by a wide margin. Site work is intermittent. Several allottees discussing consumer court. Verify independently.",
  },
  {
    rating: 2,
    title: "Quality issues after handover",
    body: "Seepage in monsoon, cracks in bathroom dado, and delayed OC talk. Association is chasing the promoter for waterproofing.",
  },
];

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, items: T[]): T {
  return items[Math.floor(rand() * items.length)]!;
}

async function attachDemoOpinions() {
  const projects = await prisma.project.findMany({ orderBy: { slug: "asc" } });
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]!;
    const rand = mulberry32(2000 + i * 17);
    const reviewPool =
      project.delayMonths >= 18 ? BAD_REVIEWS : project.delayMonths >= 8 ? MIXED_REVIEWS : GOOD_REVIEWS;
    const extra = project.delayMonths >= 12 ? MIXED_REVIEWS : GOOD_REVIEWS;
    const reviewCount = 2 + Math.floor(rand() * 2);
    for (let r = 0; r < reviewCount; r++) {
      const src = r === 0 ? pick(rand, reviewPool) : pick(rand, extra);
      await prisma.review.create({
        data: {
          projectId: project.id,
          rating: src.rating,
          title: src.title,
          body: src.body,
          author: pick(rand, [
            "Anonymous homebuyer",
            "Anonymous allottee",
            "Whitefield resident (anon)",
            "First-time buyer (anon)",
          ]),
          createdAt: new Date(Date.UTC(2025, Math.floor(rand() * 10), 2 + Math.floor(rand() * 26))),
        },
      });
    }

    if (project.delayMonths >= 8) {
      await prisma.redFlag.create({
        data: {
          projectId: project.id,
          category: "DELAY",
          title: `${project.delayMonths}-month slip vs promised possession`,
          body: `Crowd signal that handover moved past the catalogued promised window. Confirm on the agreement of sale and Karnataka RERA before you act.`,
          upvotes: 4 + Math.floor(rand() * 36),
          proofLabel: rand() > 0.6 ? "Allotment letter photo (not stored)" : null,
          createdAt: new Date(Date.UTC(2025, 6, 8)),
        },
      });
    }
  }
}

async function main() {
  await prisma.redFlag.deleteMany();
  await prisma.review.deleteMany();
  await prisma.project.deleteMany();
  await prisma.developer.deleteMany();
  await prisma.ingestionRun.deleteMany();

  const synced = await syncBengaluruCatalog(prisma);
  await attachDemoOpinions();

  const counts = {
    ...synced,
    reviews: await prisma.review.count(),
    redFlags: await prisma.redFlag.count(),
  };
  console.log("Seeded Bengaluru catalog", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
