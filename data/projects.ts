import type { IconName } from "../src/lib/pixelIcon";

interface BaseProject {
	title: string;
	description: string[];
	links: Record<string, string>;
	tech: string[];
}

interface ProjectWithLogo extends BaseProject {
	logo: string;
	invertIcon?: boolean;
}
interface ProjectWithIcon extends BaseProject {
	icon: IconName;
}
interface ProjectWithScreenshot extends BaseProject {
	screenshot: string;
}

export type Project = ProjectWithLogo | ProjectWithIcon | ProjectWithScreenshot;

export const projects = [
	{
		title: "Talelock",
		description: [
			"Story-driven treasure hunts played on your phone. No app, no account, just a link.",
			"A studio for writing hunts with riddles, QR codes, GPS and photo steps, and a player for walking them.",
		],
		screenshot: "/images/projects/screens/talelock.webp",
		links: {
			Website: "https://talelock.com",
		},
		tech: [
			"React",
			"TypeScript",
			"Tailwind",
			"Supabase",
			"PostgreSQL",
			"Edge Functions",
			"Leaflet",
		],
	},
	{
		title: "Moon",
		description: [
			"A live 3D Moon showing its real phase and position from where you stand, plus a lunar calendar.",
			"Textured with NASA imagery, with the phase and position calculated rather than fetched.",
		],
		screenshot: "/images/projects/screens/moon.webp",
		links: {
			Website: "https://moon.sirlisko.com",
			Github: "https://github.com/sirlisko/moon",
		},
		tech: ["Three.js", "WebGL", "TypeScript", "astronomy-engine"],
	},
	{
		title: "Is It Raining in London?",
		description: [
			"Is it raining in London right now? Probably not.",
			'A live answer plus a year of real rainfall data comparing London with cities around the world, with a "near you" card from IP geolocation.',
		],
		screenshot: "/images/projects/screens/rainylondon.webp",
		links: {
			Website: "https://rainylondon.sirlisko.com",
			Github: "https://github.com/sirlisko/rainyLondon",
		},
		tech: ["TypeScript", "Open-Meteo API", "Edge Functions"],
	},
	{
		title: "GigPlayList",
		description: [
			"Predicts the setlist for an upcoming gig and builds you a Spotify playlist.",
			"Mashes up recent setlists and track data from third-party music APIs to work out what the band will play.",
		],
		screenshot: "/images/projects/screens/gigplaylist.webp",
		links: {
			Website: "https://gigplaylist.sirlisko.com",
			Github: "https://github.com/sirlisko/gigplaylist",
		},
		tech: [
			"Next.js",
			"TypeScript",
			"Spotify API",
			"Setlist.fm API",
			"MusicBrainz API",
			"Songkick API",
			"OAuth",
			"Tailwind",
		],
	},
	{
		title: "Countdown",
		description: [
			"Customisable countdowns for future and past events.",
			"Yearly rollovers, progress bars, obfuscated share links, calendar export, and Open Graph previews rendered on the edge.",
		],
		screenshot: "/images/projects/screens/countdown.webp",
		links: {
			Website: "https://countdown.sirlisko.com/",
			Github: "https://github.com/sirlisko/countdown",
		},
		tech: ["React", "TypeScript", "Tailwind", "shadcn/ui", "Edge Functions"],
	},
	{
		title: "Been",
		description: [
			"Track the countries you've visited on an interactive world map.",
			"Every map gets a public profile you can share, like /@luca.",
		],
		screenshot: "/images/projects/screens/been.webp",
		links: {
			Website: "https://been.sirlisko.com/@luca",
			Github: "https://github.com/sirlisko/been",
		},
		tech: [
			"React",
			"TypeScript",
			"Tailwind",
			"Supabase",
			"PostgreSQL",
			"Edge Functions",
		],
	},
	{
		title: "Curse of Strahd",
		description: [
			"Companion site for an Italian Curse of Strahd D&D campaign, with a recap written from every session's recording.",
			"Parakeet transcribes the audio on the Neural Engine, then Claude Code runs headless to write the session journal and update characters, NPCs and places.",
		],
		screenshot: "/images/projects/screens/strahd.webp",
		links: {
			Website: "https://strahd.ogreballerino.com",
			Github: "https://github.com/sirlisko/strahd",
		},
		tech: ["Astro", "Parakeet", "AI Recaps", "Pagefind"],
	},
	{
		title: "GifDay",
		description: [
			"Assign a GIF to every day of the year. Your year, in GIFs.",
			"Search GIPHY for the right one, and your year syncs across devices.",
		],
		screenshot: "/images/projects/screens/gifday.webp",
		links: {
			Website: "https://gifday.sirlisko.com/",
			Github: "https://github.com/sirlisko/gifday",
		},
		tech: [
			"React",
			"TypeScript",
			"Tailwind",
			"GIPHY API",
			"Supabase",
			"PostgreSQL",
		],
	},
	{
		title: "pixelicons",
		description: [
			"Any Iconify icon, redrawn as crisp pixel art.",
			"Browse 200+ icon sets, tune the grid, fix pixand export SVGs, a sprite or a PNG sheet.",
		],
		screenshot: "/images/projects/screens/pixelicons.webp",
		links: {
			Website: "https://pixelicons.sirlisko.com",
			Github: "https://github.com/sirlisko/pixelicon",
		},
		tech: ["TypeScript", "Vite", "resvg (WASM)", "Iconify"],
	},
] satisfies Project[];

export const tinyProjects = [
	{
		title: "Umami Digest",
		description: [
			"Daily, weekly or monthly analytics email digests for Umami.",
		],
		icon: "Mail",
		links: {
			Blog: "https://sirlisko.com/blog/umami-digest",
			Github: "https://github.com/sirlisko/umami-digest",
		},
		tech: ["Cloudflare Workers", "TypeScript", "Umami API", "Resend API"],
	},
	{
		title: "ZoomMEME",
		description: [
			"Drag-and-drop zoom-in meme generator. Does exactly what it says.",
		],
		screenshot: "/images/projects/screens/zoommeme.webp",
		links: {
			Website: "https://zoomme.me",
			Github: "https://github.com/sirlisko/zoommeme",
		},
		tech: ["Vanilla JS", "PWA"],
	},
	{
		title: "Martellone Alexa Skill",
		description: [
			"Dedicated to the legendary Nando Martellone, from the Italian TV show Boris.",
		],
		logo: "/images/projects/martellone.png",
		invertIcon: true,
		links: {
			"Amazon UK store":
				"https://www.amazon.co.uk/sirlisko-Martellone-Boris/dp/B08C7SHW3T/",
			"Amazon IT store":
				"https://www.amazon.it/sirlisko-Martellone-Boris/dp/B08C7SHW3T/",
			Github: "https://github.com/sirlisko/martellone-alexa-skill",
		},
		tech: ["Alexa Skill", "AWS Lambda", "Serverless"],
	},
	{
		title: "Pizza Club",
		description: [
			"A personal log of every pizza eaten around the world. Because someone has to.",
			"A map and stats for every pizzeria visited.",
		],
		screenshot: "/images/projects/screens/pizzaclub.webp",
		links: {
			Website: "https://pizzaclub.sirlisko.com/",
			Github: "https://github.com/sirlisko/pizzaclub",
		},
		tech: ["Astro", "Sanity", "MapLibre"],
	},
	{
		title: "Can I Have a Cappuccino?",
		description: [
			"Can I have a cappuccino right now? The Italian verdict, updated every minute.",
			"One static page, in English and Italian, with the rules of Italian coffee etiquette.",
		],
		screenshot: "/images/projects/screens/cappuccino.webp",
		links: {
			Website: "https://cappuccino.sirlisko.com",
		},
		tech: ["HTML", "CSS", "Vanilla JS"],
	},
] satisfies Project[];

export const NPMPackages = [
	{
		title: "World Map Country Shapes",
		description: [
			"Every country in the world as an SVG path, ready to drop into your own map.",
			"210 countries and territories keyed by ISO code, each with the box to zoom to it. Framework-agnostic and dependency-free.",
		],
		icon: "Earth",
		links: {
			"NPM Module": "https://npmjs.com/package/world-map-country-shapes",
			Github: "https://github.com/sirlisko/world-map-country-shapes",
		},
		tech: ["SVG"],
	},
	{
		title: "Git Branch Switcher",
		description: [
			"Interactive CLI to switch, search and delete git branches.",
			"Installs the br command, with branches sorted by most recent commit.",
		],
		icon: "GitBranch",
		links: {
			"NPM Module": "https://npmjs.com/package/git-branch-switcher",
			Blog: "https://sirlisko.com/blog/git-branch-switcher",
			Github: "https://github.com/sirlisko/git-branch-switcher",
		},
		tech: ["CLI", "TypeScript", "Node.js"],
	},
	{
		title: "Redux Persist Transform Expire-in",
		description: ["Resets persisted Redux state after a configurable TTL."],
		icon: "Atom",
		links: {
			"NPM Module":
				"https://npmjs.com/package/redux-persist-transform-expire-in",
			Github: "https://github.com/sirlisko/redux-persist-transform-expire-in",
			Demo: "https://codesandbox.io/s/redux-persist-transform-expire-in-lmj74q",
		},
		tech: ["Redux"],
	},
	{
		title: "UK Postcode Validator",
		description: ["Validates UK postcodes. Tiny on purpose."],
		icon: "MapPinHouse",
		links: {
			"NPM Module": "https://npmjs.com/package/uk-postcode-validator",
			Github: "https://github.com/sirlisko/uk-postcode-validator",
		},
		tech: ["Regex"],
	},
] satisfies Project[];

export const pastProjects = [
	{
		title: "Shazamify (a.k.a. Zamify)",
		description: ["Play your Shazams in Spotify directly from the browser."],
		logo: "/images/projects/shazamify.png",
		links: {
			Blog: "https://sirlisko.com/blog/shazamify",
			Github: "https://github.com/sirlisko/shazamify",
		},
		tech: ["Chrome Extension", "Spotify API", "OAuth"],
	},
	{
		title: "Audible RSS",
		description: [
			"RSS feed of the latest Audible releases, scraped from the Audible site.",
		],
		logo: "/images/projects/audible.svg",
		links: {
			Github: "https://github.com/sirlisko/audible-rss",
		},
		tech: ["Node.js", "Express", "React", "Web Scraping"],
	},
	{
		title: "Gulp Blacklist Marker",
		description: [
			"Flags blacklisted gulp plugins while you browse npm and GitHub.",
		],
		logo: "/images/projects/gulp.png",
		invertIcon: true,
		links: {
			"Chrome extension":
				"https://chrome.google.com/webstore/detail/gulp-blacklist-marker/kifhpjdagaiganbdabkpepncopmbfbal",
			Blog: "https://sirlisko.com/blog/gulp-blacklist-marker/",
			Github: "https://github.com/sirlisko/gulp-blacklist-marker",
		},
		tech: ["Chrome Extension", "Gulp", "npm"],
	},
	{
		title: "Sproxify",
		description: [
			"Intercepts Spotify links and lets you choose where to play them.",
		],
		logo: "/images/projects/sproxify.png",
		links: {
			Blog: "https://sirlisko.com/blog/sproxify/",
			Github: "https://github.com/sirlisko/sproxify",
		},
		tech: ["Chrome Extension", "Userscript"],
	},
	{
		title: "POMOfy",
		description: [
			"Use Spotify songs as a Pomodoro timer. Focus mode, musical edition.",
		],
		logo: "/images/projects/pomofy.png",
		links: {
			Github: "https://github.com/sirlisko/apps-pomofy",
		},
		tech: ["Spotify App"],
	},
	{
		title: "Deliverance Improved",
		description: [
			"A better UI for the deliverance.co.uk menu: filter, sort and search.",
		],
		logo: "/images/projects/dlogo.jpg",
		links: {
			Github: "https://github.com/sirlisko/deliverance",
		},
		tech: ["Node.js", "AngularJS", "Web Scraping", "Bootstrap"],
	},
] satisfies Project[];
