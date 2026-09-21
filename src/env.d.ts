import "astro/client";

/// <reference path="../.astro/types.d.ts" />

declare global {
	interface ImportMetaEnv {
		/** Set only by `pnpm generate:cv`; never in a public deploy. */
		readonly CV_BUILD?: string;
		/** Read from `.env`, rendered only when CV_BUILD is set. */
		readonly PHONE_NUMBER?: string;
	}

	interface Window {
		// Injected by the umami script loaded in Layout.astro.
		umami?: {
			track: (event: string, data?: Record<string, unknown>) => void;
		};
	}
}
