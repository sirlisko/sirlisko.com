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
		// Set by the Umami script that lib/analytics.ts loads.
		umami?: {
			track: {
				(event: string, data?: Record<string, unknown>): void;
				/** A pageview, with Umami's own payload passed in to adjust. */
				(
					payload: (props: Record<string, unknown>) => Record<string, unknown>,
				): void;
			};
		};
	}
}
