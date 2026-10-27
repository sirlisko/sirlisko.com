import { get, optional } from "./source";
import { UN_STATES } from "./unStates";

export interface Countries {
	count: number;
	/** The public map the count comes from. */
	profile: string;
	/** Of the world's UN states, to one decimal place like Been shows it. */
	percentage: string;
}

/** Territories such as Gibraltar are on the map but, as on Been, not in the count. */
export const countStates = (codes: string[]): Omit<Countries, "profile"> => {
	const count = codes.filter((code) => UN_STATES.has(code)).length;
	return { count, percentage: ((count / UN_STATES.size) * 100).toFixed(1) };
};

export const fetchCountries = (
	{ BEEN_PROFILE: profile, BEEN_RPC: rpc, BEEN_ANON_KEY: key } = import.meta
		.env,
) =>
	optional("Been", async (): Promise<Countries | null> => {
		if (!profile || !rpc || !key) {
			throw new Error("BEEN_PROFILE, BEEN_RPC and BEEN_ANON_KEY must be set");
		}
		// The username is the @handle the profile URL ends with.
		const name = new URL(profile).pathname.replace(/^\/@/, "");
		const response = await get(rpc, {
			method: "POST",
			headers: { apikey: key, "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		});
		const codes: unknown = await response.json();
		return Array.isArray(codes) ? { ...countStates(codes), profile } : null;
	});
