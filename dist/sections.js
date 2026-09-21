export const SECTION_LABELS = {
    home: "Inicio",
    crm: "CRM",
    social: "Social",
    replies: "Respuestas IG",
    mail: "Correo",
    ads: "Ads",
    settings: "Configuración",
};
export const ALL_BUSINESSES = "all";
export const NO_BUSINESS = "none";
export const LEGACY_ORBITA = "orbita";
export const RESERVED_BUSINESS_IDS = [ALL_BUSINESSES, NO_BUSINESS];
export function createSections(links, businessId) {
    return Object.keys(SECTION_LABELS).map((id) => {
        const href = links[id];
        if (href === "#")
            return { id, label: SECTION_LABELS[id], href };
        const url = new URL(href);
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            throw new Error(`El enlace de ${SECTION_LABELS[id]} debe usar HTTP o HTTPS.`);
        }
        if (businessId && businessId !== ALL_BUSINESSES)
            url.searchParams.set("negocio", businessId);
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
];
export function catalogIds(catalog) {
    return [ALL_BUSINESSES, ...catalog.options.map((option) => option.id)];
}
export function isSelectableBusinessId(value, catalog) {
    if (!value)
        return false;
    return catalogIds(catalog).includes(value);
}
export function selectionState(value, catalog) {
    if (catalog.options.length === 0)
        return value === ALL_BUSINESSES ? "unavailable" : "invalid";
    if (value === ALL_BUSINESSES)
        return "all";
    if (value === LEGACY_ORBITA)
        return "legacy-union";
    return catalog.options.some((option) => option.id === value) ? "business" : "invalid";
}
export function openReplyContactsHref(crmWorkspaceUrl, businessId) {
    const url = new URL(crmWorkspaceUrl);
    if (!["https:", "http:"].includes(url.protocol))
        throw new Error("El CRM debe usar HTTP o HTTPS.");
    url.pathname = `${url.pathname.replace(/\/$/, "")}/contacts`;
    url.searchParams.set("source", "OPENREPLY");
    if (businessId && businessId !== ALL_BUSINESSES)
        url.searchParams.set("negocio", businessId);
    return url.href;
}
export function businessSelectionValue(raw, catalog) {
    const legacy = { "rock-and-jewel": "biz-rock-and-jewel", dental: "biz-dental", "katalis-lab": "biz-katalis-lab" };
    const candidate = legacy[raw];
    return candidate && catalog.options.some(option => option.id === candidate) ? candidate : raw;
}
