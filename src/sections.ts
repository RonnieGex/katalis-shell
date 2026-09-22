export const SECTION_LABELS = {
  home: "Inicio",
  crm: "CRM",
  social: "Redes sociales",
  replies: "Respuestas Instagram",
  mail: "Correo",
  ads: "Ads",
  settings: "Configuración",
} as const;

export type SectionId = keyof typeof SECTION_LABELS;
export type KatalisLinks = Record<SectionId, string>;
export type KatalisSection = { id: SectionId; label: string; href: string };

export const OPERATIONAL_SECTION_IDS = [
  "home",
  "crm",
  "social",
  "replies",
  "mail",
  "settings",
] as const satisfies readonly SectionId[];

export type CreateSectionsOptions = {
  visibleSections?: readonly SectionId[];
};

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

/**
 * Fija el negocio en un destino con URL y URLSearchParams. `set` deja una sola
 * ocurrencia y conserva los demás parámetros y el fragmento. Una entrada vacía
 * no sustituye el negocio que el destino ya llevaba; `all` viaja explícito,
 * porque quien lee consulta el almacenamiento local cuando falta el parámetro.
 */
function setBusiness(url: URL, businessId?: string): void {
  if (!businessId) return;
  url.searchParams.set("negocio", businessId);
}

export function createSections(
  links: KatalisLinks,
  businessId?: string,
  options?: CreateSectionsOptions,
): KatalisSection[] {
  const canonical = Object.keys(SECTION_LABELS) as SectionId[];
  const visible = options?.visibleSections
    ? canonical.filter((id) => options.visibleSections?.includes(id))
    : canonical;
  return visible.map((id) => {
    const href = links[id];
    if (href === "#") return { id, label: SECTION_LABELS[id], href };
    const url = new URL(href);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error(`El enlace de ${SECTION_LABELS[id]} debe usar HTTP o HTTPS.`);
    }
    setBusiness(url, businessId);
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
  setBusiness(url, businessId);
  return url.href;
}

export function businessSelectionValue(raw: string, catalog: BusinessCatalog): string {
  const legacy: Record<string, string> = { "rock-and-jewel": "biz-rock-and-jewel", dental: "biz-dental", "katalis-lab": "biz-katalis-lab" };
  const candidate = legacy[raw];
  return candidate && catalog.options.some(option => option.id === candidate) ? candidate : raw;
}
