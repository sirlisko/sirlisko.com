import { describe, expect, test } from "vitest";
import { menuStep } from "./menuNav";

describe("menuStep", () => {
	test("moves down and up one item", () => {
		expect(menuStep("ArrowDown", 1, 5)).toBe(2);
		expect(menuStep("ArrowUp", 1, 5)).toBe(0);
	});

	test("stops at either end instead of wrapping", () => {
		expect(menuStep("ArrowDown", 4, 5)).toBe(4);
		expect(menuStep("ArrowUp", 0, 5)).toBe(0);
	});

	test("jumps to the first and last item", () => {
		expect(menuStep("Home", 3, 5)).toBe(0);
		expect(menuStep("End", 1, 5)).toBe(4);
	});

	test("ignores other keys", () => {
		expect(menuStep("Enter", 1, 5)).toBeNull();
	});
});
