export interface Slash {
	url: string;
	blurb: string;
}

export const SLASHES_ABOUT = "https://slashpages.net";

export const slashes: Slash[] = [
	{ url: "/now", blurb: "What I'm up to right now" },
	{ url: "/uses", blurb: "The hardware and software I use daily" },
	{ url: "/stats", blurb: "Posts, walks, films and books, in numbers" },
	{ url: "/friends", blurb: "Friends and people I like around the web" },
	{ url: "/blog/walks", blurb: "Every hike I've written about, on a map" },
	{ url: "/credits", blurb: "How this site is made" },
];
