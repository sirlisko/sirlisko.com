import { getCollection, render } from "astro:content";
import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { BLOG, SITE_URL } from "../../config";
import { feedHtml } from "../../lib/blog/feed";
import { cropOgImage } from "../../lib/blog/ogImage";
import {
	type Post,
	postUrl,
	publishedPosts,
	sortDate,
} from "../../lib/blog/posts";

// Covers are cut to the share card, so readers don't fetch the full-size photo.
const enclosure = async ({ data, ...post }: Post) => {
	if (typeof data.ogImage === "string") {
		return {
			url: data.ogImage,
			type: data.ogImage.endsWith(".png") ? "image/png" : "image/jpeg",
		};
	}
	if (data.ogImage) {
		const { src } = await cropOgImage(data.ogImage);
		return {
			url: `${SITE_URL}${src}`,
			type: src.endsWith(".png") ? "image/png" : "image/jpeg",
		};
	}
	return { url: `${SITE_URL}${postUrl(post)}/index.png`, type: "image/png" };
};

export async function GET() {
	const container = await AstroContainer.create();
	const posts = publishedPosts(await getCollection("posts"));

	const items = await Promise.all(
		posts.map(async (post) => {
			const { Content } = await render(post);
			const html = await container.renderToString(Content);
			return {
				link: postUrl(post),
				title: post.data.title,
				description: post.data.description,
				pubDate: sortDate(post.data),
				content: feedHtml(html, SITE_URL),
				enclosure: { ...(await enclosure(post)), length: 0 },
			};
		}),
	);

	return rss({
		title: BLOG.title,
		description: BLOG.description,
		site: BLOG.url,
		items,
		trailingSlash: false,
	});
}
