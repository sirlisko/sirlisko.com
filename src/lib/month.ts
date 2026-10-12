/** "2026-10" → "October 2026"; pinned to UTC so the build machine's zone can't shift the month. */
export const formatMonth = (month: string): string =>
	new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-GB", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	});
