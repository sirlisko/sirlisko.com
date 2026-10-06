import { afterEach, describe, expect, test, vi } from "vitest";
import { applyCrt, toggleCrt } from "./crt";

const root = () => document.documentElement;

describe("crt", () => {
	afterEach(() => {
		sessionStorage.clear();
		root().removeAttribute("data-crt");
		vi.restoreAllMocks();
	});

	test("toggles on and off", () => {
		expect(toggleCrt()).toBe(true);
		expect(root().hasAttribute("data-crt")).toBe(true);

		expect(toggleCrt()).toBe(false);
		expect(root().hasAttribute("data-crt")).toBe(false);
	});

	test("survives a page swap for the rest of the visit", () => {
		toggleCrt();
		root().removeAttribute("data-crt");

		applyCrt();

		expect(root().hasAttribute("data-crt")).toBe(true);
	});

	test("still toggles when storage is unavailable", () => {
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new Error("blocked");
		});

		expect(toggleCrt()).toBe(true);
		expect(root().hasAttribute("data-crt")).toBe(true);
	});
});
