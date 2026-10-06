import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initStaffRoll } from "./staffRoll";

const PAGE_HEIGHT = 2000;
const VIEWPORT = 800;

const mount = () => {
	document.body.innerHTML = "<main data-staff-roll></main>";
	const page = document.documentElement;
	Object.defineProperty(page, "scrollHeight", {
		configurable: true,
		value: PAGE_HEIGHT,
	});
	Object.defineProperty(page, "clientHeight", {
		configurable: true,
		value: VIEWPORT,
	});
	page.scrollTop = 0;
	return page;
};

// Fake timers drive rAF at 16ms a frame.
const roll = (ms: number) => vi.advanceTimersByTime(ms);

describe("staff roll", () => {
	beforeEach(() => {
		vi.useFakeTimers({
			toFake: [
				"setTimeout",
				"clearTimeout",
				"requestAnimationFrame",
				"cancelAnimationFrame",
			],
		});
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => ({ matches: false })),
		);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
		document.body.innerHTML = "";
	});

	test("waits a moment, then rolls the page down", () => {
		const page = mount();
		const cleanup = initStaffRoll(document);

		roll(1000);
		expect(page.scrollTop).toBe(0);

		roll(2000);
		expect(page.scrollTop).toBeGreaterThan(0);

		cleanup();
	});

	test("stops at the end of the credits", () => {
		const page = mount();
		initStaffRoll(document);

		roll(60_000);

		expect(page.scrollTop).toBeGreaterThanOrEqual(PAGE_HEIGHT - VIEWPORT);
		expect(vi.getTimerCount()).toBe(0);
	});

	test("hands control back when the reader scrolls", () => {
		const page = mount();
		initStaffRoll(document);
		roll(3000);

		window.dispatchEvent(new WheelEvent("wheel"));
		const stoppedAt = page.scrollTop;
		roll(3000);

		expect(page.scrollTop).toBe(stoppedAt);
	});

	test("hands control back when something else moves the page", () => {
		const page = mount();
		initStaffRoll(document);
		roll(3000);

		page.scrollTop = 900;
		roll(3000);

		expect(page.scrollTop).toBe(900);
	});

	test("stays still when reduced motion is requested", () => {
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => ({ matches: true })),
		);
		const page = mount();
		initStaffRoll(document);

		roll(5000);

		expect(page.scrollTop).toBe(0);
	});

	test("does nothing on other pages", () => {
		document.body.innerHTML = "";
		initStaffRoll(document);

		expect(vi.getTimerCount()).toBe(0);
	});
});
