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
			"A Studio to write hunts with riddles, QR codes, GPS and photo steps, and a Play side for walking them, with the answers checked server-side so they never reach the browser.",
		],
		screenshot: "/images/projects/screens/talelock.webp",
		links: {
			Website: "https://talelock.com",
		},
		tech: [
			"React",
			"TypeScript",
			"Tailwind",
			"Vite",
			"Supabase",
			"PostgreSQL",
			"Edge Functions",
			"Leaflet",
			"Vitest",
			"Netlify",
		],
	},
	{
		title: "Moon",
		description: [
			"A live 3D Moon showing its real phase and position from where you stand, plus a lunar calendar.",
			"Three.js render built on NASA imagery, with astronomy-engine doing the maths.",
		],
		screenshot: "/images/projects/screens/moon.webp",
		links: {
			Website: "https://moon.sirlisko.com",
			Github: "https://github.com/sirlisko/moon",
		},
		tech: [
			"Three.js",
			"WebGL",
			"TypeScript",
			"astronomy-engine",
			"Vite",
			"Vitest",
			"Playwright",
			"Netlify",
		],
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
		tech: [
			"TypeScript",
			"Vite",
			"Open-Meteo API",
			"Edge Functions",
			"Vitest",
			"Netlify",
		],
	},
	{
		title: "GigPlayList",
		description: [
			"Predicts the setlist for an upcoming gig and builds you a Spotify playlist.",
			"Next.js app that proxies external APIs (Setlist.fm, Spotify, Musicbrainz, and Songkick), mashes them up and creates a Spotify playlist for you.",
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
			"Musicbrainz API",
			"Songkick API",
			"OAuth",
			"Tailwind",
			"Vercel",
		],
	},
	{
		title: "Countdown",
		description: [
			"Customisable countdowns for future and past events. Small and sharp.",
			"Yearly rollovers, progress bars, obfuscated share links, calendar export, and Open Graph previews rendered on the edge.",
		],
		screenshot: "/images/projects/screens/countdown.webp",
		links: {
			Website: "https://countdown.sirlisko.com/",
			Github: "https://github.com/sirlisko/countdown",
		},
		tech: [
			"React",
			"TypeScript",
			"Tailwind",
			"shadcn/ui",
			"Vite",
			"Vitest",
			"Playwright",
			"Netlify",
			"Edge Functions",
		],
	},
	{
		title: "Been",
		description: [
			"Track the countries you've visited on an interactive world map.",
			"React application powered by Supabase auth and database.",
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
			"Vite",
			"Supabase",
			"PostgreSQL",
			"Edge Functions",
			"Vitest",
			"Netlify",
		],
	},
	{
		title: "Curse of Strahd",
		description: [
			"Companion site for an Italian Curse of Strahd D&D campaign. Session recordings are transcribed on-device and turned into recaps by Claude.",
			"Parakeet transcribes the audio on the Neural Engine, then Claude Code runs headless to write the session journal and update characters, NPCs and places.",
		],
		screenshot: "/images/projects/screens/strahd.webp",
		links: {
			Website: "https://strahd.ogreballerino.com",
			Github: "https://github.com/sirlisko/strahd",
		},
		tech: [
			"Astro",
			"Speech-to-Text",
			"Parakeet",
			"AI Recaps",
			"Pagefind",
			"Netlify",
		],
	},
	{
		title: "GifDay",
		description: [
			"Assign a GIF to every day of the year. Your year, in GIFs.",
			"Search GIPHY, pick a GIF for each day, and sync it across devices with a Supabase account.",
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
			"Vite",
			"Giphy API",
			"Supabase",
			"PostgreSQL",
			"Netlify Functions",
			"Vitest",
			"Playwright",
			"Netlify",
		],
	},
	{
		title: "Can I Have a Cappuccino?",
		description: [
			"Can I have a cappuccino right now? The Italian verdict, updated every minute.",
			"A single static page with the rules of Italian coffee etiquette baked in, in English and Italian.",
		],
		screenshot: "/images/projects/screens/cappuccino.webp",
		links: {
			Website: "https://cappuccino.sirlisko.com",
		},
		tech: ["HTML", "CSS", "Vanilla JS"],
	},
] satisfies Project[];

export const tinyProjects = [
	{
		title: "Umami Digest",
		description: [
			"Daily, weekly or monthly analytics email digests for Umami.",
			"Scheduled Cloudflare Worker that pulls stats from the Umami API and sends them via Resend.",
		],
		icon: "Mail",
		links: {
			Blog: "https://sirlisko.com/blog/umami-digest",
			Github: "https://github.com/sirlisko/umami-digest",
		},
		tech: ["Cloudflare Workers", "TypeScript", "Umami API", "Resend", "Vitest"],
	},
	{
		title: "ZoomMEME",
		description: [
			"Drag-and-drop zoom-in meme generator. Does exactly what it says.",
			"PWA (Progressive Web App) powered by pure and sweet Vanilla JavaScript.",
		],
		screenshot: "/images/projects/screens/zoommeme.webp",
		links: {
			Website: "https://zoomme.me",
			Github: "https://github.com/sirlisko/zoommeme",
		},
		tech: ["Vanilla JS", "PWA", "Webpack", "Jest"],
	},
	{
		title: "Martellone Alexa Skill",
		description: [
			"Alexa skill dedicated to the legendary Nando Martellone from the Italian TV show Boris.",
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
			"Static Astro site fed by Sanity, with a map and stats for every pizzeria.",
		],
		screenshot: "/images/projects/screens/pizzaclub.webp",
		links: {
			Website: "https://pizzaclub.sirlisko.com/",
			Github: "https://github.com/sirlisko/pizzaclub",
		},
		tech: ["Astro", "Sanity", "MapLibre", "Netlify"],
	},
] satisfies Project[];

export const NPMPackages = [
	{
		title: "Git Branch Switcher",
		description: [
			"Interactive CLI to switch, search and delete git branches.",
			"NPM module that installs the `br` command, with branches sorted by most recent commit.",
		],
		icon: "GitBranch",
		links: {
			"NPM Module": "https://npmjs.com/package/git-branch-switcher",
			Blog: "https://sirlisko.com/blog/git-branch-switcher",
			Github: "https://github.com/sirlisko/git-branch-switcher",
		},
		tech: ["NPM Module", "CLI", "TypeScript", "Node"],
	},
	{
		title: "World Map Country Shapes",
		description: [
			"JSON of SVG shapes for every country in the world. BYO map.",
			"NPM module that provides a JSON file with all country shapes.",
		],
		icon: "Earth",
		links: {
			"NPM Module": "https://npmjs.com/package/world-map-country-shapes",
			Github: "https://github.com/sirlisko/world-map-country-shapes",
		},
		tech: ["NPM Module", "SVG"],
	},
	{
		title: "Redux Persist Transform Expire-in",
		description: [
			"Resets persisted Redux state after a configurable TTL.",
			"NPM module that extends the functionality of the redux plugin.",
		],
		icon: "Atom",
		links: {
			"NPM Module":
				"https://npmjs.com/package/redux-persist-transform-expire-in",
			Github: "https://github.com/sirlisko/redux-persist-transform-expire-in",
			Demo: "https://codesandbox.io/s/redux-persist-transform-expire-in-lmj74q",
		},
		tech: ["NPM Module", "Redux", "React"],
	},
	{
		title: "UK Postcode Validator",
		description: ["Micro NPM module to validate UK postcodes."],
		icon: "MapPinHouse",
		links: {
			"NPM Module": "https://npmjs.com/package/uk-postcode-validator",
			Github: "https://github.com/sirlisko/uk-postcode-validator",
		},
		tech: ["NPM Module", "Regex"],
	},
] satisfies Project[];

export const pastProjects = [
	{
		title: "Shazamify (a.k.a. Zamify)",
		description: [
			"Play your Shazams in Spotify directly from the browser.",
			"Chrome Extension powered by Spotify OAuth and Web API.",
		],
		logo: "/images/projects/shazamify.png",
		links: {
			Blog: "https://sirlisko.com/blog/shazamify",
			Github: "https://github.com/sirlisko/shazamify",
		},
		tech: ["Chrome Extension", "Spotify OAuth", "Spotify API"],
	},
	{
		title: "Audible RSS",
		description: [
			"RSS feed of the latest Audible releases, scraped fresh.",
			"RSS feed powered by Node/Express, built by scraping the Audible website.",
		],
		logo: "/images/projects/audible.svg",
		links: {
			Github: "https://github.com/sirlisko/audible-rss",
		},
		tech: ["Node", "Express", "React", "Web Scraping"],
	},
	{
		title: "Gulp Blacklist Marker",
		description: [
			"Chrome Extension that marks blacklisted gulp modules when browsing NPM and GitHub.",
		],
		logo: "/images/projects/gulp.png",
		invertIcon: true,
		links: {
			"Chrome extension":
				"https://chrome.google.com/webstore/detail/gulp-blacklist-marker/kifhpjdagaiganbdabkpepncopmbfbal",
			Blog: "https://sirlisko.com/blog/gulp-blacklist-marker/",
			Github: "https://github.com/sirlisko/gulp-blacklist-marker",
		},
		tech: ["Chrome Extension", "Gulp", "NPM"],
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
		tech: ["Chrome Extension", "User Script"],
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
			"A better UI for the deliverance.co.uk menu — filter, sort, and search.",
		],
		logo: "/images/projects/dlogo.jpg",
		links: {
			Github: "https://github.com/sirlisko/deliverance",
		},
		tech: ["Node", "AngularJS", "Web Scraping", "Bootstrap", "Heroku"],
	},
] satisfies Project[];
