import { describe, expect, test } from "vitest";
import { parseDiary } from "./letterboxd";

const item = (title: string, watched: string, rating?: string) => `<item>
	<link>https://letterboxd.com/sirlisko/film/${title.toLowerCase()}/</link>
	<letterboxd:watchedDate>${watched}</letterboxd:watchedDate>
	<letterboxd:filmTitle>${title}</letterboxd:filmTitle>
	<letterboxd:filmYear>2000</letterboxd:filmYear>
	${rating ? `<letterboxd:memberRating>${rating}</letterboxd:memberRating>` : ""}
</item>`;

describe("parseDiary", () => {
	test("takes the newest entry and counts this year's", () => {
		const xml = [
			item("Heat", "2026-10-26", "4.5"),
			item("Alien", "2026-01-02"),
			item("Up", "2025-12-30", "3.0"),
		].join("");
		expect(parseDiary(xml, 2026)).toEqual({
			latest: {
				title: "Heat",
				year: "2000",
				url: "https://letterboxd.com/sirlisko/film/heat/",
				rating: 4.5,
				watched: "2026-10-26",
			},
			thisYear: 2,
			complete: true,
		});
	});

	test("flags the count as a floor when the feed starts inside the year", () => {
		const xml = item("Heat", "2026-10-26") + item("Alien", "2026-03-01");
		expect(parseDiary(xml, 2026)).toMatchObject({
			thisYear: 2,
			complete: false,
		});
	});

	test("decodes entities in titles", () => {
		const xml = item("The Emperor&#039;s New Groove", "2026-10-24");
		expect(parseDiary(xml, 2026)?.latest.title).toBe(
			"The Emperor's New Groove",
		);
	});

	test("is null for an empty diary", () => {
		expect(parseDiary("<rss></rss>", 2026)).toBeNull();
	});
});
