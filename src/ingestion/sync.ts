import { PrismaClient } from "@prisma/client";
import { BENGALURU_DEVELOPERS, BENGALURU_PROJECTS } from "./catalog/builders";
import { hydrateProjectDates } from "./derive";
import type { SyncResult } from "./types";

export const CATALOG_SOURCE = "BENGALURU_BUILDERS_CATALOG";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function syncBengaluruCatalog(
  prisma: PrismaClient,
  now = new Date(),
): Promise<SyncResult> {
  let developersUpserted = 0;
  let projectsUpserted = 0;

  const developerIds = new Map<string, string>();
  for (const developer of BENGALURU_DEVELOPERS) {
    const row = await prisma.developer.upsert({
      where: { slug: developer.slug },
      create: {
        slug: developer.slug,
        name: developer.name,
        shortName: developer.shortName,
        foundedYear: developer.foundedYear,
        summary: developer.summary,
        city: "Bengaluru",
      },
      update: {
        name: developer.name,
        shortName: developer.shortName,
        foundedYear: developer.foundedYear,
        summary: developer.summary,
        city: "Bengaluru",
      },
    });
    developerIds.set(developer.slug, row.id);
    developersUpserted += 1;
  }

  for (const project of BENGALURU_PROJECTS) {
    const developerId = developerIds.get(project.developerSlug);
    if (!developerId) {
      throw new Error(`Catalog project ${project.key} references missing developer ${project.developerSlug}`);
    }

    const dates = hydrateProjectDates(project, now);
    const slug = project.slug || slugify(project.name);
    const payload = {
      slug,
      name: project.name,
      locality: project.locality,
      city: "Bengaluru",
      state: "Karnataka",
      reraId: project.reraId,
      reraStatus: dates.reraStatus,
      registeredOn: dates.registeredOn,
      validUntil: dates.validUntil,
      promisedPossession: dates.promisedPossession,
      actualPossession: dates.actualPossession,
      delayMonths: dates.delayMonths,
      litigationFlag: project.litigationFlag ?? false,
      consumerCourtFlag: project.consumerCourtFlag ?? false,
      projectType: project.projectType,
      totalUnits: project.totalUnits ?? null,
      lastVerifiedAt: now,
      externalKey: project.key,
      source: CATALOG_SOURCE,
      developerId,
    };

    const existing =
      (await prisma.project.findUnique({ where: { externalKey: project.key } })) ??
      (await prisma.project.findUnique({ where: { slug } })) ??
      (await prisma.project.findUnique({ where: { reraId: project.reraId } }));

    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: {
          ...payload,
          slug: existing.slug,
        },
      });
    } else {
      await prisma.project.create({ data: payload });
    }
    projectsUpserted += 1;
  }

  return {
    source: CATALOG_SOURCE,
    developersUpserted,
    projectsUpserted,
  };
}

export async function runCatalogRefresh(prisma: PrismaClient, now = new Date()) {
  const run = await prisma.ingestionRun.create({
    data: {
      status: "RUNNING",
      source: CATALOG_SOURCE,
    },
  });

  try {
    const result = await syncBengaluruCatalog(prisma, now);
    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: "SUCCESS",
        finishedAt: new Date(),
        developersUpserted: result.developersUpserted,
        projectsUpserted: result.projectsUpserted,
      },
    });
    return { ok: true as const, ...result, runId: run.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        error: message.slice(0, 2000),
      },
    });
    throw error;
  }
}
