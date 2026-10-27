/** How far through the page the reader is, from 0 to 100. */
export const scrollPercent = (root: HTMLElement = document.documentElement) => {
	const total = root.scrollHeight - root.clientHeight;
	return total > 0 ? (root.scrollTop / total) * 100 : 0;
};

/** A # link after each heading of the article, to share a section. */
export const addHeadingLinks = (article: HTMLElement) => {
	for (const heading of article.querySelectorAll<HTMLElement>(
		"h2[id], h3[id], h4[id], h5[id], h6[id]",
	)) {
		if (heading.querySelector(".heading-link")) {
			continue;
		}
		const link = document.createElement("a");
		link.className = "heading-link";
		link.href = `#${heading.id}`;
		link.ariaLabel = "Link to this section";
		const hash = document.createElement("span");
		hash.ariaHidden = "true";
		hash.textContent = "#";
		link.append(hash);
		heading.append(link);
	}
};

const WORDS_PER_MINUTE = 220;

/** Words of prose; code blocks are skimmed, not read, so they don't count. */
export const wordCount = (markdown: string): number => {
	const prose = markdown.replace(/^```[\s\S]*?^```/gm, "");
	return prose.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
};

export const readingMinutes = (markdown: string): number =>
	Math.max(1, Math.round(wordCount(markdown) / WORDS_PER_MINUTE));
