import { describe, expect, test } from "vitest";
import { parseShelf } from "./goodreads";

describe("parseShelf", () => {
	test("reads each book's pages, 0 when unknown", () => {
		const xml = `<rss><item>
			<title>Journal 29</title>
			<book id="34794475"><num_pages>148</num_pages></book>
		</item><item>
			<title><![CDATA[How to Invent Everything]]></title>
			<book id="1"><num_pages></num_pages></book>
		</item></rss>`;
		expect(parseShelf(xml)).toEqual([148, 0]);
	});
});
