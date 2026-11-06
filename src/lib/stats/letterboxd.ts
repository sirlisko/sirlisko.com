import { get, optional } from "./source";
import { xmlTag as tag, xmlItems } from "./xml";

export const LETTERBOXD_PROFILE = "https://letterboxd.com/sirlisko/";

// The profile page sits behind a bot check; the diary feed doesn't, but only has the last 50 entries.
const FEED = `${LETTERBOXD_PROFILE}rss/`;

export interface Film {
	title: string;
	year: string;
	url: string;
	/** Out of five, in half stars; missing when it wasn't rated. */
	rating?: number;
	watched: string;
}

export interface Films {
	latest: Film;
	/** This year's highest rated, the most recent on a tie; missing when nothing this year was rated. */
	best?: Film;
	thisYear: number;
	/** False when the feed runs out before the year's first entry, so the count is a floor. */
	complete: boolean;
}

export const parseDiary = (xml: string, year: number): Films | null => {
	const films = xmlItems(xml).flatMap((item) => {
		const title = tag(item, "letterboxd:filmTitle");
		const watched = tag(item, "letterboxd:watchedDate");
		if (!title || !watched) return [];
		const rating = tag(item, "letterboxd:memberRating");
		return [
			{
				title,
				year: tag(item, "letterboxd:filmYear") ?? "",
				url: tag(item, "link") ?? LETTERBOXD_PROFILE,
				...(rating && { rating: Number(rating) }),
				watched,
			},
		];
	});
	const [latest] = films;
	if (!latest) return null;
	const inYear = films.filter(({ watched }) => watched.startsWith(`${year}-`));
	// The feed is newest first, so a strict comparison keeps the latest of a tie.
	const best = inYear.reduce<Film | undefined>(
		(top, film) => ((film.rating ?? 0) > (top?.rating ?? 0) ? film : top),
		undefined,
	);
	return {
		latest,
		...(best && { best }),
		thisYear: inYear.length,
		complete: films.some(({ watched }) => Number(watched.slice(0, 4)) < year),
	};
};

export const fetchFilms = (year: number) =>
	optional("Letterboxd", async () =>
		parseDiary(await (await get(FEED)).text(), year),
	);
