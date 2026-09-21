export const SECTION_LABELS = {
  home: "Inicio",
  crm: "CRM",
  social: "Social",
  replies: "Respuestas IG",
  mail: "Correo",
  ads: "Ads",
  settings: "Configuración",
} as const;

export type SectionId = keyof typeof SECTION_LABELS;
export type KatalisLinks = Record<SectionId, string>;
export type KatalisSection = { id: SectionId; label: string; href: string };

export const ALL_BUSINESSES = "all";
export const NO_BUSINESS = "none";
export const LEGACY_ORBITA = "orbita";

export const RESERVED_BUSINESS_IDS: readonly string[] = [ALL_BUSINESSES, NO_BUSINESS];

export type BusinessOption = {
  id: string;
  label: string;
  groupId?: string;
  groupLabel?: string;
};

/**
 * Business identity lives in the CRM, so an id is any string the catalog
 * returns. Kept as an alias for consumers that still import the old name.
 */
export type BusinessId = string;

export type BusinessGroupOption = {
  id: string;
  label: string;
};

export type BusinessCatalog = {
  options: readonly BusinessOption[];
  groups?: readonly BusinessGroupOption[];
};

export type BusinessSelectionState = "all" | "business" | "legacy-union" | "invalid" | "unavailable";

export function createSections(links: KatalisLinks, businessId?: string): KatalisSection[] {
  return (Object.keys(SECTION_LABELS) as SectionId[]).map((id) => {
    const href = links[id];
    if (href === "#") return { id, label: SECTION_LABELS[id], href };
    const url = new URL(href);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error(`El enlace de ${SECTION_LABELS[id]} debe usar HTTP o HTTPS.`);
    }
    if (businessId && businessId !== ALL_BUSINESSES) url.searchParams.set("negocio", businessId);
    return { id, label: SECTION_LABELS[id], href: url.href };
  });
}

/**
 * Fallback for consumers that do not provide a catalog yet. Business identity
 * lives in the CRM; nothing new should depend on these ids.
 */
export const KATALIS_BUSINESSES = [
  { id: ALL_BUSINESSES, label: "Todos los negocios" },
  { id: "orbita", label: "Órbita" },
  { id: "rock-and-jewel", label: "Rock & Jewel" },
  { id: "dental", label: "Dental" },
  { id: "katalis-lab", label: "Katalis Lab" },
] as const;

export function catalogIds(catalog: BusinessCatalog): string[] {
  return [ALL_BUSINESSES, ...catalog.options.map((option) => option.id)];
}

export function isSelectableBusinessId(value: string | null | undefined, catalog: BusinessCatalog): boolean {
  if (!value) return false;
  return catalogIds(catalog).includes(value);
}

export function selectionState(value: string, catalog: BusinessCatalog): BusinessSelectionState {
  if (catalog.options.length === 0) return value === ALL_BUSINESSES ? "unavailable" : "invalid";
  if (value === ALL_BUSINESSES) return "all";
  if (value === LEGACY_ORBITA) return "legacy-union";
  return catalog.options.some((option) => option.id === value) ? "business" : "invalid";
}

export function openReplyContactsHref(crmWorkspaceUrl: string, businessId?: string): string {
  const url = new URL(crmWorkspaceUrl);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("El CRM debe usar HTTP o HTTPS.");
  url.pathname = `${url.pathname.replace(/\/$/, "")}/contacts`;
  url.searchParams.set("source", "OPENREPLY");
  if (businessId && businessId !== ALL_BUSINESSES) url.searchParams.set("negocio", businessId);
  return url.href;
}

export function businessSelectionValue(raw: string, catalog: BusinessCatalog): string {
  const legacy: Record<string, string> = { "rock-and-jewel": "biz-rock-and-jewel", dental: "biz-dental", "katalis-lab": "biz-katalis-lab" };
  const candidate = legacy[raw];
  return candidate && catalog.options.some(option => option.id === candidate) ? candidate : raw;
}
