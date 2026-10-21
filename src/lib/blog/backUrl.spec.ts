import { beforeEach, describe, expect, test } from "vitest";
import {
	backLabel,
	recallBackUrl,
	rememberBackUrl,
	trackBackUrl,
} from "./backUrl";

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

describe("trackBackUrl", () => {
	const page = (html: string) => {
		const root = document.createElement("div");
		root.innerHTML = html;
		return root;
	};

	beforeEach(() => sessionStorage.clear());

	test("remembers a list", () => {
		trackBackUrl(page(`<main data-back-url="/blog/walks"></main>`));
		expect(recallBackUrl()).toBe("/blog/walks");
	});

	test("keeps the list on a post", () => {
		rememberBackUrl("/blog/walks");
		trackBackUrl(page(`<a data-remembered-back></a>`));
		expect(recallBackUrl()).toBe("/blog/walks");
	});

	test("forgets the list on any other page", () => {
		rememberBackUrl("/blog/walks");
		trackBackUrl(page(`<main></main>`));
		expect(recallBackUrl()).toBeNull();
	});
});
