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

type Attribs = Record<string, string>;

// Maps and diagrams only work on the page: maps need Leaflet, and diagrams are
// inline SVG themed by the page's CSS. The feed gets a screenshot of each one,
// taken by scripts/generate-feed-images.mjs.
const isVisual = (attribs: Attribs) =>
	"data-gpx-map" in attribs ||
	"data-route-map" in attribs ||
	attribs.class === "pele-diagram";

const visualAlt = (attribs: Attribs) => {
	if (attribs.class === "pele-diagram") return "Diagram";
	try {
		const stops: { name: string }[] = JSON.parse(
			attribs["data-route-map"] ?? "",
		);
		return `Route map: ${stops.map(({ name }) => name).join(" → ")}`;
	} catch {
		return "Map of the route";
	}
};

/**
 * A rendered post, cleaned up for feed readers: maps and diagrams become their
 * screenshots, numbered from 1 in page order, or are dropped if there is none,
 * and every link and image needs the full URL.
 */
export const feedHtml = (
	html: string,
	origin: string,
	screenshot: (n: number) => string | undefined = () => undefined,
): string => {
	let visuals = 0;
	return sanitizeHtml(html, {
		allowedTags: [
			...sanitizeHtml.defaults.allowedTags,
			"img",
			"details",
			"summary",
		],
		// sanitize-html's defaults, which it doesn't export, plus svg: a diagram's
		// text would otherwise be left behind as one run-on string.
		nonTextTags: ["script", "style", "textarea", "option", "xmp", "svg"],
		exclusiveFilter: ({ attribs }) => isVisual(attribs),
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
			"*": (tagName, attribs) => {
				const src = isVisual(attribs) && screenshot(++visuals);
				return src
					? {
							tagName: "img",
							attribs: { src: absolute(src, origin), alt: visualAlt(attribs) },
						}
					: { tagName, attribs };
			},
		},
	});
};
