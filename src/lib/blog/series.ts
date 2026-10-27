import type { Post } from "./posts";

/** The posts in a post's series, oldest first; empty when it isn't part of one. */
export const seriesOf = <T extends Pick<Post, "data">>(
	post: T,
	posts: T[],
): T[] => {
	const { series } = post.data;
	if (!series) return [];
	const parts = posts
		.filter(({ data }) => data.series === series)
		.toSorted(
			(a, b) => a.data.pubDatetime.getTime() - b.data.pubDatetime.getTime(),
		);
	return parts.length > 1 ? parts : [];
};
