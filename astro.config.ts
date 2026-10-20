import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { defineConfig } from "astro/config";
import rehypeCallouts from "rehype-callouts";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import {
	rehypeResponsiveImages,
	transformerFileName,
} from "./src/lib/blog/markdown";
import gameBoyTheme from "./src/lib/blog/shikiGameBoy";

// https://astro.build/config
export default defineConfig({
	site: "https://sirlisko.com",
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => !/\/blog\/(search|404)\/?$/.test(page),
			// The blog home is listed as /blog/, which redirects to /blog.
			serialize: (item) => ({ ...item, url: item.url.replace(/\/$/, "") }),
		}),
	],
	trailingSlash: "never",
	markdown: {
		processor: unified({
			remarkPlugins: [
				remarkToc,
				[remarkCollapse, { test: "Table of contents" }],
			],
			// The github theme gives each alert type its own icon.
			rehypePlugins: [
				[rehypeCallouts, { theme: "github" }],
				rehypeResponsiveImages,
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
