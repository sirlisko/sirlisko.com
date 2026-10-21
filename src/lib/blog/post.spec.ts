import { describe, expect, test } from "vitest";
import { addHeadingLinks, readingMinutes, scrollPercent } from "./post";

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

describe("readingMinutes", () => {
	test("counts the prose at 220 words a minute", () => {
		expect(readingMinutes("word ".repeat(1100))).toBe(5);
	});

	test("leaves code blocks out", () => {
		const code = `\n\`\`\`ts\n${"const x = 1;\n".repeat(500)}\`\`\`\n`;
		expect(readingMinutes(`${"word ".repeat(440)}${code}`)).toBe(2);
	});

	test("is at least a minute", () => {
		expect(readingMinutes("Ciao")).toBe(1);
	});
});
