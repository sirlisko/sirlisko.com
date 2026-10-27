import { describe, expect, test } from "vitest";
import { blogStats } from "./blog";

const post = (
	pubDatetime: string,
	tags: string[],
	body: string,
	gpxFiles?: { file: string; distance?: number; elevGain?: number }[],
) => ({
	data: {
		title: "",
		description: "",
		pubDatetime: new Date(pubDatetime),
		tags,
		gpxFiles,
	},
	body,
});

describe("blogStats", () => {
	const posts = [
		post("2024-03-01", ["dev"], "one two three"),
		post("2026-05-08", ["hiking"], "four five", [
			{ file: "a.gpx", distance: 25.3, elevGain: 455 },
			{ file: "b.gpx", distance: 22.7 },
		]),
		post("2026-09-01", ["gaming"], "```\ncode\n```\nsix"),
	];

	test("totals posts, words and walks", () => {
		expect(blogStats(posts, 2026)).toMatchObject({
			first: 2024,
			posts: 3,
			words: 6,
			km: 48,
			climbed: 455,
		});
	});

	test("keeps quiet years, so gaps show", () => {
		expect(blogStats(posts, 2026).years).toEqual([
			{ year: 2024, posts: 1 },
			{ year: 2025, posts: 0 },
			{ year: 2026, posts: 2 },
		]);
	});

	test("counts kinds, leaving out the empty ones", () => {
		expect(blogStats(posts, 2026).kinds).toEqual([
			{ kind: "code", count: 1 },
			{ kind: "game", count: 1 },
			{ kind: "walk", count: 1 },
		]);
	});
});
