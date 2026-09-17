export type DestinationKind = "absolute" | "relative";
export declare function safeDestination(value: unknown): {
    href: string;
    kind: DestinationKind;
} | null;
export declare function suiteSignOutDestination(sections: readonly {
    id: string;
    href: string;
}[]): string | null;
export declare function signOutOfSuite(url: string, destination: string): Promise<void>;
