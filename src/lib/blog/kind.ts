import type { Post } from "./posts";

export type Kind = "walk" | "travel" | "game" | "code" | "life";

/** The archive's icon for a post: its most specific tag wins. web-life posts are about tools, unless they're also life. */
export const postKind = ({ data }: Pick<Post, "data">): Kind => {
	const tags = new Set(data.tags.map((tag) => tag.toLowerCase()));
	if (data.gpxFiles?.length || tags.has("hiking")) return "walk";
	if (tags.has("travel")) return "travel";
	if (tags.has("gaming")) return "game";
	if (tags.has("dev") || tags.has("projects")) return "code";
	if (tags.has("web-life") && !tags.has("life")) return "code";
	return "life";
};
