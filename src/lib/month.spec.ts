import { describe, expect, test } from "vitest";
import { formatMonth } from "./month";

describe("formatMonth", () => {
	test("spells out the month and year", () => {
		expect(formatMonth("2026-10")).toBe("October 2026");
	});

	test("keeps January in its own year", () => {
		expect(formatMonth("2027-01")).toBe("January 2027");
	});
});
