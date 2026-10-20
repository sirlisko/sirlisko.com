import { describe, expect, test } from "vitest";
import { formatPostDate } from "./date";

describe("formatPostDate", () => {
	test("writes day, short month and year", () => {
		expect(
			formatPostDate(new Date("2026-05-08T12:00:00Z"), "Europe/London"),
		).toBe("8 May 2026");
	});

	test("keeps September to three letters", () => {
		expect(
			formatPostDate(new Date("2026-09-03T12:00:00Z"), "Europe/London"),
		).toBe("3 Sep 2026");
	});

	test("reads the date in the post's own zone", () => {
		const lateInLondon = new Date("2026-08-17T23:30:00Z");
		expect(formatPostDate(lateInLondon, "Europe/London")).toBe("18 Aug 2026");
		expect(formatPostDate(lateInLondon, "America/New_York")).toBe(
			"17 Aug 2026",
		);
	});
});
