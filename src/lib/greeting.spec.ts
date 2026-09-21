import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initGreeting } from "./greeting";

const descriptions = ["developer", "designer", "engineer"];

const mount = (initial = descriptions[0]) => {
	document.body.innerHTML = `<span data-greeting>${initial}</span>`;
	return document.querySelector<HTMLElement>("[data-greeting]") as HTMLElement;
};

describe("greeting", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		document.body.innerHTML = "";
	});

	test("keeps the server-rendered description until the pause elapses", () => {
		const el = mount();
		initGreeting(el, descriptions);

		vi.advanceTimersByTime(1999);
		expect(el.textContent).toBe("developer");
	});

	test("deletes the description one character at a time", () => {
		const el = mount();
		initGreeting(el, descriptions);

		vi.advanceTimersByTime(2000);
		expect(el.textContent).toBe("develope");

		vi.advanceTimersByTime(10);
		expect(el.textContent).toBe("develop");
	});

	test("types the next description once the previous one is deleted", () => {
		const el = mount();
		initGreeting(el, descriptions, { random: () => 2 / descriptions.length });

		vi.advanceTimersByTime(2000 + 10 * "developer".length);
		expect(el.textContent).toBe("");

		vi.advanceTimersByTime(200);
		expect(el.textContent).toBe("e");

		vi.advanceTimersByTime(200);
		expect(el.textContent).toBe("en");
	});

	test("leaves the description alone when reduced motion is requested", () => {
		const el = mount();
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => ({ matches: true })),
		);

		initGreeting(el, descriptions);
		vi.advanceTimersByTime(10_000);

		expect(el.textContent).toBe("developer");
		vi.unstubAllGlobals();
	});

	test("stops scheduling work once cleaned up", () => {
		const el = mount();
		const cleanup = initGreeting(el, descriptions);

		cleanup();
		vi.advanceTimersByTime(10_000);
		expect(el.textContent).toBe("developer");
	});
});
