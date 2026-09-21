import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initGhost } from "./ghost";

const GHOST_MARKUP = `
	<section class="life">
		<span class="heart" data-ghost-heart></span>
		<span class="heart" data-ghost-heart></span>
		<span class="heart" data-ghost-heart></span>
		<p data-ghost-gameover hidden>-Game Over-</p>
	</section>
	<figure data-ghost-sprite></figure>
`;

const mount = () => {
	document.body.innerHTML = GHOST_MARKUP;
	return {
		sprite: document.querySelector("[data-ghost-sprite]") as HTMLElement,
		gameOver: document.querySelector("[data-ghost-gameover]") as HTMLElement,
		visibleHearts: () =>
			[...document.querySelectorAll("[data-ghost-heart]")].filter(
				(heart) => !heart.hasAttribute("hidden"),
			),
	};
};

const moveMouse = (clientX: number, clientY: number) => {
	document.dispatchEvent(new MouseEvent("mousemove", { clientX, clientY }));
	vi.advanceTimersByTime(100);
};

describe("ghost", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		document.body.innerHTML = "";
		Object.defineProperty(window, "ontouchstart", {
			value: undefined,
			configurable: true,
		});
		delete (window as { ontouchstart?: unknown }).ontouchstart;
	});

	test("starts off-screen with all lives", () => {
		const { sprite, visibleHearts } = mount();
		initGhost();

		expect(visibleHearts()).toHaveLength(3);
		expect(sprite.style.left).toBe("-164px");
		expect(sprite.style.top).toBe("-164px");
	});

	test("follows the mouse", () => {
		const { sprite } = mount();
		initGhost();

		moveMouse(100, 200);

		expect(sprite.style.left).toBe("36px");
		expect(sprite.style.top).toBe("136px");
	});

	test("flips depending on which side the mouse is on", () => {
		const { sprite } = mount();
		initGhost();

		moveMouse(50, 100);
		expect(sprite.classList.contains("flipped")).toBe(true);

		moveMouse(200, 100);
		expect(sprite.classList.contains("flipped")).toBe(false);
	});

	test("loses a life on mouseover", () => {
		const { sprite, visibleHearts } = mount();
		initGhost();

		sprite.dispatchEvent(new MouseEvent("mouseover"));

		expect(visibleHearts()).toHaveLength(2);
	});

	test("shows game over once every life is gone, and stops there", () => {
		const { sprite, gameOver, visibleHearts } = mount();
		initGhost();

		for (let i = 0; i < 4; i += 1) {
			sprite.dispatchEvent(new MouseEvent("mouseover"));
		}

		expect(visibleHearts()).toHaveLength(0);
		expect(gameOver.hasAttribute("hidden")).toBe(false);
	});

	test("does not follow the mouse on touch devices", () => {
		Object.defineProperty(window, "ontouchstart", {
			value: null,
			configurable: true,
		});
		const { sprite } = mount();
		initGhost();

		moveMouse(100, 200);

		expect(sprite.style.left).toBe("-164px");
	});

	test("does not follow the mouse when reduced motion is requested", () => {
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => ({ matches: true })),
		);
		const { sprite } = mount();
		initGhost();

		moveMouse(100, 200);

		expect(sprite.style.left).toBe("-164px");
		vi.unstubAllGlobals();
	});

	test("detaches its listeners on cleanup", () => {
		const { sprite, visibleHearts } = mount();
		const cleanup = initGhost();

		cleanup();
		moveMouse(100, 200);
		sprite.dispatchEvent(new MouseEvent("mouseover"));

		expect(sprite.style.left).toBe("-164px");
		expect(visibleHearts()).toHaveLength(3);
	});
});
