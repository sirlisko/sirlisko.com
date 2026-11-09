import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "../../config";
import { postUrl } from "./posts";

const dateField = (frontmatter: string, field: string): string | undefined =>
	frontmatter.match(new RegExp(`^${field}:\\s*(\\d\\S*)`, "m"))?.[1];

/** The last time a post changed, as the sitemap's lastmod wants it. */
export const lastmodOf = (frontmatter: string): string | undefined => {
	const date =
		dateField(frontmatter, "modDatetime") ??
		dateField(frontmatter, "pubDatetime");
	return date && new Date(date).toISOString();
};

/** The slug a post sets for itself, which replaces its file name in the URL. */
export const slugOf = (frontmatter: string): string | undefined =>
	frontmatter.match(/^slug:\s*["']?([^"'\s]+)/m)?.[1];

/** Post URL → lastmod, read from the files because the Astro config can't use astro:content. */
export const postLastmods = (dir: string): Map<string, string> =>
	new Map(
		readdirSync(dir)
			.filter((file) => /^[^_].*\.mdx?$/.test(file))
			.flatMap((file) => {
				const [, frontmatter = ""] = readFileSync(
					join(dir, file),
					"utf8",
				).split(/^---$/m);
				const lastmod = lastmodOf(frontmatter);
				const id = slugOf(frontmatter) ?? file.replace(/\.mdx?$/, "");
				return lastmod ? [[`${SITE_URL}${postUrl({ id })}`, lastmod]] : [];
			}),
	);
