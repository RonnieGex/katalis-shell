import { afterEach, expect, test, spyOn } from "bun:test";
import { safeDestination, signOutOfSuite, suiteSignOutDestination } from "../src/sign-out";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
let fetchSpy: ReturnType<typeof spyOn>;
afterEach(() => {
  fetchSpy?.mockRestore();
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

function stubLocation() {
  const destinations: string[] = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { assign: (url: string) => destinations.push(url) } } });
  return destinations;
}

test("terminates the CRM session before returning to the configured entrance", async () => {
  const destinations = stubLocation();
  fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
  await signOutOfSuite("https://api.crm.katalis.dev/api/auth/sign-out", "https://katalis.dev/");
  expect(fetchSpy).toHaveBeenCalledWith("https://api.crm.katalis.dev/api/auth/sign-out", { method: "POST", credentials: "include", cache: "no-store" });
  expect(destinations).toEqual(["https://katalis.dev/"]);
});

test("accepts a local destination so development never leaves for production", async () => {
  const destinations = stubLocation();
  fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
  await signOutOfSuite("http://localhost:3001/api/auth/sign-out", "http://localhost:4300/");
  expect(destinations).toEqual(["http://localhost:4300/"]);
});

test("rejects a destination that is not a safe http(s) URL or local route", async () => {
  stubLocation();
  fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
  for (const value of ["javascript:alert(1)", "//evil.invalid", "", "   ", "https://usuario:clave@katalis.dev/"]) {
    await expect(signOutOfSuite("https://api.crm.katalis.dev/api/auth/sign-out", value)).rejects.toThrow();
  }
  expect(fetchSpy).not.toHaveBeenCalled();
});

test("derives the destination from the home section", () => {
  expect(suiteSignOutDestination([{ id: "home", href: "https://katalis.dev/" }, { id: "crm", href: "https://crm.katalis.dev/katalis" }])).toBe("https://katalis.dev/");
  expect(suiteSignOutDestination([{ id: "home", href: "#" }])).toBeNull();
  expect(suiteSignOutDestination([])).toBeNull();
});

test("does not pretend to sign out when the CRM fails", async () => {
  fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 503 }));
  await expect(signOutOfSuite("https://api.crm.katalis.dev/api/auth/sign-out", "https://katalis.dev/")).rejects.toThrow();
});

test("safeDestination classifies absolute and relative destinations", () => {
  expect(safeDestination("https://katalis.dev/")).toEqual({ href: "https://katalis.dev/", kind: "absolute" });
  expect(safeDestination("/katalis")).toEqual({ href: "/katalis", kind: "relative" });
  expect(safeDestination("//evil.invalid")).toBeNull();
  expect(safeDestination(undefined)).toBeNull();
});

test.each(["/..//evil.tld", "/%2e%2e//evil.tld", "/%2e%2e/%2fevil.tld", "/\\evil.tld"])("rejects normalized external relative sign-out destinations: %s", value => { expect(safeDestination(value)).toBeNull(); });
