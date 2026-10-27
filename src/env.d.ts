import "astro/client";

/// <reference path="../.astro/types.d.ts" />

declare global {
	interface ImportMetaEnv {
		/** Set only by `pnpm generate:cv`; never in a public deploy. */
		readonly CV_BUILD?: string;
		/** Read from `.env`, rendered only when CV_BUILD is set. */
		readonly PHONE_NUMBER?: string;
		/** For /stats; without it the music panel is left out. */
		readonly LASTFM_API_KEY?: string;
		/** Been's public map for /stats: the profile page, its RPC and the anon key that calls it. */
		readonly BEEN_PROFILE?: string;
		readonly BEEN_RPC?: string;
		readonly BEEN_ANON_KEY?: string;
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
