"use client";

import { useId, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import type { KatalisSection, SectionId } from "./sections.js";
import { safeDestination, signOutOfSuite, suiteSignOutDestination } from "./sign-out.js";

export type ShellBusiness = {
  value: string;
  options: readonly { id: string; label: string }[];
  onChange: (id: string) => void;
};

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

export function KatalisShell({ sections, current, business, user, signInHref, signOutUrl, signOutDestination, contactsHref, contentId = "katalis-content" }: KatalisShellProps) {
  const selectId = useId();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const homeHref = sections.find((section) => section.id === "home")?.href;
  const destination = safeDestination(signOutDestination)?.href ?? suiteSignOutDestination(sections) ?? safeDestination(homeHref)?.href ?? "/";
  const initials = user?.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("es-MX") || "K";
  async function signOut() {
    setSigningOut(true);
    setError("");
    try {
      if (signOutUrl) await signOutOfSuite(signOutUrl, destination);
      else if (user?.onSignOut) await user.onSignOut();
      else throw new Error("Falta configurar la salida.");
    }
    catch { setError("No se pudo cerrar la sesión. Inténtalo de nuevo."); }
    finally { setSigningOut(false); }
  }
  return (
    <header className="katalis-shell" aria-label="Suite Katalis">
      <a className="katalis-shell__skip" href={`#${contentId}`}>Saltar al contenido</a>
      <a className="katalis-shell__brand" href={homeHref ?? "/"} aria-label="Katalis, inicio">
        <span className="katalis-shell__mark" aria-hidden="true" />
        <span className="katalis-shell__wordmark">Katalis</span>
      </a>
      <nav className="katalis-shell__nav" aria-label="Secciones de Katalis"><SectionLinks sections={sections} current={current} /></nav>
      <Disclosure variant="sections" label={<span>Secciones<span aria-hidden="true">⌄</span></span>}>
        <nav aria-label="Secciones de Katalis"><SectionLinks sections={sections} current={current} /></nav>
      </Disclosure>
      <div className="katalis-shell__account">
        <label className="katalis-shell__sr" htmlFor={selectId}>Negocio</label>
        <select id={selectId} className="katalis-shell__business" value={business.value} onChange={(event) => business.onChange(event.target.value)} title="Negocio activo en la suite">
          {business.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
        {contactsHref && <a className="katalis-shell__shortcut" href={contactsHref} aria-label="Contactos de OpenReply" title="Contactos de OpenReply"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3" /></svg><span className="katalis-shell__shortcut-label">Contactos de OpenReply</span></a>}
        {user ? <Disclosure variant="account" label={<span aria-label={`Cuenta de ${user.name}`} className="katalis-shell__avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" width={32} height={32} /> : initials}</span>}>
          <p className="katalis-shell__name">{user.name}</p>
          <p className="katalis-shell__email">{user.email}</p>
          <button className="katalis-shell__logout" type="button" disabled={signingOut} onClick={signOut}>{signingOut ? "Cerrando sesión…" : "Salir"}</button>
          <p className="katalis-shell__error" role="status">{error}</p>
        </Disclosure> : signInHref ? <a className="katalis-shell__sign-in" href={signInHref}>Entrar</a> : null}
      </div>
    </header>
  );
}
