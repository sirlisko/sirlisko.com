import { describe, expect, test } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
	test("leaves an existing tag slug alone", () => {
		expect(slugify("react-native")).toBe("react-native");
	});

	test("lowercases and joins words with dashes", () => {
		expect(slugify("E2E Testing")).toBe("e2e-testing");
	});

	test("folds accents and drops punctuation at the edges", () => {
		expect(slugify(" Café, à Paris! ")).toBe("cafe-a-paris");
	});
});
