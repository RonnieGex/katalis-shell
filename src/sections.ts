export const SECTION_LABELS = {
  home: "Inicio",
  crm: "CRM",
  social: "Social",
  replies: "Respuestas IG",
  ads: "Ads",
  settings: "Configuración",
} as const;

export type SectionId = keyof typeof SECTION_LABELS;
export type KatalisLinks = Record<SectionId, string>;
export type KatalisSection = { id: SectionId; label: string; href: string };

export function createSections(links: KatalisLinks, businessId?: string): KatalisSection[] {
  return (Object.keys(SECTION_LABELS) as SectionId[]).map((id) => {
    const href = links[id];
    if (href === "#") return { id, label: SECTION_LABELS[id], href };
    const url = new URL(href);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error(`El enlace de ${SECTION_LABELS[id]} debe usar HTTP o HTTPS.`);
    }
    if (businessId) url.searchParams.set("negocio", businessId);
    return { id, label: SECTION_LABELS[id], href: url.href };
  });
}

export const KATALIS_BUSINESSES = [
  { id: "orbita", label: "Órbita" },
  { id: "rock-and-jewel", label: "Rock & Jewel" },
  { id: "dental", label: "Dental" },
  { id: "katalis-lab", label: "Katalis Lab" },
] as const;

export type BusinessId = (typeof KATALIS_BUSINESSES)[number]["id"];
