/**
 * Every stat from another site is optional: when one can't be read, the build
 * warns and leaves its panel out rather than failing.
 */
export const optional = async <T>(
	source: string,
	load: () => Promise<T | null>,
): Promise<T | null> => {
	try {
		const result = await load();
		if (result === null) console.warn(`[stats] ${source}: nothing to show`);
		return result;
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		console.warn(`[stats] ${source} left out: ${reason}`);
		return null;
	}
};

export const get = async (url: string, init?: RequestInit) => {
	const response = await fetch(url, {
		...init,
		signal: AbortSignal.timeout(10_000),
	});
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	return response;
};
