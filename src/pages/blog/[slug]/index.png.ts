import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { BLOG } from "../../../config";
import { formatPostDate } from "../../../lib/blog/date";
import { renderGameBoyCard } from "../../../lib/blog/ogCard";
import { type Post, postSlug, publishedPosts } from "../../../lib/blog/posts";

// Only posts without a cover of their own get a card.
export const getStaticPaths = (async () =>
	publishedPosts(await getCollection("posts"))
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: postSlug(post.id) },
			props: { post },
		}))) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = async ({ props }) => {
	const { title, pubDatetime, timezone } = props.post.data;
	const png = await renderGameBoyCard({
		title,
		meta: formatPostDate(pubDatetime, timezone ?? BLOG.timezone),
	});
	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
