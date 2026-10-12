import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initTrail } from "./trail";

const mount = () => {
	document.body.innerHTML = `
		<div data-trail>
			<button data-trail-pacman></button>
			<span class="pellets"></span>
			<span data-trail-power></span>
		</div>
	`;
	const trail = document.querySelector("[data-trail]") as HTMLElement;
	const pacman = document.querySelector("[data-trail-pacman]") as HTMLElement;
	const power = document.querySelector("[data-trail-power]") as HTMLElement;
	// jsdom does no layout, so give the row a width to travel.
	Object.defineProperty(trail, "clientWidth", { value: 388 });
	Object.defineProperty(pacman, "offsetWidth", { value: 28 });
	return { trail, pacman, power, cleanup: initTrail(document) };
};

const transitionEnd = (el: Element) =>
	el.dispatchEvent(new Event("transitionend", { bubbles: true }));

describe("trail", () => {
	const track = vi.fn();

	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal("umami", { track });
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
		track.mockClear();
		document.body.innerHTML = "";
	});

	test("a click sends pacman across the whole row", () => {
		const { trail, pacman, cleanup } = mount();

		pacman.click();

		expect(trail.dataset.state).toBe("eating");
		expect(trail.style.getPropertyValue("--travel")).toBe("360px");
		expect(trail.style.getPropertyValue("--duration")).toBe("2s");
		expect(track).toHaveBeenCalledWith("pacman");
		cleanup();
	});

	test("clicks during a run are ignored", () => {
		const { trail, pacman, cleanup } = mount();

		pacman.click();
		transitionEnd(trail);
		pacman.click();

		expect(trail.dataset.state).toBe("cleared");
		expect(track).toHaveBeenCalledTimes(1);
		cleanup();
	});

	test("a transition inside the row doesn't end the run", () => {
		const { trail, pacman, cleanup } = mount();

		pacman.click();
		transitionEnd(pacman);

		expect(trail.dataset.state).toBe("eating");
		cleanup();
	});

	test("the board blinks after a pause, then the dots come back", () => {
		const { trail, pacman, power, cleanup } = mount();

		pacman.click();
		transitionEnd(trail);
		vi.advanceTimersByTime(600);
		expect(trail.dataset.state).toBe("respawn");

		power.dispatchEvent(new Event("animationend"));
		expect(trail.dataset.state).toBeUndefined();
		cleanup();
	});

	test("cleanup stops the game, including a pending respawn", () => {
		const { trail, pacman, cleanup } = mount();

		pacman.click();
		transitionEnd(trail);
		cleanup();
		vi.advanceTimersByTime(600);
		expect(trail.dataset.state).toBe("cleared");

		delete trail.dataset.state;
		pacman.click();
		expect(trail.dataset.state).toBeUndefined();
	});

	test("does nothing without a trail", () => {
		document.body.innerHTML = "";
		expect(() => initTrail(document)()).not.toThrow();
	});
});
