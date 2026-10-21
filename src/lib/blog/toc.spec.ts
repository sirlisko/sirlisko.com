import { describe, expect, test } from "vitest";
import { currentSection, tocHeadings } from "./toc";

describe("tocHeadings", () => {
	test("keeps sections and subsections, without the footnotes heading", () => {
		const headings = [
			{ depth: 2, slug: "day-1", text: "Day 1" },
			{ depth: 3, slug: "lunch", text: "Lunch" },
			{ depth: 4, slug: "detail", text: "Detail" },
			{ depth: 2, slug: "footnote-label", text: "Footnotes" },
		];
		expect(tocHeadings(headings).map(({ slug }) => slug)).toEqual([
			"day-1",
			"lunch",
		]);
	});
});

describe("currentSection", () => {
	const sections = [
		{ id: "one", top: -400 },
		{ id: "two", top: 50 },
		{ id: "three", top: 600 },
	];

	test("is the last heading above the reading line", () => {
		expect(currentSection(sections, 100)).toBe("two");
	});

	test("is none before the first heading", () => {
		expect(currentSection([{ id: "one", top: 300 }], 100)).toBeUndefined();
	});
});
