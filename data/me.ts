interface Link {
	name: string;
	url: string;
	label: string;
	external?: boolean;
}

export interface Me {
	keywords: string[];
	descriptions: string[];
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
	links: [
		{
			name: "blog",
			url: "https://sirlisko.com/blog",
			label: "blog",
		},
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
			name: "github",
			url: "https://github.com/sirlisko",
			label: "github",
		},
		{
			name: "linkedIn",
			url: "https://linkedin.com/in/lucalischetti",
			label: "linkedIn",
			external: true,
		},
		{
			name: "mail",
			url: "mailto:luca@sirlisko.com",
			label: "mail me!",
		},
	],
} satisfies Me;

export default me;
