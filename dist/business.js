"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, } from "react";
import { ALL_BUSINESSES, isSelectableBusinessId, KATALIS_BUSINESSES, LEGACY_ORBITA, selectionState, businessSelectionValue, } from "./sections.js";
const STORAGE_KEY = "katalis.business";
const CATALOG_KEY = "katalis.businesses";
const CHANGE_EVENT = "katalis-business-change";
const DEFAULT_BUSINESS = ALL_BUSINESSES;
let selected = DEFAULT_BUSINESS;
let cachedCatalog = null;
const FALLBACK_CATALOG = {
    options: KATALIS_BUSINESSES.filter((business) => business.id !== ALL_BUSINESSES).map((business) => ({
        id: business.id,
        label: business.label,
    })),
};
function catalogFrom(value) {
    if (!value || typeof value !== "object")
        return null;
    const candidate = value;
    if (!Array.isArray(candidate.options))
        return null;
    const options = candidate.options
        .map((entry) => {
        if (!entry || typeof entry !== "object")
            return null;
        const option = entry;
        if (typeof option.id !== "string" || option.id === "" || typeof option.label !== "string")
            return null;
        return {
            id: option.id,
            label: option.label,
            ...(typeof option.groupId === "string" ? { groupId: option.groupId } : {}),
            ...(typeof option.groupLabel === "string" ? { groupLabel: option.groupLabel } : {}),
        };
    })
        .filter((option) => option !== null);
    if (options.length === 0)
        return null;
    return { options };
}
function readStoredCatalog() {
    if (cachedCatalog)
        return cachedCatalog;
    if (typeof window === "undefined")
        return null;
    try {
        const raw = window.localStorage.getItem(CATALOG_KEY);
        if (!raw)
            return null;
        cachedCatalog = catalogFrom(JSON.parse(raw));
        return cachedCatalog;
    }
    catch {
        return null;
    }
}
export function rememberBusinessCatalog(catalog) {
    cachedCatalog = catalog;
    if (typeof window === "undefined")
        return;
    try {
        if (catalog)
            window.localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
        else
            window.localStorage.removeItem(CATALOG_KEY);
    }
    catch { }
}
function readSelection() {
    const query = new URLSearchParams(window.location.search).get("negocio");
    if (query)
        return query;
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored)
            return stored;
    }
    catch { }
    return selected;
}
function subscribe(listener) {
    window.addEventListener(CHANGE_EVENT, listener);
    window.addEventListener("storage", listener);
    window.addEventListener("popstate", listener);
    return () => {
        window.removeEventListener(CHANGE_EVENT, listener);
        window.removeEventListener("storage", listener);
        window.removeEventListener("popstate", listener);
    };
}
function persist(value) {
    try {
        window.localStorage.setItem(STORAGE_KEY, value);
    }
    catch { }
    const url = new URL(window.location.href);
    url.searchParams.set("negocio", value);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(CHANGE_EVENT));
}
export function useKatalisBusiness(onBusinessChange, catalog) {
    const resolved = catalog === undefined ? readStoredCatalog() ?? FALLBACK_CATALOG : catalog ?? { options: [] };
    const raw = useSyncExternalStore(subscribe, readSelection, () => DEFAULT_BUSINESS);
    const ready = useSyncExternalStore(subscribe, () => true, () => false);
    const state = ready ? selectionState(businessSelectionValue(raw, resolved), resolved) : "all";
    const value = ready ? businessSelectionValue(raw, resolved) : DEFAULT_BUSINESS;
    const onChange = useCallback((id) => {
        if (id !== ALL_BUSINESSES && !isSelectableBusinessId(id, resolved) && id !== LEGACY_ORBITA)
            return;
        selected = id;
        persist(id);
        onBusinessChange?.(id);
    }, [onBusinessChange, resolved]);
    const options = useMemo(() => [{ id: ALL_BUSINESSES, label: "Todos los negocios" }, ...resolved.options], [resolved]);
    return { value, options, onChange, ready: ready && resolved.options.length > 0, state, catalog: resolved };
}
const BusinessContext = createContext(null);
export function KatalisBusinessProvider({ catalog, onBusinessChange, children, }) {
    const business = useKatalisBusiness(onBusinessChange, catalog);
    useEffect(() => {
        rememberBusinessCatalog(catalog ?? null);
    }, [catalog]);
    return _jsx(BusinessContext.Provider, { value: business, children: children });
}
export function useKatalisBusinessContext() {
    const business = useContext(BusinessContext);
    if (!business)
        throw new Error("Falta KatalisBusinessProvider alrededor de este componente.");
    return business;
}
