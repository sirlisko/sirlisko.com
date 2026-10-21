const KEY = "backUrl";

// A post's back link returns to the list the reader came from, search query included.
// Storage can throw in private windows or with site data blocked; the link then just goes home.
export const rememberBackUrl = (url: string) => {
	try {
		sessionStorage.setItem(KEY, url);
	} catch {}
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
