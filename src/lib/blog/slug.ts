/** "Web Life" → "web-life"; accents fold to their base letter so tag URLs stay ASCII. */
export const slugify = (text: string): string =>
	text
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
