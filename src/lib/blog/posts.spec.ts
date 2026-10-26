import { describe, expect, test, vi } from "vitest";
import {
	isPublished,
	notLive,
	postSlug,
	postUrl,
	publishedPosts,
	sortDate,
	tagsOf,
	tagUrl,
} from "./posts";

// Vitest runs with DEV on, which lets drafts through; lists here are tested as the live site builds them.
vi.stubEnv("DEV", false);

const NOW = new Date("2026-06-01T12:00:00Z").getTime();

const post = (data: {
	title?: string;
	pubDatetime: string;
	modDatetime?: string;
	bump?: boolean;
	draft?: boolean;
	tags?: string[];
}) => ({
	data: {
		title: data.title ?? "A post",
		description: "",
		pubDatetime: new Date(data.pubDatetime),
		modDatetime: data.modDatetime ? new Date(data.modDatetime) : undefined,
		bump: data.bump,
		draft: data.draft,
		tags: data.tags ?? [],
	},
});

describe("isPublished", () => {
	test("hides drafts, except in dev", () => {
		const draft = post({ pubDatetime: "2026-01-01", draft: true });
		expect(isPublished(draft, NOW, false)).toBe(false);
		expect(isPublished(draft, NOW, true)).toBe(true);
	});

	test("hides a post scheduled after the build", () => {
		const later = post({ pubDatetime: "2026-06-02" });
		expect(isPublished(later, NOW, false)).toBe(false);
		expect(isPublished(later, NOW, true)).toBe(true);
	});

	test("lets out a post due within the margin", () => {
		const soon = post({ pubDatetime: "2026-06-01T12:10:00Z" });
		expect(isPublished(soon, NOW, false)).toBe(true);
	});
});

describe("notLive", () => {
	test("flags a draft, whatever its date", () => {
		expect(notLive(post({ pubDatetime: "2026-01-01", draft: true }), NOW)).toBe(
			"draft",
		);
	});

	test("flags a post scheduled after now", () => {
		expect(notLive(post({ pubDatetime: "2026-06-02" }), NOW)).toBe("scheduled");
	});

	test("is null once a post is out", () => {
		expect(notLive(post({ pubDatetime: "2026-01-01" }), NOW)).toBeNull();
	});
});

describe("sortDate", () => {
	test("is the publish date when the update isn't bumped", () => {
		const { data } = post({
			pubDatetime: "2026-01-01",
			modDatetime: "2026-03-01",
		});
		expect(sortDate(data)).toEqual(new Date("2026-01-01"));
	});

	test("is the update date when bumped", () => {
		const { data } = post({
			pubDatetime: "2026-01-01",
			modDatetime: "2026-03-01",
			bump: true,
		});
		expect(sortDate(data)).toEqual(new Date("2026-03-01"));
	});
});

describe("publishedPosts", () => {
	test("puts the newest first and a bumped update with it", () => {
		const posts = [
			post({ title: "old", pubDatetime: "2026-01-01" }),
			post({ title: "new", pubDatetime: "2026-04-01" }),
			post({
				title: "bumped",
				pubDatetime: "2025-01-01",
				modDatetime: "2026-05-01",
				bump: true,
			}),
			post({ title: "draft", pubDatetime: "2026-05-15", draft: true }),
		];
		expect(publishedPosts(posts).map(({ data }) => data.title)).toEqual([
			"bumped",
			"new",
			"old",
		]);
	});
});

describe("postSlug", () => {
	test("drops the date the filename sorts by", () => {
		expect(postSlug("2026-05-08-100km")).toBe("100km");
	});

	test("keeps a date that isn't a prefix", () => {
		expect(postSlug("my-default-apps-2024")).toBe("my-default-apps-2024");
	});
});

describe("urls", () => {
	test("posts sit straight under /blog", () => {
		expect(postUrl({ id: "2026-04-14-brighton-to-hastings" })).toBe(
			"/blog/brighton-to-hastings",
		);
	});

	test("tags use their slug", () => {
		expect(tagUrl("Web Life")).toBe("/blog/tags/web-life");
	});
});

describe("tagsOf", () => {
	test("counts each published post once per tag, merged by slug", () => {
		const posts = [
			post({ pubDatetime: "2026-01-01", tags: ["dev", "Dev", "travel"] }),
			post({ pubDatetime: "2026-02-01", tags: ["dev"] }),
			post({ pubDatetime: "2026-03-01", tags: ["gaming"], draft: true }),
		];
		expect(tagsOf(posts)).toEqual([
			{ slug: "dev", name: "dev", count: 2 },
			{ slug: "travel", name: "travel", count: 1 },
		]);
	});
});
