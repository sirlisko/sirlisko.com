import { afterEach, describe, expect, test, vi } from "vitest";
import { initSayCiao } from "./sayCiao";

// jsdom ships no matchMedia; only the touch check matters here.
const stubTouch = (matches: boolean) =>
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => ({ matches })),
	);

const mount = () => {
	document.body.innerHTML = `
		<main><p>page</p></main>
		<a href="#ciao" data-say-ciao>envelope</a>
	`;
	return {
		link: document.querySelector("[data-say-ciao]") as HTMLAnchorElement,
		page: document.querySelector("p") as HTMLElement,
		cleanup: initSayCiao(document),
	};
};

// Returns whether the click would have followed the link.
const tap = (el: HTMLElement) =>
	el.dispatchEvent(
		new MouseEvent("click", { bubbles: true, cancelable: true }),
	);

describe("say ciao", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		document.body.innerHTML = "";
	});

	test("on touch, the first tap shows the balloon instead of mailing", () => {
		stubTouch(true);
		const { link, cleanup } = mount();

		expect(tap(link)).toBe(false);
		expect(link).toHaveAttribute("data-open");
		cleanup();
	});

	test("on touch, the second tap mails", () => {
		stubTouch(true);
		const { link, cleanup } = mount();

		tap(link);
		expect(tap(link)).toBe(true);
		cleanup();
	});

	test("tapping elsewhere hides the balloon again", () => {
		stubTouch(true);
		const { link, page, cleanup } = mount();

		tap(link);
		tap(page);
		expect(link).not.toHaveAttribute("data-open");
		cleanup();
	});

	test("with a mouse, the first click mails", () => {
		stubTouch(false);
		const { link, cleanup } = mount();

		expect(tap(link)).toBe(true);
		expect(link).not.toHaveAttribute("data-open");
		cleanup();
	});

	test("does nothing without the envelope", () => {
		stubTouch(true);
		document.body.innerHTML = "<main></main>";

		expect(() => initSayCiao(document)()).not.toThrow();
	});
});
