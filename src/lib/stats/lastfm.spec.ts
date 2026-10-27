import { describe, expect, test } from "vitest";
import { parseMusic } from "./lastfm";

describe("parseMusic", () => {
	test("turns Last.fm's strings into numbers and a starting year", () => {
		const info = {
			user: { playcount: "436193", registered: { unixtime: "1180124826" } },
		};
		const top = {
			topartists: {
				artist: [
					{
						name: "Akira Yamaoka",
						playcount: "1480",
						url: "https://last.fm/a",
					},
				],
			},
		};
		expect(parseMusic(info, top)).toEqual({
			scrobbles: 436193,
			since: 2007,
			top: [{ name: "Akira Yamaoka", plays: 1480, url: "https://last.fm/a" }],
		});
	});
});
