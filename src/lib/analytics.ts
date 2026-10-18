type Umami = NonNullable<Window["umami"]>;
type Call = (umami: Umami) => void;

export interface AnalyticsConfig {
	src: string;
	websiteId: string;
	domains: string;
}

// Calls made before the script arrives wait here, so a 404 hit on a fresh load still counts.
let queue: Call[] = [];
let blocked = false;

const send = (call: Call) => {
	if (window.umami) {
		call(window.umami);
	} else if (!blocked) {
		queue.push(call);
	}
};

const flush = () => {
	const calls = queue;
	queue = [];
	// Loaded but never installed counts as blocked too, or the queue would grow for the whole visit.
	blocked = !window.umami;
	for (const call of calls) {
		send(call);
	}
};

export const track = (
	...args: [event: string, data?: Record<string, unknown>]
) => send((umami) => umami.track(...args));

const pageview = () => {
	// Read now, since a queued pageview goes out after the script arrives.
	const page = {
		title: document.title,
		url:
			window.location.pathname + window.location.search + window.location.hash,
	};
	send((umami) => umami.track((props) => ({ ...props, ...page })));
};

/**
 * A script tag in the head holds back the load event, and with it the first
 * astro:page-load every component starts on, for as long as the stats server
 * takes to answer. Added after that, a slow server only delays the stats.
 */
export const initAnalytics = (
	{ src, websiteId, domains }: AnalyticsConfig,
	root: Document = document,
) => {
	let requested = false;

	const onPageLoad = () => {
		pageview();
		if (requested) {
			return;
		}
		requested = true;
		const script = root.createElement("script");
		Object.assign(script.dataset, { websiteId, autoTrack: "false", domains });
		script.src = src;
		script.addEventListener("load", flush);
		script.addEventListener("error", flush);
		root.head.append(script);
	};

	root.addEventListener("astro:page-load", onPageLoad);
	return () => root.removeEventListener("astro:page-load", onPageLoad);
};
