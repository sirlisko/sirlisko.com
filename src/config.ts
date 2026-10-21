import OG_CARDS from "../data/og.json";

export const SITE_URL = "https://sirlisko.com";
export const SITE_DOMAIN = "sirlisko.com";

export const SITE = {
	title: `sirlisko`,
	description: `Ciao! I'm Luca, another fellow developer, cook, hiker, dungeon crawler, and maker of things. Web stuff, games, dinner, bad decisions, and sometimes all at once.`,
	image: `${SITE_URL}/images/me_banner.jpg`,
	imageAlt: `Luca Lischetti, aka sirlisko`,
	imageWidth: 2048,
	imageHeight: 1024,
};

// Drawn by scripts/generate-og.mjs; rerun it after changing a card.
export const ogCard = (page: keyof typeof OG_CARDS) => {
	const { title, tagline } = OG_CARDS[page];
	return {
		image: `${SITE_URL}/images/og/${page}.png`,
		imageWidth: 1200,
		imageHeight: 630,
		imageAlt: `${title}: ${tagline}. Pixel-art portrait of Luca Lischetti, sirlisko.com`,
	};
};

export const BLOG = {
	path: "/blog",
	url: `${SITE_URL}/blog`,
	title: "sirlisko blog",
	description: "Luca's notes on code, travel, long walks and games.",
	timezone: "Europe/London",
	/** Shown with their descriptions above the full list. */
	latest: 3,
	// A post scheduled a little ahead still goes out with the build that publishes it.
	scheduledPostMargin: 15 * 60 * 1000,
	replyTo: "blog@sirlisko.com",
};

export const BLOG_FEED = `${BLOG.url}/rss.xml`;

/** Webmention.io collects mentions of any page here; Bridgy Fed delivers fediverse replies to it too. */
export const WEBMENTION_ENDPOINT = `https://webmention.io/${SITE_DOMAIN}/webmention`;

export const AUTHOR = {
	// Blog posts point their author here too, so every page describes one person.
	id: `${SITE_URL}/#person`,
	name: "Luca Lischetti",
	alternateName: "sirlisko",
	firstName: "Luca",
	lastName: "Lischetti",
	username: "sirlisko",
	jobTitle: "Senior software engineer",
	profiles: {
		GitHub: "https://github.com/sirlisko",
		LinkedIn: "https://www.linkedin.com/in/lucalischetti/",
	},
};

export const ANALYTICS = {
	src: "https://stats.sirlisko.com/script.js",
	websiteId: "b771f6f1-7c6a-477e-a4ae-69054cb56717",
	domains: SITE_DOMAIN,
};
