import { afterEach, expect, test, spyOn } from "bun:test";
import { signOutOfSuite } from "../src/sign-out";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
let fetchSpy: ReturnType<typeof spyOn>;
afterEach(() => {
  fetchSpy?.mockRestore();
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

test("terminates the CRM session before returning to the only entrance", async () => {
  const destinations: string[] = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { assign: (url: string) => destinations.push(url) } } });
  fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
  await signOutOfSuite("https://api.crm.katalis.dev/api/auth/sign-out");
  expect(fetchSpy).toHaveBeenCalledWith("https://api.crm.katalis.dev/api/auth/sign-out", { method: "POST", credentials: "include", cache: "no-store" });
  expect(destinations).toEqual(["https://katalis.dev/"]);
});

test("does not pretend to sign out when the CRM fails", async () => {
  fetchSpy = spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 503 }));
  await expect(signOutOfSuite("https://api.crm.katalis.dev/api/auth/sign-out")).rejects.toThrow();
});
