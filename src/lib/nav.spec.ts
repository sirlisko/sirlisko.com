import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initNav } from "./nav";

// jsdom ships no matchMedia; the nav only needs the mobile breakpoint from it.
const stubMatchMedia = (matches: boolean) => {
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => ({
			matches,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	);
};

const mount = () => {
	document.body.innerHTML = `
		<button type="button" id="hamburger" aria-expanded="false"></button>
		<ul id="nav-links"><li><a href="/">home</a></li><li><a href="/now">now</a></li></ul>
	`;
	return {
		hamburger: document.querySelector("#hamburger") as HTMLElement,
		navLinks: document.querySelector("#nav-links") as HTMLElement,
		cleanup: initNav(document),
	};
};

const pressEscape = () =>
	document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

describe("nav", () => {
	beforeEach(() => {
		stubMatchMedia(true);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.body.innerHTML = "";
		document.body.className = "";
	});

	test("the hamburger opens and closes the menu", () => {
		const { hamburger, navLinks, cleanup } = mount();

		hamburger.click();
		expect(navLinks).toHaveClass("active");
		expect(hamburger).toHaveAttribute("aria-expanded", "true");
		expect(document.body).toHaveClass("no-scroll");

		hamburger.click();
		expect(navLinks).not.toHaveClass("active");
		expect(hamburger).toHaveAttribute("aria-expanded", "false");
		cleanup();
	});

	test("opening moves focus into the menu", () => {
		const { hamburger, navLinks, cleanup } = mount();

		hamburger.click();
		expect(navLinks.querySelector("a")).toHaveFocus();
		cleanup();
	});

	test("escape closes the menu and hands focus back to the hamburger", () => {
		const { hamburger, navLinks, cleanup } = mount();

		hamburger.click();
		pressEscape();

		expect(navLinks).not.toHaveClass("active");
		expect(hamburger).toHaveFocus();
		cleanup();
	});

	test("escape does nothing while the menu is closed", () => {
		const { hamburger, cleanup } = mount();

		pressEscape();
		expect(hamburger).not.toHaveFocus();
		cleanup();
	});

	test("following a link closes the menu", () => {
		const { hamburger, navLinks, cleanup } = mount();

		hamburger.click();
		navLinks.querySelector("a")?.click();

		expect(navLinks).not.toHaveClass("active");
		expect(document.body).not.toHaveClass("no-scroll");
		cleanup();
	});

	test("keeps the closed menu out of the tab order on mobile", () => {
		const { hamburger, navLinks, cleanup } = mount();

		expect(navLinks).toHaveAttribute("inert");

		hamburger.click();
		expect(navLinks).not.toHaveAttribute("inert");
		cleanup();
	});

	test("leaves the menu reachable on desktop", () => {
		stubMatchMedia(false);
		const { navLinks, cleanup } = mount();

		expect(navLinks).not.toHaveAttribute("inert");
		cleanup();
	});

	test("cleanup detaches the document listener", () => {
		const { hamburger, navLinks, cleanup } = mount();

		hamburger.click();
		cleanup();
		pressEscape();

		expect(navLinks).toHaveClass("active");
	});
});
