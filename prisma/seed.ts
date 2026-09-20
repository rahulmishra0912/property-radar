import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEVELOPERS = [
  {
    slug: "meridian-spaces",
    name: "Meridian Spaces Pvt Ltd",
    shortName: "Meridian",
    foundedYear: 2006,
    summary:
      "Mid-to-large Bengaluru promoter known for Whitefield and Hebbal apartments. Relatively cleaner possession record in this seed set.",
    track: "strong" as const,
  },
  {
    slug: "greenline-estates",
    name: "Greenline Estates",
    shortName: "Greenline",
    foundedYear: 2011,
    summary:
      "Volume builder on Sarjapur and Electronic City corridors. Mixed delivery; a few projects show 8–14 month slips.",
    track: "mixed" as const,
  },
  {
    slug: "summit-realty",
    name: "Summit Realty Limited",
    shortName: "Summit",
    foundedYear: 2004,
    summary:
      "Aggressive launch cadence, weaker delivery. Multiple seed projects show 18–36 month delays and consumer-court flags.",
    track: "weak" as const,
  },
  {
    slug: "navaaka-developers",
    name: "Navaaka Developers",
    shortName: "Navaaka",
    foundedYear: 2013,
    summary:
      "North Bengaluru specialist (Yelahanka, Devanahalli). Mostly on-track plotted and mid-rise inventory in this dataset.",
    track: "strong" as const,
  },
  {
    slug: "lotus-habitat",
    name: "Lotus Habitat",
    shortName: "Lotus",
    foundedYear: 2009,
    summary:
      "Premium positioning around HSR, Koramangala-adjacent and Bellandur. Quality complaints appear more than delay flags.",
    track: "mixed" as const,
  },
  {
    slug: "arka-infra",
    name: "Arka Infra Projects",
    shortName: "Arka",
    foundedYear: 2015,
    summary:
      "Younger promoter with several first-time launches. RERA validity needs watching on older registrations.",
    track: "mixed" as const,
  },
  {
    slug: "bluepeak-builders",
    name: "BluePeak Builders",
    shortName: "BluePeak",
    foundedYear: 2008,
    summary:
      "West Bengaluru (Kengeri, RR Nagar, Magadi Road). Uneven after-sales; a couple of litigation flags in seed data.",
    track: "weak" as const,
  },
  {
    slug: "surya-urban",
    name: "Surya Urban Homes",
    shortName: "Surya",
    foundedYear: 2012,
    summary:
      "Affordable apartments on Hosur and Bannerghatta roads. On-time more often than peers in this seed.",
    track: "strong" as const,
  },
  {
    slug: "vistara-homes",
    name: "Vistara Homes",
    shortName: "Vistara",
    foundedYear: 2010,
    summary:
      "High-rise towers in Marathahalli and Kadugodi. Some OC delays even when structure is complete.",
    track: "mixed" as const,
  },
  {
    slug: "cedar-grove-projects",
    name: "Cedar Grove Projects",
    shortName: "Cedar Grove",
    foundedYear: 2014,
    summary:
      "Low-density villas on Kanakapura and Jigani. Quiet reputation; limited public-record flags in seed.",
    track: "strong" as const,
  },
  {
    slug: "kaveri-constructions",
    name: "Kaveri Constructions",
    shortName: "Kaveri",
    foundedYear: 2001,
    summary:
      "Older promoter with a long Bengaluru footprint. Several legacy projects show lapsed RERA or long delays.",
    track: "weak" as const,
  },
  {
    slug: "orion-landmarks",
    name: "Orion Landmarks",
    shortName: "Orion",
    foundedYear: 2016,
    summary:
      "Mixed-use and plotted near Devanahalli airport belt. Newer book; still thin review history.",
    track: "mixed" as const,
  },
  {
    slug: "prakriti-living",
    name: "Prakriti Living",
    shortName: "Prakriti",
    foundedYear: 2017,
    summary:
      "Sustainability-marketed mid-rise. Possession mostly on calendar; watch amenity over-promising in reviews.",
    track: "strong" as const,
  },
  {
    slug: "eastwind-properties",
    name: "Eastwind Properties",
    shortName: "Eastwind",
    foundedYear: 2007,
    summary:
      "East Bengaluru (Whitefield, Varthur, Budigere). A few consumer-court matters tagged in seed records.",
    track: "mixed" as const,
  },
  {
    slug: "ananta-spaces",
    name: "Ananta Spaces",
    shortName: "Ananta",
    foundedYear: 2018,
    summary:
      "First-time buyers’ inventory in Hormavu and Hennur. Limited track record — treat ratings as early signal only.",
    track: "mixed" as const,
  },
  {
    slug: "ridgewell-developers",
    name: "Ridgewell Developers",
    shortName: "Ridgewell",
    foundedYear: 2005,
    summary:
      "Repeated delay and litigation flags across this seed. Highest-risk promoter on the Bengaluru leaderboard.",
    track: "weak" as const,
  },
];

const LOCALITIES = [
  "Whitefield",
  "Sarjapur Road",
  "Electronic City",
  "Hebbal",
  "Yelahanka",
  "Kanakapura Road",
  "Hennur",
  "KR Puram",
  "Marathahalli",
  "Bellandur",
  "Thanisandra",
  "Devanahalli",
  "Bannerghatta Road",
  "HSR Layout",
  "Kadugodi",
  "Budigere Cross",
  "Kengeri",
  "RR Nagar",
  "Jigani",
  "Hormavu",
];

const SUFFIXES = ["Residences", "Heights", "Park", "Towers", "Enclave"];
const TYPES = ["APARTMENT", "APARTMENT", "APARTMENT", "VILLA", "PLOTTED"] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

function reraId(index: number) {
  const office = 1251;
  const dist = 300 + (index % 80);
  const yy = 17 + (index % 8);
  const serial = String(100000 + index * 17).slice(1);
  return `PRM/KA/RERA/${office}/${dist}/PR/${yy}${String(100 + (index % 50)).slice(1)}/${serial}`;
}

type Track = "strong" | "mixed" | "weak";

function delayFor(track: Track, slot: number, rand: () => number) {
  if (track === "strong") return [0, 0, 2, 5, 9][slot]!;
  if (track === "mixed") return [0, 6, 11, 16, 22][slot]! + Math.floor(rand() * 3);
  return [8, 14, 20, 28, 38][slot]! + Math.floor(rand() * 4);
}

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
  {
    rating: 5,
    title: "Transparent about delay of a few weeks",
    body: "Builder messaged the association before the original date slipped. Compensation was small but communication was better than neighbours’ projects.",
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
  {
    rating: 2,
    title: "RERA date extended quietly",
    body: "Found the extension on the public record after we had already paid a milestone. Would have waited if we had checked earlier.",
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
  {
    rating: 1,
    title: "Mis-sold facing and floor",
    body: "We were shown a different stack. Agreement fine print did not match the sample flat tour. Raising it as misrepresentation, not legal advice.",
  },
];

async function main() {
  await prisma.redFlag.deleteMany();
  await prisma.review.deleteMany();
  await prisma.project.deleteMany();
  await prisma.developer.deleteMany();

  const createdDevelopers = [];
  for (const d of DEVELOPERS) {
    const row = await prisma.developer.create({
      data: {
        slug: d.slug,
        name: d.name,
        shortName: d.shortName,
        foundedYear: d.foundedYear,
        summary: d.summary,
        city: "Bengaluru",
      },
    });
    createdDevelopers.push({ ...row, track: d.track });
  }

  let index = 0;
  for (let di = 0; di < createdDevelopers.length; di++) {
    const developer = createdDevelopers[di]!;
    for (let slot = 0; slot < 5; slot++) {
      const rand = mulberry32(1000 + index * 97);
      const locality = LOCALITIES[(di * 3 + slot) % LOCALITIES.length]!;
      const suffix = SUFFIXES[slot]!;
      const name = `${developer.shortName} ${locality} ${suffix}`;
      const delayMonths = delayFor(developer.track, slot, rand);
      const projectType = TYPES[slot]!;
      const units =
        projectType === "VILLA"
          ? 40 + Math.floor(rand() * 50)
          : projectType === "PLOTTED"
            ? 80 + Math.floor(rand() * 120)
            : 120 + Math.floor(rand() * 280);

      const promisedYear = 2021 + (slot % 5);
      const promisedMonth = (index * 2) % 12;
      const promisedPossession = new Date(Date.UTC(promisedYear, promisedMonth, 28));
      const lastVerifiedAt = new Date(Date.UTC(2026, 8, 12));

      let actualPossession: Date | null = null;
      if (delayMonths === 0 && promisedPossession < lastVerifiedAt) {
        actualPossession = promisedPossession;
      } else if (delayMonths > 0 && delayMonths < 10 && promisedYear <= 2024) {
        const actual = new Date(promisedPossession);
        actual.setUTCMonth(actual.getUTCMonth() + delayMonths);
        if (actual < lastVerifiedAt) actualPossession = actual;
      }

      const registeredOn = new Date(Date.UTC(promisedYear - 3, (slot * 3) % 12, 10));
      let validUntil = new Date(registeredOn);
      validUntil.setUTCFullYear(validUntil.getUTCFullYear() + 5);

      let reraStatus = "REGISTERED";
      if (delayMonths >= 30) {
        reraStatus = "LAPSED";
        validUntil = new Date(Date.UTC(2024, 3, 30));
      } else if (validUntil < lastVerifiedAt && delayMonths >= 12) {
        reraStatus = "EXPIRED";
      } else if (delayMonths >= 16 && developer.track !== "strong") {
        reraStatus = "EXTENDED";
        validUntil = new Date(Date.UTC(2027, 5, 30));
      } else if (developer.track === "weak" && slot === 4 && rand() > 0.55) {
        reraStatus = "REVOKED";
      }

      const litigationFlag =
        developer.track === "weak" && delayMonths >= 18
          ? true
          : developer.track === "mixed" && delayMonths >= 20;
      const consumerCourtFlag = litigationFlag && delayMonths >= 22;

      const project = await prisma.project.create({
        data: {
          slug: slugify(name),
          name,
          locality,
          reraId: reraId(index),
          reraStatus,
          registeredOn,
          validUntil,
          promisedPossession,
          actualPossession,
          delayMonths,
          litigationFlag,
          consumerCourtFlag,
          projectType,
          totalUnits: units,
          lastVerifiedAt,
          developerId: developer.id,
        },
      });

      const reviewPool =
        delayMonths >= 18 ? BAD_REVIEWS : delayMonths >= 8 ? MIXED_REVIEWS : GOOD_REVIEWS;
      const extra = delayMonths >= 12 ? MIXED_REVIEWS : GOOD_REVIEWS;
      const reviewCount = 2 + Math.floor(rand() * 3);
      for (let r = 0; r < reviewCount; r++) {
        const src = r === 0 ? pick(rand, reviewPool) : pick(rand, extra);
        const createdAt = new Date(
          Date.UTC(2025, Math.floor(rand() * 10), 2 + Math.floor(rand() * 26)),
        );
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
            createdAt,
          },
        });
      }

      if (delayMonths >= 8) {
        await prisma.redFlag.create({
          data: {
            projectId: project.id,
            category: "DELAY",
            title: `${delayMonths}-month slip vs promised possession`,
            body: `Allottees report handover moving past the date in the agreement of sale. Seeded as a crowd signal, not a court finding. Promised window was ${promisedPossession.toISOString().slice(0, 7)}.`,
            upvotes: 4 + Math.floor(rand() * 36),
            proofLabel: rand() > 0.6 ? "Allotment letter photo (not stored in MVP)" : null,
            createdAt: new Date(Date.UTC(2025, 6, 8)),
          },
        });
      }
      if (litigationFlag) {
        await prisma.redFlag.create({
          data: {
            projectId: project.id,
            category: "LITIGATION",
            title: "Litigation / dispute flag on public-record style notes",
            body: "This seed marks a litigation flag for demo due-diligence. Confirm case status on district court / RERA / NCDRC portals before you act.",
            upvotes: 10 + Math.floor(rand() * 28),
            createdAt: new Date(Date.UTC(2025, 8, 2)),
          },
        });
      }
      if (developer.track !== "strong" && slot === 3) {
        await prisma.redFlag.create({
          data: {
            projectId: project.id,
            category: "QUALITY",
            title: "Snags and seepage after fit-out",
            body: "Crowd notes mention bathroom seepage and unresolved snag lists. Opinion of reviewers — inspect the stack in monsoon if you can.",
            upvotes: 3 + Math.floor(rand() * 18),
            createdAt: new Date(Date.UTC(2026, 1, 14)),
          },
        });
      }
      if (developer.track === "weak" && slot >= 3) {
        await prisma.redFlag.create({
          data: {
            projectId: project.id,
            category: "MISREPRESENTATION",
            title: "Amenities in brochure not delivered",
            body: "Reviewers say the clubhouse / sky deck / extra car park shown in walkthroughs did not match the final common areas.",
            upvotes: 6 + Math.floor(rand() * 22),
            createdAt: new Date(Date.UTC(2026, 3, 4)),
          },
        });
      }

      index += 1;
    }
  }

  const counts = {
    developers: await prisma.developer.count(),
    projects: await prisma.project.count(),
    reviews: await prisma.review.count(),
    redFlags: await prisma.redFlag.count(),
  };
  console.log("Seeded", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
