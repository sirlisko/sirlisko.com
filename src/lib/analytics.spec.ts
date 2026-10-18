import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const CONFIG = {
	src: "https://stats.example.com/script.js",
	websiteId: "site-id",
	domains: "example.com",
};

const pageLoad = () => document.dispatchEvent(new Event("astro:page-load"));
const script = () =>
	document.head.querySelector<HTMLScriptElement>(`script[src="${CONFIG.src}"]`);

describe("analytics", () => {
	let analytics: typeof import("./analytics");
	let cleanup = () => {};
	const umamiTrack = vi.fn();

	// Stands in for the real script arriving and installing itself.
	const arrive = () => {
		window.umami = { track: umamiTrack };
		script()?.dispatchEvent(new Event("load"));
	};

	beforeEach(async () => {
		// The queue lives in the module, so each test gets a fresh one.
		vi.resetModules();
		analytics = await import("./analytics");
		cleanup = analytics.initAnalytics(CONFIG);
	});

	afterEach(() => {
		cleanup();
		umamiTrack.mockReset();
		delete window.umami;
		document.head.innerHTML = "";
		document.title = "";
	});

	test("waits for the page before loading the script", () => {
		expect(script()).toBeNull();

		pageLoad();

		expect({ ...script()?.dataset }).toEqual({
			websiteId: "site-id",
			autoTrack: "false",
			domains: "example.com",
		});
	});

	test("loads the script once across navigations", () => {
		pageLoad();
		pageLoad();

		expect(document.head.querySelectorAll("script")).toHaveLength(1);
	});

	test("sends what was tracked before the script arrived", () => {
		pageLoad();
		analytics.track("404", { url: "/nope" });
		arrive();

		expect(umamiTrack).toHaveBeenCalledWith("404", { url: "/nope" });
	});

	test("counts a page with the title it had when it was shown", () => {
		document.title = "First";
		pageLoad();
		document.title = "Second";
		arrive();

		const [payload] = umamiTrack.mock.calls[0] ?? [];
		expect(payload({ website: "site-id" })).toEqual({
			website: "site-id",
			title: "First",
			url: "/",
		});
	});

	test("sends straight away once the script is in", () => {
		pageLoad();
		arrive();
		umamiTrack.mockClear();

		analytics.track("pacman");

		expect(umamiTrack).toHaveBeenCalledWith("pacman");
	});

	test("keeps quiet when the script is blocked", () => {
		pageLoad();
		script()?.dispatchEvent(new Event("error"));

		expect(() => analytics.track("pacman")).not.toThrow();
		expect(umamiTrack).not.toHaveBeenCalled();
	});

	test("stops after cleanup", () => {
		cleanup();
		pageLoad();

		expect(script()).toBeNull();
	});
});
