"use client";

import { useEffect, useSyncExternalStore } from "react";
import { KATALIS_BUSINESSES, type BusinessId } from "./sections.js";

const STORAGE_KEY = "katalis.business";
const CHANGE_EVENT = "katalis-business-change";
const DEFAULT_BUSINESS: BusinessId = "katalis-lab";
let selected: BusinessId = DEFAULT_BUSINESS;

function isBusiness(value: string | null): value is BusinessId {
  return KATALIS_BUSINESSES.some((business) => business.id === value);
}

function readSelection(): BusinessId {
  const query = new URLSearchParams(window.location.search).get("negocio");
  if (isBusiness(query)) return query;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isBusiness(stored)) return stored;
  } catch {}
  return selected;
}

function subscribe(listener: () => void) {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
    window.removeEventListener("popstate", listener);
  };
}

function selectBusiness(value: string) {
  if (!isBusiness(value)) return;
  selected = value;
  try { window.localStorage.setItem(STORAGE_KEY, value); } catch {}
  const url = new URL(window.location.href);
  url.searchParams.set("negocio", value);
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useKatalisBusiness() {
  const value = useSyncExternalStore(subscribe, readSelection, () => DEFAULT_BUSINESS);
  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search).get("negocio");
    if (!isBusiness(incoming)) return;
    selected = incoming;
    try { window.localStorage.setItem(STORAGE_KEY, incoming); } catch {}
  }, [value]);
  return { value, options: KATALIS_BUSINESSES, onChange: selectBusiness };
}
