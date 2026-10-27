import { describe, expect, test } from "vitest";
import { countStates } from "./been";

describe("countStates", () => {
	test("counts UN states and leaves territories out, as Been does", () => {
		expect(countStates(["GB", "GI", "IT", "VA"])).toEqual({
			count: 3,
			percentage: "1.5",
		});
	});

	test("is zero for an empty map", () => {
		expect(countStates([])).toEqual({ count: 0, percentage: "0.0" });
	});
});
