import type { AstroUserConfig } from "astro";

type ShikiTransformer = NonNullable<
	NonNullable<
		NonNullable<AstroUserConfig["markdown"]>["shikiConfig"]
	>["transformers"]
>[number];

interface Node {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: Node[];
}

// Posts render in a 768px column (minus the 1rem gutters); left to the
// constrained layout's own guess, desktops would download candidates far wider.
const SIZES = "(min-width: 768px) 736px, calc(100vw - 2rem)";

// Astro only optimises images it imports; public and remote ones would keep
// layout as a stray HTML attribute.
const isImported = (src: unknown) =>
	typeof src === "string" && !/^(\/|[a-z]+:)/i.test(src);

const makeResponsive = (node: Node) => {
	if (
		node.tagName === "img" &&
		node.properties &&
		isImported(node.properties.src)
	) {
		node.properties.layout ??= "constrained";
		node.properties.sizes ??= SIZES;
	}
	node.children?.forEach(makeResponsive);
};

/**
 * Post images get a srcset sized to the column. Astro hands an image's
 * properties to its image service, so this sets the layout per image rather
 * than as the site-wide default, which would override every other page's images.
 */
export const rehypeResponsiveImages = () => makeResponsive;

const isCheckbox = (node: Node) =>
	node.tagName === "input" && node.properties?.type === "checkbox";

const isBlock = (node: Node) =>
	node.tagName === "p" || node.tagName === "ul" || node.tagName === "ol";

const labelTasks = (node: Node) => {
	const children = node.children;
	if (!children || node.tagName === "label") {
		return;
	}
	const start = children.findIndex(isCheckbox);
	if (start !== -1) {
		const next = children.findIndex((child, i) => i > start && isBlock(child));
		const end = next === -1 ? children.length : next;
		children.splice(start, end - start, {
			type: "element",
			tagName: "label",
			properties: {},
			children: children.slice(start, end),
		});
	}
	children.forEach(labelTasks);
};

/** Names each task list checkbox after its item's text, for screen readers. */
export const rehypeTaskListLabels = () => labelTasks;

/** ```ts file="astro.config.ts" puts a badge with the file name on the block. */
export const transformerFileName = (): ShikiTransformer => ({
	pre(node) {
		const file = this.options.meta?.__raw?.match(
			/\bfile=["'`]?([^"'`\s]+)/,
		)?.[1];
		if (!file) {
			return;
		}
		this.addClassToHast(node, "has-file-name");
		node.children.push({
			type: "element",
			tagName: "span",
			properties: { class: "file-name" },
			children: [{ type: "text", value: file }],
		});
	},
});
