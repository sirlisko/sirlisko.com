import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const track = z.object({
	file: z.string(),
	color: z.string().optional(),
	label: z.string().optional(),
	distance: z.number().optional(),
	elevGain: z.number().optional(),
	duration: z.string().optional(),
});

const posts = defineCollection({
	// Files starting with _ are drafts begun in Obsidian, often without frontmatter yet.
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/posts",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDatetime: z.date(),
			modDatetime: z.date().optional().nullable(),
			bump: z.boolean().optional(),
			draft: z.boolean().optional(),
			tags: z.array(z.string()).default([]),
			ogImage: image().or(z.string()).optional(),
			canonicalURL: z.string().optional(),
			timezone: z.string().optional(),
			replyPrompt: z.string().optional(),
			/** A table of contents, in the margin on wide screens and above the post on narrower ones. */
			toc: z.boolean().optional(),
			gpxFiles: z.array(track).optional(),
		}),
});

export const collections = { posts };
