import sanitizeHtml from "sanitize-html";

// Feed readers choke on multi-megabyte images, so each post image goes out as
// the candidate closest to this width.
const FEED_IMAGE_WIDTH = 1000;

/** "/_astro/a.webp 640w, /_astro/b.webp 1280w" → the URL nearest the feed width. */
export const pickCandidate = (srcset: string): string | undefined =>
	srcset
		.split(",")
		.map((candidate) => {
			const [url = "", descriptor = ""] = candidate.trim().split(/\s+/);
			return {
				url,
				width: /^\d+w$/.test(descriptor) ? Number.parseInt(descriptor, 10) : 0,
			};
		})
		.filter(({ url, width }) => url && width)
		.sort(
			(a, b) =>
				Math.abs(a.width - FEED_IMAGE_WIDTH) -
				Math.abs(b.width - FEED_IMAGE_WIDTH),
		)[0]?.url;

const absolute = (url: string, origin: string) =>
	url.startsWith("/") ? `${origin}${url}` : url;

/**
 * A rendered post, cleaned up for feed readers: maps and the table of
 * contents only work on the page, and every link and image needs the full URL.
 */
export const feedHtml = (html: string, origin: string): string =>
	sanitizeHtml(html, {
		allowedTags: [
			...sanitizeHtml.defaults.allowedTags,
			"img",
			"details",
			"summary",
		],
		exclusiveFilter: ({ tag, attribs, text }) =>
			"data-gpx-map" in attribs ||
			"data-route-map" in attribs ||
			(tag === "details" && /^\s*Table of contents/i.test(text)),
		transformTags: {
			img: (tagName, { srcset, src = "", ...attribs }) => ({
				tagName,
				attribs: {
					...attribs,
					src: absolute((srcset && pickCandidate(srcset)) || src, origin),
				},
			}),
			a: (tagName, { href = "", ...attribs }) => ({
				tagName,
				attribs: { ...attribs, href: absolute(href, origin) },
			}),
		},
	});
