import { afterEach, describe, expect, test, vi } from "vitest";
import { initKonami, KONAMI_EVENT } from "./konami";

const CODE = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a",
];

const press = (keys: string[], target: EventTarget = document) => {
	for (const key of keys) {
		target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
	}
};

const listen = () => {
	const unlocked = vi.fn();
	document.addEventListener(KONAMI_EVENT, unlocked);
	return unlocked;
};

describe("konami", () => {
	let cleanup = () => {};

	afterEach(() => {
		cleanup();
		document.body.innerHTML = "";
	});

	test("fires once the whole code is entered", () => {
		const unlocked = listen();
		cleanup = initKonami();

		press(CODE.slice(0, -1));
		expect(unlocked).not.toHaveBeenCalled();

		press(["a"]);
		expect(unlocked).toHaveBeenCalledTimes(1);
	});

	test("ignores the case of the letters", () => {
		const unlocked = listen();
		cleanup = initKonami();

		press([...CODE.slice(0, -2), "B", "A"]);

		expect(unlocked).toHaveBeenCalledTimes(1);
	});

	test("recovers from a stray key, including an extra ↑ at the start", () => {
		const unlocked = listen();
		cleanup = initKonami();

		press(["ArrowUp", "x", "ArrowUp", ...CODE]);

		expect(unlocked).toHaveBeenCalledTimes(1);
	});

	test("ignores keys typed into a field", () => {
		const unlocked = listen();
		cleanup = initKonami();
		document.body.innerHTML = "<input>";

		press(CODE, document.querySelector("input") as HTMLInputElement);

		expect(unlocked).not.toHaveBeenCalled();
	});

	test("stops listening once cleaned up", () => {
		const unlocked = listen();
		initKonami()();

		press(CODE);

		expect(unlocked).not.toHaveBeenCalled();
	});
});
