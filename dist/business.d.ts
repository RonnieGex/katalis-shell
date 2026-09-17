import { type ReactNode } from "react";
import { type BusinessCatalog, type BusinessSelectionState } from "./sections.js";
export type ShellBusiness = {
    value: string;
    options: readonly {
        id: string;
        label: string;
        groupId?: string;
        groupLabel?: string;
    }[];
    onChange: (id: string) => void;
    ready: boolean;
    state: BusinessSelectionState;
};
export type UseKatalisBusiness = ShellBusiness;
export declare function rememberBusinessCatalog(catalog: BusinessCatalog | null): void;
export declare function useKatalisBusiness(onBusinessChange?: (id: string) => void, catalog?: BusinessCatalog | null): UseKatalisBusiness;
export declare function KatalisBusinessProvider({ catalog, onBusinessChange, children, }: {
    catalog?: BusinessCatalog | null;
    onBusinessChange?: (id: string) => void;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useKatalisBusinessContext(): UseKatalisBusiness;
