import { describe, expect, test } from "vitest";
import { groupMentions, mentionsUrl } from "./webmentions";

const entry = (property: string, extra = {}) => ({
	"wm-property": property,
	url: `https://example.social/${property}`,
	author: { name: "Ana", photo: "https://example.social/ana.png" },
	...extra,
});

describe("mentionsUrl", () => {
	test("asks webmention.io for the mentions of one page", () => {
		expect(mentionsUrl("https://sirlisko.com/blog/100km")).toBe(
			"https://webmention.io/api/mentions.jf2?per-page=200&sort-dir=up&target=https%3A%2F%2Fsirlisko.com%2Fblog%2F100km",
		);
	});
});

describe("groupMentions", () => {
	test("sorts likes, reposts and replies", () => {
		const { likes, reposts, replies } = groupMentions([
			entry("like-of"),
			entry("repost-of"),
			entry("in-reply-to", { content: { text: "Lovely walk!" } }),
			entry("bookmark-of"),
		]);
		expect([likes.length, reposts.length]).toEqual([1, 1]);
		expect(replies.map(({ text }) => text)).toEqual(["Lovely walk!"]);
	});

	test("skips mentions with nothing to read", () => {
		expect(groupMentions([entry("mention-of")]).replies).toEqual([]);
	});

	test("shortens long replies", () => {
		const [reply] = groupMentions([
			entry("in-reply-to", { content: { text: "a".repeat(400) } }),
		]).replies;
		expect(reply?.text).toHaveLength(281);
	});

	test("names an author without a name after their site", () => {
		const [like] = groupMentions([
			{ "wm-property": "like-of", url: "https://example.blog/post" },
		]).likes;
		expect(like?.author.name).toBe("example.blog");
	});
});
