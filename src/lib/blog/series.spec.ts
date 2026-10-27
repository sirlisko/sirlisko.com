import { describe, expect, test } from "vitest";
import { seriesOf } from "./series";

const post = (title: string, pubDatetime: string, series?: string) => ({
	data: {
		title,
		description: "",
		pubDatetime: new Date(pubDatetime),
		tags: [],
		series,
	},
});

describe("seriesOf", () => {
	const first = post("Part 1", "2026-01-01", "Trip");
	const second = post("Part 2", "2026-02-01", "Trip");
	const other = post("Elsewhere", "2026-01-15", "Other");
	const loose = post("Loose", "2026-01-20");

	test("lists the series oldest first, whatever order the posts come in", () => {
		expect(seriesOf(first, [second, loose, other, first])).toEqual([
			first,
			second,
		]);
	});

	test("is empty for a post outside a series", () => {
		expect(seriesOf(loose, [first, second, loose])).toEqual([]);
	});

	test("is empty for a series of one, such as a part not published yet", () => {
		expect(seriesOf(other, [first, second, other])).toEqual([]);
	});
});
