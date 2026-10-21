import { describe, expect, test } from "vitest";
import { backLabel } from "./backUrl";

describe("backLabel", () => {
	test("names the list without the /blog prefix", () => {
		expect(backLabel("/blog/tags/dev")).toBe("/tags/dev");
	});

	test("leaves out the search query", () => {
		expect(backLabel("/blog/search?q=kindle")).toBe("/search");
	});

	test("is /blog for the blog home", () => {
		expect(backLabel("/blog")).toBe("/blog");
	});
});
