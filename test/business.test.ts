import { expect, test } from "bun:test";
import {
  ALL_BUSINESSES,
  LEGACY_ORBITA,
  selectionState,
  type BusinessCatalog,
} from "../src/sections";

const catalog: BusinessCatalog = {
  options: [
    { id: "b-sw", label: "Órbita SW", groupId: "orbita", groupLabel: "Órbita" },
    { id: "b-lux", label: "Órbita Luxury", groupId: "orbita", groupLabel: "Órbita" },
    { id: "b-rock", label: "Rock & Jewel" },
  ],
};

test("Todos no es un negocio y siempre es seleccionable con catálogo", () => {
  expect(selectionState(ALL_BUSINESSES, catalog)).toBe("all");
});

test("un negocio del catálogo es una selección válida", () => {
  expect(selectionState("b-rock", catalog)).toBe("business");
});

test("Órbita sin sufijo es la selección anterior de dos negocios", () => {
  expect(selectionState(LEGACY_ORBITA, catalog)).toBe("legacy-union");
});

test("un identificador desconocido es una selección no disponible, nunca Todos", () => {
  expect(selectionState("b-dental", catalog)).toBe("invalid");
  expect(selectionState("", catalog)).toBe("invalid");
});

test("un catálogo vacío no se convierte en Todos", () => {
  const empty: BusinessCatalog = { options: [] };
  expect(selectionState(ALL_BUSINESSES, empty)).toBe("unavailable");
  expect(selectionState("b-rock", empty)).toBe("invalid");
});
