import { afterEach, describe, expect, test } from "vitest";
import { initLamp } from "./lamp";

const mount = () => {
	document.body.innerHTML = `<button aria-pressed="true" data-lamp>lamp</button>`;
	return {
		lamp: document.querySelector("[data-lamp]") as HTMLButtonElement,
		cleanup: initLamp(document),
	};
};

describe("lamp", () => {
	afterEach(() => {
		document.body.innerHTML = "";
	});

	test("each click flips the switch", () => {
		const { lamp, cleanup } = mount();

		lamp.click();
		expect(lamp).toHaveAttribute("aria-pressed", "false");
		lamp.click();
		expect(lamp).toHaveAttribute("aria-pressed", "true");

		cleanup();
	});

	test("cleanup disconnects the switch", () => {
		const { lamp, cleanup } = mount();

		cleanup();
		lamp.click();
		expect(lamp).toHaveAttribute("aria-pressed", "true");
	});

	test("does nothing without a lamp", () => {
		document.body.innerHTML = "";
		expect(() => initLamp(document)()).not.toThrow();
	});
});
