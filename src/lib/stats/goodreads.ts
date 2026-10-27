import { get, optional } from "./source";
import { xmlItems, xmlTag } from "./xml";

export const GOODREADS_PROFILE =
	"https://www.goodreads.com/user/show/3992676-luca-lischetti";

const FEED = "https://www.goodreads.com/review/list_rss/3992676";
// The feed pages 100 at a time and ignores bigger page sizes.
const PAGE_SIZE = 100;
// A stop in case the feed ever ignores the page number and repeats itself.
const MAX_PAGES = 20;

export interface Books {
	read: number;
	/** A floor: books with no page count on Goodreads add nothing. */
	pages: number;
}

/** Each book's page count, 0 when Goodreads doesn't know it. */
export const parseShelf = (xml: string): number[] =>
	xmlItems(xml).map((item) => Number(xmlTag(item, "num_pages")) || 0);

const shelf = async (name: string, page: number) =>
	parseShelf(await (await get(`${FEED}?shelf=${name}&page=${page}`)).text());

export const fetchBooks = () =>
	optional("Goodreads", async () => {
		const read: number[] = [];
		for (let page = 1; page <= MAX_PAGES; page++) {
			const books = await shelf("read", page);
			read.push(...books);
			if (books.length < PAGE_SIZE) break;
		}
		if (read.length === 0) return null;
		return {
			read: read.length,
			pages: read.reduce((sum, pages) => sum + pages, 0),
		};
	});
