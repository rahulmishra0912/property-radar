export const BRAND = "PropertyRadar";
export const TAGLINE = "Real estate due-diligence platform";
export const CITY = "Bengaluru";
export const STATE = "Karnataka";

export const RED_FLAG_CATEGORIES = [
  { value: "DELAY", label: "Delay" },
  { value: "QUALITY", label: "Quality" },
  { value: "LITIGATION", label: "Litigation" },
  { value: "MISREPRESENTATION", label: "Misrepresentation" },
] as const;

export type RedFlagCategory = (typeof RED_FLAG_CATEGORIES)[number]["value"];

export const PROJECT_TYPES: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  PLOTTED: "Plotted",
  MIXED: "Mixed-use",
};

export const RERA_STATUS_LABEL: Record<string, string> = {
  REGISTERED: "Registered",
  EXTENDED: "Extended",
  LAPSED: "Lapsed",
  EXPIRED: "Expired",
  REVOKED: "Revoked",
  UNVERIFIED: "Unverified",
};

export const DISCLAIMER =
  "Informational only — not legal or financial advice. Verify independently on Karnataka RERA and other public records before you act.";

export const SEARCH_HINTS = ["Brigade", "Prestige", "Sobha", "Whitefield"] as const;
