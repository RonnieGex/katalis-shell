export const SECTION_LABELS = {
    home: "Inicio",
    crm: "CRM",
    social: "Social",
    replies: "Respuestas IG",
    ads: "Ads",
    settings: "Configuración",
};
export function createSections(links, businessId) {
    return Object.keys(SECTION_LABELS).map((id) => {
        const href = links[id];
        if (href === "#")
            return { id, label: SECTION_LABELS[id], href };
        const url = new URL(href);
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            throw new Error(`El enlace de ${SECTION_LABELS[id]} debe usar HTTP o HTTPS.`);
        }
        if (businessId)
            url.searchParams.set("negocio", businessId);
        return { id, label: SECTION_LABELS[id], href: url.href };
    });
}
export const KATALIS_BUSINESSES = [
    { id: "all", label: "Todos los negocios" },
    { id: "orbita", label: "Órbita" },
    { id: "rock-and-jewel", label: "Rock & Jewel" },
    { id: "dental", label: "Dental" },
    { id: "katalis-lab", label: "Katalis Lab" },
];
export function openReplyContactsHref(crmWorkspaceUrl, businessId) {
    const url = new URL(crmWorkspaceUrl);
    if (!["https:", "http:"].includes(url.protocol))
        throw new Error("El CRM debe usar HTTP o HTTPS.");
    url.pathname = `${url.pathname.replace(/\/$/, "")}/contacts`;
    url.searchParams.set("source", "OPENREPLY");
    if (businessId)
        url.searchParams.set("negocio", businessId);
    return url.href;
}
