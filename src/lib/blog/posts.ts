import type { CollectionEntry } from "astro:content";
import { BLOG } from "../../config";
import { slugify } from "./slug";

export type Post = CollectionEntry<"posts">;

export type NotLive = "draft" | "scheduled";

export const notLive = (
	{ data }: Pick<Post, "data">,
	now = Date.now(),
): NotLive | null => {
	if (data.draft) return "draft";
	if (now <= data.pubDatetime.getTime() - BLOG.scheduledPostMargin)
		return "scheduled";
	return null;
};

/** Dev shows drafts and scheduled posts too, flagged as not live, since writing needs them. */
export const isPublished = (
	post: Pick<Post, "data">,
	now = Date.now(),
	dev = import.meta.env.DEV,
): boolean => dev || !notLive(post, now);

/** An update only moves a post up the lists when it sets `bump: true`; otherwise it's just shown. */
export const sortDate = ({
	pubDatetime,
	modDatetime,
	bump,
}: Pick<Post["data"], "pubDatetime" | "modDatetime" | "bump">): Date =>
	bump && modDatetime ? modDatetime : pubDatetime;

export const publishedPosts = <T extends Pick<Post, "data">>(posts: T[]): T[] =>
	posts
		.filter((post) => isPublished(post))
		.sort((a, b) => sortDate(b.data).getTime() - sortDate(a.data).getTime());

/** Filenames start with the date to sort on disk; URLs leave it out, as they always have. */
export const postSlug = (id: string): string =>
	id.slice(id.lastIndexOf("/") + 1).replace(/^\d{4}-\d{2}-\d{2}-/, "");

export const postUrl = ({ id }: Pick<Post, "id">): string =>
	`${BLOG.path}/${postSlug(id)}`;

export const tagUrl = (tag: string): string =>
	`${BLOG.path}/tags/${slugify(tag)}`;

export interface Tag {
	slug: string;
	name: string;
	count: number;
}

/** Tags of published posts, merged by slug so "Dev" and "dev" are one tag. */
export const tagsOf = (posts: Pick<Post, "data">[]): Tag[] => {
	const tags = new Map<string, Tag>();
	for (const post of posts.filter((post) => isPublished(post))) {
		// Reversed so the first spelling of a tag wins.
		const names = new Map(
			post.data.tags.map((name) => [slugify(name), name] as const).reverse(),
		);
		for (const [slug, name] of names) {
			const tag = tags.get(slug) ?? { slug, name, count: 0 };
			tag.count++;
			tags.set(slug, tag);
		}
	}
	return [...tags.values()].sort((a, b) => a.slug.localeCompare(b.slug));
};

export const hasTag = (post: Pick<Post, "data">, slug: string): boolean =>
	post.data.tags.some((tag) => slugify(tag) === slug);
