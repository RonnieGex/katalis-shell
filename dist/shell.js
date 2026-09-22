"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from "react";
import { ALL_BUSINESSES, LEGACY_ORBITA } from "./sections.js";
import { safeDestination, signOutOfSuite, suiteSignOutDestination } from "./sign-out.js";
function Disclosure({ label, children, variant }) {
    function close(event) {
        if (event.key !== "Escape")
            return;
        event.currentTarget.open = false;
        event.currentTarget.querySelector("summary")?.focus();
    }
    function blur(event) {
        if (!event.currentTarget.contains(event.relatedTarget))
            event.currentTarget.open = false;
    }
    return (_jsxs("details", { className: `katalis-shell__disclosure katalis-shell__disclosure--${variant}`, onKeyDown: close, onBlur: blur, children: [_jsx("summary", { className: "katalis-shell__trigger", children: label }), _jsx("div", { className: "katalis-shell__popover", children: children })] }));
}
function SectionLinks({ sections, current }) {
    return sections.map((section) => section.href === "#" ? (_jsxs("span", { className: "katalis-shell__link", "aria-disabled": "true", title: "Pr\u00F3ximamente", children: [section.label, _jsx("span", { className: "katalis-shell__sr", children: ", pr\u00F3ximamente" })] }, section.id)) : (_jsx("a", { className: "katalis-shell__link", href: section.href, "aria-current": current === section.id ? "page" : undefined, children: section.label }, section.id)));
}
export function KatalisShell({ sections, current, business, user, signInHref, signOutUrl, signOutDestination, contactsHref, contentId = "katalis-content" }) {
    const selectId = useId();
    const [signingOut, setSigningOut] = useState(false);
    const [error, setError] = useState("");
    const homeHref = sections.find((section) => section.id === "home")?.href;
    const destination = safeDestination(signOutDestination)?.href ?? suiteSignOutDestination(sections) ?? safeDestination(homeHref)?.href ?? "/";
    const initials = user?.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("es-MX") || "K";
    const selectValue = business.state === "legacy-union" ? LEGACY_ORBITA : business.value;
    const groups = business.options.reduce((accumulator, option) => {
        const id = option.groupId ?? "";
        const label = option.groupLabel ?? "";
        const existing = accumulator.find((group) => group.id === id);
        if (existing) {
            existing.options = [...existing.options, option];
            return accumulator;
        }
        return [...accumulator, { id, label, options: [option] }];
    }, []);
    async function signOut() {
        if (signingOut)
            return;
        setSigningOut(true);
        setError("");
        try {
            if (signOutUrl)
                await signOutOfSuite(signOutUrl, destination);
            else if (user?.onSignOut)
                await user.onSignOut();
            else
                throw new Error("Falta configurar la salida.");
        }
        catch {
            setError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
        }
        finally {
            setSigningOut(false);
        }
    }
    return (_jsxs("header", { className: "katalis-shell", "aria-label": "Suite Katalis", children: [_jsx("a", { className: "katalis-shell__skip", href: `#${contentId}`, children: "Saltar al contenido" }), _jsxs("a", { className: "katalis-shell__brand", href: homeHref ?? "/", "aria-label": "Katalis, inicio", children: [_jsx("span", { className: "katalis-shell__mark", "aria-hidden": "true" }), _jsx("span", { className: "katalis-shell__wordmark", children: "Katalis" })] }), _jsx("nav", { className: "katalis-shell__nav", "aria-label": "Secciones de Katalis", children: _jsx(SectionLinks, { sections: sections, current: current }) }), _jsx(Disclosure, { variant: "sections", label: _jsxs("span", { children: ["Secciones", _jsx("span", { "aria-hidden": "true", children: "\u2304" })] }), children: _jsx("nav", { "aria-label": "Secciones de Katalis", children: _jsx(SectionLinks, { sections: sections, current: current }) }) }), _jsxs("div", { className: "katalis-shell__account", children: [_jsx("label", { className: "katalis-shell__sr", htmlFor: selectId, children: "Negocio" }), _jsxs("select", { id: selectId, className: "katalis-shell__business", value: selectValue, onChange: (event) => business.onChange(event.target.value), title: "Negocio activo en la suite", disabled: !business.ready, children: [business.state === "unavailable" ? _jsx("option", { value: ALL_BUSINESSES, children: "Cat\u00E1logo de negocios no disponible" }) : null, business.state === "invalid" ? _jsx("option", { value: business.value, children: "Selecci\u00F3n de negocio no disponible" }) : null, business.state === "legacy-union" ? _jsx("option", { value: LEGACY_ORBITA, children: "\u00D3rbita \u00B7 selecci\u00F3n anterior" }) : null, groups.map((group) => group.options.length === 1 && !group.label
                                ? group.options.map((option) => _jsx("option", { value: option.id, children: option.label }, option.id))
                                : (_jsx("optgroup", { label: group.label, children: group.options.map((option) => _jsx("option", { value: option.id, children: option.label }, option.id)) }, group.id)))] }), contactsHref && _jsxs("a", { className: "katalis-shell__shortcut", href: contactsHref, "aria-label": "Contactos de Instagram", title: "Contactos de Instagram", children: [_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: [_jsx("circle", { cx: "9", cy: "8", r: "3" }), _jsx("path", { d: "M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3" })] }), _jsx("span", { className: "katalis-shell__shortcut-label", children: "Contactos de Instagram" })] }), user ? _jsxs(Disclosure, { variant: "account", label: _jsx("span", { "aria-label": `Cuenta de ${user.name}`, className: "katalis-shell__avatar", children: user.avatarUrl ? _jsx("img", { src: user.avatarUrl, alt: "", width: 32, height: 32 }) : initials }), children: [_jsx("p", { className: "katalis-shell__name", children: user.name }), _jsx("p", { className: "katalis-shell__email", children: user.email }), _jsx("button", { className: "katalis-shell__logout", type: "button", "aria-disabled": signingOut, onClick: signOut, children: signingOut ? "Cerrando sesión…" : "Salir" }), _jsx("p", { className: "katalis-shell__error", role: "status", children: error })] }) : signInHref ? _jsx("a", { className: "katalis-shell__sign-in", href: signInHref, children: "Entrar" }) : null] })] }));
}
