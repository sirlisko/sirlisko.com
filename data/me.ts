export interface Link {
	name: string;
	url: string;
	label: string;
	/** The blog is same-origin but a separate site, so the router must not swap it in. */
	reload?: boolean;
}

export interface Me {
	keywords: string[];
	descriptions: string[];
	email: string;
	links: Link[];
}

const me = {
	keywords: [
		"Luca Lischetti",
		"sirlisko",
		"web developer",
		"dreamer",
		"8-bit",
		"super hero",
	],
	descriptions: [
		"developer",
		"super hero",
		"dreamer",
		"8-bit lover",
		"sleeper",
		"bug creator",
		"yak shaver",
		"rubber duck",
		"zombie coder",
		"pizza eater",
	],
	email: "luca@sirlisko.com",
	links: [
		{
			name: "projects",
			url: "/projects",
			label: "projects",
		},
		{
			name: "resume",
			url: "/resume",
			label: "resume",
		},
		{
			name: "now",
			url: "/now",
			label: "now",
		},
		{
			name: "uses",
			url: "/uses",
			label: "uses",
		},
		{
			name: "blog",
			url: "/blog",
			label: "blog",
			reload: true,
		},
	],
} satisfies Me;

export default me;
