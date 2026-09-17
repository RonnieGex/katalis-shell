export async function signOutOfSuite(url) {
    const response = await fetch(url, { method: "POST", credentials: "include", cache: "no-store" });
    if (!response.ok)
        throw new Error("No se pudo cerrar la sesión.");
    window.location.assign("https://katalis.dev/");
}
