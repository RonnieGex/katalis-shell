import type { KatalisSection, SectionId } from "./sections.js";
export type ShellBusiness = {
    value: string;
    options: readonly {
        id: string;
        label: string;
    }[];
    onChange: (id: string) => void;
};
export type ShellUser = {
    name: string;
    email: string;
    avatarUrl?: string | null;
    onSignOut: () => void | Promise<void>;
};
export type KatalisShellProps = {
    sections: readonly KatalisSection[];
    current: SectionId;
    business: ShellBusiness;
    user: ShellUser;
    contentId?: string;
};
export declare function KatalisShell({ sections, current, business, user, contentId }: KatalisShellProps): import("react").JSX.Element;
