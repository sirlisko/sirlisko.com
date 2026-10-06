import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initNav } from "./nav";

let onBreakpoint: (() => void) | undefined;

// jsdom ships no matchMedia; the nav only needs the mobile breakpoint from it.
const stubMatchMedia = (matches: boolean) => {
	const query = {
		matches,
		addEventListener: vi.fn((_: string, fn: () => void) => {
			onBreakpoint = fn;
		}),
		removeEventListener: vi.fn(),
	};
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => query),
	);
	return query;
};

// jsdom has no modal dialogs either; toggling `open` is all the nav relies on.
const stubDialog = () => {
	HTMLDialogElement.prototype.showModal = function () {
		this.open = true;
	};
	HTMLDialogElement.prototype.close = function () {
		this.open = false;
	};
};

const mount = () => {
	document.body.innerHTML = `
		<nav>
			<button type="button" id="nav-start">Start</button>
			<dialog id="nav-pause">
				<ul><li><a href="#home">home</a></li></ul>
			</dialog>
		</nav>
	`;
	return {
		start: document.querySelector("#nav-start") as HTMLButtonElement,
		pause: document.querySelector("#nav-pause") as HTMLDialogElement,
		cleanup: initNav(document),
	};
};

describe("nav", () => {
	beforeEach(() => {
		stubDialog();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
		onBreakpoint = undefined;
		document.body.innerHTML = "";
	});

	test("start opens the pause menu", () => {
		stubMatchMedia(true);
		const { start, pause, cleanup } = mount();

		start.click();
		expect(pause.open).toBe(true);
		cleanup();
	});

	test("picking a page closes the menu", () => {
		stubMatchMedia(true);
		const { start, pause, cleanup } = mount();

		start.click();
		pause.querySelector("a")?.click();
		expect(pause.open).toBe(false);
		cleanup();
	});

	test("clicking the backdrop closes the menu", () => {
		stubMatchMedia(true);
		const { start, pause, cleanup } = mount();

		start.click();
		pause.click();
		expect(pause.open).toBe(false);
		cleanup();
	});

	test("growing past the breakpoint closes the menu", () => {
		const query = stubMatchMedia(true);
		const { start, pause, cleanup } = mount();

		start.click();
		query.matches = false;
		onBreakpoint?.();
		expect(pause.open).toBe(false);
		cleanup();
	});

	test("cleanup detaches every listener", () => {
		const query = stubMatchMedia(true);
		const { start, pause, cleanup } = mount();

		cleanup();
		start.click();
		expect(pause.open).toBe(false);
		expect(query.removeEventListener).toHaveBeenCalledOnce();
	});

	test("does nothing without a nav", () => {
		stubMatchMedia(true);
		document.body.innerHTML = "<main></main>";

		expect(() => initNav(document)()).not.toThrow();
	});
});
