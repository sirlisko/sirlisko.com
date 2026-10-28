import { describe, expect, test } from "vitest";
import { feedHtml, pickCandidate } from "./feed";

const ORIGIN = "https://sirlisko.com";

describe("pickCandidate", () => {
	test("takes the width nearest a feed reader's column", () => {
		expect(pickCandidate("/a.webp 640w, /b.webp 1080w, /c.webp 1920w")).toBe(
			"/b.webp",
		);
	});

	test("ignores candidates without a width", () => {
		expect(pickCandidate("/a.webp 2x")).toBeUndefined();
	});
});

describe("feedHtml", () => {
	test("points images at a full-URL candidate and drops the srcset", () => {
		const html = feedHtml(
			'<img src="/_astro/big.webp" srcset="/_astro/s.webp 960w, /_astro/l.webp 2048w" sizes="100vw" alt="Lake">',
			ORIGIN,
		);
		expect(html).toBe(
			'<img alt="Lake" src="https://sirlisko.com/_astro/s.webp" />',
		);
	});

	test("makes site links absolute and leaves others alone", () => {
		expect(feedHtml('<a href="/blog/100km">100km</a>', ORIGIN)).toBe(
			'<a href="https://sirlisko.com/blog/100km">100km</a>',
		);
		expect(feedHtml('<a href="https://example.com">x</a>', ORIGIN)).toBe(
			'<a href="https://example.com">x</a>',
		);
	});

	test("drops maps and diagrams without a screenshot", () => {
		const html = feedHtml(
			`<div data-gpx-map="/blog/gpx/day1.gpx"></div>
<div data-route-map="[]"></div>
<figure class="pele-diagram"><svg><text>A</text></svg></figure>
<p>Kept</p>`,
			ORIGIN,
		);
		expect(html.trim()).toBe("<p>Kept</p>");
	});

	test("swaps maps and diagrams for their screenshots, in page order", () => {
		const html = feedHtml(
			`<figure class="pele-diagram"><svg><text>A</text></svg></figure>
<div data-route-map='[{"name":"Prague"},{"name":"Brno"}]'></div>
<div data-gpx-map="/blog/gpx/day1.gpx"></div>`,
			ORIGIN,
			(n) => `/blog/feed/post-${n}.png`,
		);
		expect(html.split("\n")).toEqual([
			'<img src="https://sirlisko.com/blog/feed/post-1.png" alt="Diagram" />',
			'<img src="https://sirlisko.com/blog/feed/post-2.png" alt="Map" />',
			'<img src="https://sirlisko.com/blog/feed/post-3.png" alt="Map" />',
		]);
	});

	test("keeps collapsible sections", () => {
		expect(
			feedHtml("<details><summary>Spoiler</summary>x</details>", ORIGIN),
		).toBe("<details><summary>Spoiler</summary>x</details>");
	});
});
