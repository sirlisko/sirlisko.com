import { describe, expect, test } from "vitest";
import { lastmodOf, slugOf } from "./sitemap";

describe("slugOf", () => {
	test("reads a post's own slug", () => {
		expect(slugOf("title: A\nslug: a-longer-url\n")).toBe("a-longer-url");
	});

	test("reads a quoted slug", () => {
		expect(slugOf('slug: "a-longer-url"\n')).toBe("a-longer-url");
	});

	test("has nothing when the post sets no slug", () => {
		expect(slugOf("title: A\npubDatetime: 2019-07-05\n")).toBeUndefined();
	});
});

describe("lastmodOf", () => {
	test("uses the publish date of a post never updated", () => {
		expect(lastmodOf("title: A\npubDatetime: 2019-07-05\n")).toBe(
			"2019-07-05T00:00:00.000Z",
		);
	});

	test("prefers the update date", () => {
		expect(
			lastmodOf(
				"pubDatetime: 2015-02-21\nmodDatetime: 2026-10-01T09:30:00.000Z\n",
			),
		).toBe("2026-10-01T09:30:00.000Z");
	});

	test("ignores an empty update date", () => {
		expect(lastmodOf("pubDatetime: 2024-12-30\nmodDatetime: null\n")).toBe(
			"2024-12-30T00:00:00.000Z",
		);
	});

	test("has nothing for a draft without dates", () => {
		expect(lastmodOf("Just some notes")).toBeUndefined();
	});
});
