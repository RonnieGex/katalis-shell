import type { KatalisSection, SectionId } from "./sections.js";
import type { ShellBusiness } from "./business.js";
export type { ShellBusiness };
export type ShellUser = {
    name: string;
    email: string;
    avatarUrl?: string | null;
    onSignOut?: () => void | Promise<void>;
};
export type KatalisShellProps = {
    sections: readonly KatalisSection[];
    current: SectionId;
    business: ShellBusiness;
    user?: ShellUser | null;
    signInHref?: string;
    signOutUrl?: string;
    signOutDestination?: string;
    contactsHref?: string;
    contentId?: string;
};
export declare function KatalisShell({ sections, current, business, user, signInHref, signOutUrl, signOutDestination, contactsHref, contentId }: KatalisShellProps): import("react").JSX.Element;
