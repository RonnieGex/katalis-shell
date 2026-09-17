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
export declare const ALL_BUSINESSES = "all";
export declare const NO_BUSINESS = "none";
export declare const LEGACY_ORBITA = "orbita";
export declare const RESERVED_BUSINESS_IDS: readonly string[];
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
export declare function createSections(links: KatalisLinks, businessId?: string): KatalisSection[];
/**
 * Fallback for consumers that do not provide a catalog yet. Business identity
 * lives in the CRM; nothing new should depend on these ids.
 */
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
export declare function catalogIds(catalog: BusinessCatalog): string[];
export declare function isSelectableBusinessId(value: string | null | undefined, catalog: BusinessCatalog): boolean;
export declare function selectionState(value: string, catalog: BusinessCatalog): BusinessSelectionState;
export declare function openReplyContactsHref(crmWorkspaceUrl: string, businessId?: string): string;
