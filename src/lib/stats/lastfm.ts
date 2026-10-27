import { get, optional } from "./source";

const USER = "sirLisko";
export const LASTFM_PROFILE = `https://www.last.fm/user/${USER}`;
const API = "https://ws.audioscrobbler.com/2.0/";

export interface Artist {
	name: string;
	plays: number;
	url: string;
}

export interface Music {
	scrobbles: number;
	since: number;
	/** Most played over the last 12 months, top first; Last.fm has no calendar-year period. */
	top: Artist[];
}

interface UserInfo {
	user: { playcount: string; registered: { unixtime: string } };
}

interface TopArtists {
	topartists: { artist: { name: string; playcount: string; url: string }[] };
}

export const parseMusic = (info: UserInfo, top: TopArtists): Music => ({
	scrobbles: Number(info.user.playcount),
	since: new Date(Number(info.user.registered.unixtime) * 1000).getFullYear(),
	top: top.topartists.artist.map(({ name, playcount, url }) => ({
		name,
		plays: Number(playcount),
		url,
	})),
});

export const fetchMusic = (key = import.meta.env.LASTFM_API_KEY) =>
	optional("Last.fm", async () => {
		if (!key) throw new Error("LASTFM_API_KEY is not set");
		const call = async <T>(params: Record<string, string>): Promise<T> => {
			const query = new URLSearchParams({
				format: "json",
				user: USER,
				api_key: key,
				...params,
			});
			return (await get(`${API}?${query}`)).json();
		};
		const [info, top] = await Promise.all([
			call<UserInfo>({ method: "user.getinfo" }),
			call<TopArtists>({
				method: "user.gettopartists",
				period: "12month",
				limit: "3",
			}),
		]);
		return parseMusic(info, top);
	});
