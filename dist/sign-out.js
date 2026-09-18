const HTTP_PROTOCOLS = ["http:", "https:"];
export function safeDestination(value) {
    if (typeof value !== "string")
        return null;
    const trimmed = value.trim();
    if (trimmed === "")
        return null;
    if (trimmed.startsWith("/")) {
        try {
            const decoded = decodeURIComponent(trimmed);
            if (/[\\\x00-\x20]/.test(decoded) || decoded.startsWith("//"))
                return null;
            const url = new URL(trimmed, "https://relative.invalid");
            const href = url.pathname + url.search + url.hash;
            if (url.origin !== "https://relative.invalid" || decodeURIComponent(href).startsWith("//"))
                return null;
            return { href, kind: "relative" };
        }
        catch {
            return null;
        }
    }
    try {
        const url = new URL(trimmed);
        if (!HTTP_PROTOCOLS.includes(url.protocol))
            return null;
        if (url.username || url.password)
            return null;
        return { href: url.href, kind: "absolute" };
    }
    catch {
        return null;
    }
}
export function suiteSignOutDestination(sections) {
    const home = sections.find((section) => section.id === "home");
    if (!home || home.href === "#")
        return null;
    const destination = safeDestination(home.href);
    return destination ? destination.href : null;
}
export async function signOutOfSuite(url, destination) {
    const target = safeDestination(destination);
    if (!target)
        throw new Error("El destino de la salida no es válido.");
    const response = await fetch(url, { method: "POST", credentials: "include", cache: "no-store" });
    if (!response.ok)
        throw new Error("No se pudo cerrar la sesión.");
    window.location.assign(target.href);
}
