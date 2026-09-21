import "astro/client";

/// <reference path="../.astro/types.d.ts" />

declare global {
	interface Window {
		// Injected by Netlify post-processing (see netlify.toml proxies).
		umami?: {
			track: (event: string, data?: Record<string, unknown>) => void;
		};
	}
}
