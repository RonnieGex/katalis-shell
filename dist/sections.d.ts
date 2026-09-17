export declare const SECTION_LABELS: {
    readonly home: "Inicio";
    readonly crm: "CRM";
    readonly social: "Social";
    readonly replies: "Respuestas IG";
    readonly ads: "Ads";
    readonly settings: "Configuración";
};
export type SectionId = keyof typeof SECTION_LABELS;
export type KatalisLinks = Record<SectionId, string>;
export type KatalisSection = {
    id: SectionId;
    label: string;
    href: string;
};
export declare function createSections(links: KatalisLinks, businessId?: string): KatalisSection[];
export declare const KATALIS_BUSINESSES: readonly [{
    readonly id: "all";
    readonly label: "Todos los negocios";
}, {
    readonly id: "orbita";
    readonly label: "Órbita";
}, {
    readonly id: "rock-and-jewel";
    readonly label: "Rock & Jewel";
}, {
    readonly id: "dental";
    readonly label: "Dental";
}, {
    readonly id: "katalis-lab";
    readonly label: "Katalis Lab";
}];
export type BusinessId = (typeof KATALIS_BUSINESSES)[number]["id"];
export declare function openReplyContactsHref(crmWorkspaceUrl: string, businessId?: string): string;
