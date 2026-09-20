export type CatalogReraStatus =
  | "REGISTERED"
  | "EXTENDED"
  | "LAPSED"
  | "EXPIRED"
  | "REVOKED"
  | "UNVERIFIED";

export type CatalogProjectType = "APARTMENT" | "VILLA" | "PLOTTED" | "MIXED";

export type CatalogDeveloper = {
  slug: string;
  name: string;
  shortName: string;
  foundedYear: number;
  summary: string;
};

export type CatalogProject = {
  /** Stable id for upserts. Never change once shipped. */
  key: string;
  slug: string;
  name: string;
  locality: string;
  developerSlug: string;
  projectType: CatalogProjectType;
  totalUnits?: number;
  /** Catalog snapshot of Karnataka RERA id when known; otherwise UNVERIFIED/KA/... */
  reraId: string;
  reraStatus: CatalogReraStatus;
  registeredOn: string;
  validUntil: string;
  promisedPossession: string;
  actualPossession?: string | null;
  litigationFlag?: boolean;
  consumerCourtFlag?: boolean;
};

export type SyncResult = {
  source: string;
  developersUpserted: number;
  projectsUpserted: number;
};
