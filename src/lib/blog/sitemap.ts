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

/** Post URL → lastmod, read from the files because the Astro config can't use astro:content. */
export const postLastmods = (dir: string): Map<string, string> =>
	new Map(
		readdirSync(dir)
			.filter((file) => /^[^_].*\.mdx?$/.test(file))
			.flatMap((file) => {
				const lastmod = lastmodOf(readFileSync(join(dir, file), "utf8"));
				const id = file.replace(/\.mdx?$/, "");
				return lastmod ? [[`${SITE_URL}${postUrl({ id })}`, lastmod]] : [];
			}),
	);
