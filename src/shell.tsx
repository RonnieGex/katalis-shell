"use client";

import { useId, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import type { KatalisSection, SectionId } from "./sections.js";

export type ShellBusiness = {
  value: string;
  options: readonly { id: string; label: string }[];
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

function Disclosure({ label, children, variant }: { label: ReactNode; children: ReactNode; variant: "account" | "sections" }) {
  function close(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key !== "Escape") return;
    event.currentTarget.open = false;
    event.currentTarget.querySelector("summary")?.focus();
  }
  function blur(event: FocusEvent<HTMLDetailsElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
  }
  return (
    <details className={`katalis-shell__disclosure katalis-shell__disclosure--${variant}`} onKeyDown={close} onBlur={blur}>
      <summary className="katalis-shell__trigger">{label}</summary>
      <div className="katalis-shell__popover">{children}</div>
    </details>
  );
}

function SectionLinks({ sections, current }: Pick<KatalisShellProps, "sections" | "current">) {
  return sections.map((section) => section.href === "#" ? (
    <span className="katalis-shell__link" key={section.id} aria-disabled="true" title="Próximamente">
      {section.label}<span className="katalis-shell__sr">, próximamente</span>
    </span>
  ) : (
    <a className="katalis-shell__link" key={section.id} href={section.href} aria-current={current === section.id ? "page" : undefined}>
      {section.label}
    </a>
  ));
}

export function KatalisShell({ sections, current, business, user, contentId = "katalis-content" }: KatalisShellProps) {
  const selectId = useId();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("es-MX") || "K";
  async function signOut() {
    setSigningOut(true);
    setError("");
    try { await user.onSignOut(); }
    catch { setError("No se pudo cerrar la sesión. Inténtalo de nuevo."); }
    finally { setSigningOut(false); }
  }
  return (
    <header className="katalis-shell" aria-label="Suite Katalis">
      <a className="katalis-shell__skip" href={`#${contentId}`}>Saltar al contenido</a>
      <a className="katalis-shell__brand" href={sections.find((section) => section.id === "home")?.href ?? "/"} aria-label="Katalis, inicio">
        <span className="katalis-shell__mark" aria-hidden="true" />
        <span className="katalis-shell__wordmark">Katalis</span>
      </a>
      <nav className="katalis-shell__nav" aria-label="Secciones de Katalis"><SectionLinks sections={sections} current={current} /></nav>
      <Disclosure variant="sections" label={<span>Secciones<span aria-hidden="true">⌄</span></span>}>
        <nav aria-label="Secciones de Katalis"><SectionLinks sections={sections} current={current} /></nav>
      </Disclosure>
      <div className="katalis-shell__account">
        <label className="katalis-shell__sr" htmlFor={selectId}>Negocio</label>
        <select id={selectId} className="katalis-shell__business" value={business.value} onChange={(event) => business.onChange(event.target.value)} title="Contexto de navegación; los registros no se filtran">
          {business.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
        <Disclosure variant="account" label={<span aria-label={`Cuenta de ${user.name}`} className="katalis-shell__avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" width={32} height={32} /> : initials}</span>}>
          <p className="katalis-shell__name">{user.name}</p>
          <p className="katalis-shell__email">{user.email}</p>
          <button className="katalis-shell__logout" type="button" disabled={signingOut} onClick={signOut}>{signingOut ? "Cerrando sesión…" : "Cerrar sesión"}</button>
          <p className="katalis-shell__error" role="status">{error}</p>
        </Disclosure>
      </div>
    </header>
  );
}
