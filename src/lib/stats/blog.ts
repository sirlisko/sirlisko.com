import { type Kind, postKind } from "../blog/kind";
import { wordCount } from "../blog/post";
import type { Post } from "../blog/posts";

export interface BlogStats {
	first: number;
	posts: number;
	words: number;
	/** Every year from the first post to now, quiet ones included. */
	years: { year: number; posts: number }[];
	kinds: { kind: Kind; count: number }[];
	km: number;
	climbed: number;
}

const KINDS: Kind[] = ["code", "life", "travel", "game", "walk"];

export const blogStats = (
	posts: Pick<Post, "data" | "body">[],
	now: number,
): BlogStats => {
	const yearOf = ({ data }: (typeof posts)[number]) =>
		data.pubDatetime.getFullYear();
	const first = Math.min(...posts.map(yearOf));
	const tracks = posts.flatMap(({ data }) => data.gpxFiles ?? []);
	return {
		first,
		posts: posts.length,
		words: posts.reduce((sum, post) => sum + wordCount(post.body ?? ""), 0),
		years: Array.from({ length: now - first + 1 }, (_, i) => ({
			year: first + i,
			posts: posts.filter((post) => yearOf(post) === first + i).length,
		})),
		kinds: KINDS.map((kind) => ({
			kind,
			count: posts.filter((post) => postKind(post) === kind).length,
		})).filter(({ count }) => count > 0),
		km: Math.round(tracks.reduce((sum, { distance = 0 }) => sum + distance, 0)),
		climbed: tracks.reduce((sum, { elevGain = 0 }) => sum + elevGain, 0),
	};
};
