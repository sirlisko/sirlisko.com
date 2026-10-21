import type { MarkdownHeading } from "astro";

/** Sections and their subsections; the footnotes heading is only there for screen readers. */
export const tocHeadings = (headings: MarkdownHeading[]): MarkdownHeading[] =>
	headings.filter(
		({ depth, slug }) => depth >= 2 && depth <= 3 && slug !== "footnote-label",
	);

/** The section being read: the last one whose heading has passed the reading line. */
export const currentSection = (
	sections: { id: string; top: number }[],
	line: number,
): string | undefined => sections.findLast(({ top }) => top <= line)?.id;
