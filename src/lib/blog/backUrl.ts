const KEY = "backUrl";

// A post's back link returns to the list the reader came from, search query included.
// Storage can throw in private windows or with site data blocked; the link then just goes home.
export const rememberBackUrl = (url: string) => {
	try {
		sessionStorage.setItem(KEY, url);
	} catch {}
};

export const forgetBackUrl = () => {
	try {
		sessionStorage.removeItem(KEY);
	} catch {}
};

/**
 * Lists remember themselves; posts keep whatever list led to them, so the
 * back link survives hopping between posts. Any other page breaks the trail.
 */
export const trackBackUrl = (root: ParentNode = document) => {
	const url =
		root.querySelector<HTMLElement>("[data-back-url]")?.dataset.backUrl;
	if (url) {
		rememberBackUrl(url);
	} else if (!root.querySelector("[data-remembered-back]")) {
		forgetBackUrl();
	}
};

export const recallBackUrl = (): string | null => {
	try {
		return sessionStorage.getItem(KEY);
	} catch {
		return null;
	}
};

/** The list a back link returns to, as a path under /blog: "/tags/dev", "/search", or "/blog" itself. */
export const backLabel = (url: string): string =>
	new URL(url, "https://example.com").pathname.replace(/^\/blog(?=\/.)/, "");
