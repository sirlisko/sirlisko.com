import { describe, expect, test } from "vitest";
import { addHeadingLinks, scrollPercent } from "./post";

describe("scrollPercent", () => {
	const root = (
		scrollTop: number,
		scrollHeight: number,
		clientHeight: number,
	) => ({ scrollTop, scrollHeight, clientHeight }) as HTMLElement;

	test("is how far down the scrollable part the reader is", () => {
		expect(scrollPercent(root(500, 2000, 1000))).toBe(50);
	});

	test("is zero on a page too short to scroll", () => {
		expect(scrollPercent(root(0, 800, 800))).toBe(0);
	});
});

describe("addHeadingLinks", () => {
	test("links each heading with an id to itself, once", () => {
		const article = document.createElement("article");
		article.innerHTML = `<h2 id="maps">Maps</h2><h3>No id</h3>`;
		addHeadingLinks(article);
		addHeadingLinks(article);
		const links = article.querySelectorAll<HTMLAnchorElement>(".heading-link");
		expect(links).toHaveLength(1);
		expect(links[0]?.getAttribute("href")).toBe("#maps");
	});
});
