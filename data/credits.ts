export interface Credit {
	role: string;
	name: string;
	url?: string;
}

export interface Roll {
	title: string;
	credits: Credit[];
}

export const SOURCE = "https://github.com/sirlisko/sirlisko.com";

export const rolls: Roll[] = [
	{
		title: "Staff",
		credits: [
			{ role: "Directed by", name: "Luca Lischetti" },
			{ role: "Design & code", name: "Luca Lischetti" },
			{ role: "QA", name: "Also Luca, sorry" },
		],
	},
	{
		title: "Levels",
		credits: [
			{ role: "Title screen", name: "Home", url: "/" },
			{ role: "Pac-Man", name: "/now", url: "/now" },
			{ role: "NES multicart", name: "/projects", url: "/projects" },
			{ role: "Zork", name: "/uses", url: "/uses" },
			{ role: "D&D character sheet", name: "/resume", url: "/resume" },
			{ role: "Game over", name: "/404", url: "/404" },
		],
	},
	{
		title: "Engine",
		credits: [
			{ role: "Framework", name: "Astro", url: "https://astro.build" },
			{
				role: "Language",
				name: "TypeScript",
				url: "https://www.typescriptlang.org",
			},
			{ role: "Lint", name: "Biome", url: "https://biomejs.dev" },
			{ role: "Tests", name: "Vitest", url: "https://vitest.dev" },
			{
				role: "Share cards",
				name: "Puppeteer & sharp",
				url: "https://pptr.dev",
			},
			{ role: "Hosting", name: "Netlify", url: "https://www.netlify.com" },
			{ role: "Stats", name: "Umami, self-hosted", url: "https://umami.is" },
		],
	},
	{
		title: "Type",
		credits: [
			{
				role: "Press Start 2P",
				name: "CodeMan38",
				url: "https://fonts.google.com/specimen/Press+Start+2P",
			},
			{
				role: "IBM Plex Mono",
				name: "IBM",
				url: "https://www.ibm.com/plex/",
			},
		],
	},
	{
		title: "Inspired by",
		credits: [
			{
				role: "/now pages",
				name: "Derek Sivers",
				url: "https://nownownow.com/about",
			},
			{ role: "/uses pages", name: "uses.tech", url: "https://uses.tech" },
		],
	},
	{
		title: "Secrets",
		credits: [
			{ role: "On any page", name: "↑ ↑ ↓ ↓ ← → ← → B A" },
			{ role: "On the home page", name: "Mind the ghost" },
			{ role: "After dark", name: "Find the lamp" },
		],
	},
	{
		title: "Special thanks",
		credits: [
			{ role: "For the inspiration", name: "Shigeru Miyamoto" },
			{ role: "For the code", name: "Kazuhisa Hashimoto" },
			{ role: "For playing", name: "You" },
		],
	},
];
