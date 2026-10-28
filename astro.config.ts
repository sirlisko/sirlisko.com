import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { defineConfig } from "astro/config";
import { pele } from "astro-pele";
import rehypeCallouts from "rehype-callouts";
import {
	rehypeResponsiveImages,
	rehypeTaskListLabels,
	transformerFileName,
} from "./src/lib/blog/markdown";
import gameBoyTheme from "./src/lib/blog/shikiGameBoy";
import { postLastmods } from "./src/lib/blog/sitemap";

const lastmods = postLastmods("./src/content/posts");

// Diagrams are set in Plex Mono, where every glyph is 0.6em wide. Pele's default
// metrics are for a proportional font, so labels overflowed their boxes.
const plexMonoMeasurer = {
	width: (text: string, size: number) => [...text].length * size * 0.6,
};

// https://astro.build/config
export default defineConfig({
	site: "https://sirlisko.com",
	integrations: [
		mdx(),
		pele({ measurer: plexMonoMeasurer }),
		sitemap({
			filter: (page) => !/\/blog\/(search|404)\/?$/.test(page),
			// The blog home is listed as /blog/, which redirects to /blog.
			serialize: (item) => {
				const url = item.url.replace(/\/$/, "");
				const lastmod = lastmods.get(url);
				return { ...item, url, ...(lastmod && { lastmod }) };
			},
		}),
	],
	trailingSlash: "never",
	markdown: {
		processor: unified({
			// The github theme gives each alert type its own icon.
			rehypePlugins: [
				[rehypeCallouts, { theme: "github" }],
				rehypeResponsiveImages,
				rehypeTaskListLabels,
			],
		}),
		shikiConfig: {
			// Code blocks are a dark Game Boy screen in both colour schemes. Without a
			// default colour Shiki only sets variables, so prose.css applies the colours alone.
			themes: { light: gameBoyTheme, dark: gameBoyTheme },
			defaultColor: false,
			wrap: false,
			transformers: [
				transformerFileName(),
				transformerNotationHighlight(),
				transformerNotationWordHighlight(),
				transformerNotationDiff({ matchAlgorithm: "v3" }),
			],
		},
	},
});
