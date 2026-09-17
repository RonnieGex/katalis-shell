"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from "react";
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
export function KatalisShell({ sections, current, business, user, contentId = "katalis-content" }) {
    const selectId = useId();
    const [signingOut, setSigningOut] = useState(false);
    const [error, setError] = useState("");
    const initials = user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("es-MX") || "K";
    async function signOut() {
        setSigningOut(true);
        setError("");
        try {
            await user.onSignOut();
        }
        catch {
            setError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
        }
        finally {
            setSigningOut(false);
        }
    }
    return (_jsxs("header", { className: "katalis-shell", "aria-label": "Suite Katalis", children: [_jsx("a", { className: "katalis-shell__skip", href: `#${contentId}`, children: "Saltar al contenido" }), _jsxs("a", { className: "katalis-shell__brand", href: sections.find((section) => section.id === "home")?.href ?? "/", "aria-label": "Katalis, inicio", children: [_jsx("span", { className: "katalis-shell__mark", "aria-hidden": "true" }), _jsx("span", { className: "katalis-shell__wordmark", children: "Katalis" })] }), _jsx("nav", { className: "katalis-shell__nav", "aria-label": "Secciones de Katalis", children: _jsx(SectionLinks, { sections: sections, current: current }) }), _jsx(Disclosure, { variant: "sections", label: _jsxs("span", { children: ["Secciones", _jsx("span", { "aria-hidden": "true", children: "\u2304" })] }), children: _jsx("nav", { "aria-label": "Secciones de Katalis", children: _jsx(SectionLinks, { sections: sections, current: current }) }) }), _jsxs("div", { className: "katalis-shell__account", children: [_jsx("label", { className: "katalis-shell__sr", htmlFor: selectId, children: "Negocio" }), _jsx("select", { id: selectId, className: "katalis-shell__business", value: business.value, onChange: (event) => business.onChange(event.target.value), title: "Contexto de navegaci\u00F3n; los registros no se filtran", children: business.options.map((option) => _jsx("option", { value: option.id, children: option.label }, option.id)) }), _jsxs(Disclosure, { variant: "account", label: _jsx("span", { "aria-label": `Cuenta de ${user.name}`, className: "katalis-shell__avatar", children: user.avatarUrl ? _jsx("img", { src: user.avatarUrl, alt: "", width: 32, height: 32 }) : initials }), children: [_jsx("p", { className: "katalis-shell__name", children: user.name }), _jsx("p", { className: "katalis-shell__email", children: user.email }), _jsx("button", { className: "katalis-shell__logout", type: "button", disabled: signingOut, onClick: signOut, children: signingOut ? "Cerrando sesión…" : "Cerrar sesión" }), _jsx("p", { className: "katalis-shell__error", role: "status", children: error })] })] })] }));
}
