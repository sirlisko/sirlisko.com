export interface Friend {
	initials: string;
	url: string;
	score: number;
	note?: string;
}

export const friends: Friend[] = [
	{
		initials: "UNT",
		url: "https://untepid.com",
		score: 999990,
		note: "Partner & great artist",
	},
	{
		initials: "CED",
		url: "https://cedmax.net",
		score: 875420,
		note: "Friend & source of inspiration",
	},
	{
		initials: "RAI",
		url: "https://raibaz.it",
		score: 650300,
		note: "Good taste & recommendations",
	},
];
