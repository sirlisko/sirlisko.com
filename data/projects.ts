import {
	Atom,
	CalendarHeart,
	ClockAlert,
	Earth,
	MapPinHouse,
	Plane,
} from "lucide-react";
import type { Project } from "../src/types";

export const projects: Project[] = [
	{
		title: "GigPlayList",
		description: [
			"Predicts the setlist for an upcoming gig and builds you a Spotify playlist.",
			"Next.js app that proxies external APIs (Setlist.fm, Spotify, Musicbrainz, and Songkick), mashes them up and creates a Spotify playlist for you.",
		],
		logo: "/images/projects/ticket.png",
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
		title: "ZoomMEME",
		description: [
			"Drag-and-drop zoom-in meme generator. Does exactly what it says.",
			"PWA (Progressive Web App) powered by pure and sweet Vanilla JavaScript.",
		],
		logo: "/images/projects/zoommeme.png",
		links: {
			Website: "https://zoomme.me",
			Github: "https://github.com/sirlisko/zoommeme",
		},
		tech: ["Vanilla JS", "PWA", "Webpack", "Jest"],
	},
	{
		title: "Been",
		description: [
			"Track the countries you've visited on an interactive world map.",
			"React application powered by Firebase Auth and Firestore.",
		],
		icon: Plane,
		links: {
			Website: "https://been.sirlisko.com/",
			Github: "https://github.com/sirlisko/been",
		},
		tech: ["React", "Firebase", "OAuth", "Netlify"],
	},
	{
		title: "World Map Country Shapes",
		description: [
			"JSON of SVG shapes for every country in the world. BYO map.",
			"NPM module that provides a JSON file with all country shapes.",
		],
		icon: Earth,
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
		icon: Atom,
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
		icon: MapPinHouse,
		links: {
			"NPM Module": "https://npmjs.com/package/uk-postcode-validator",
			Github: "https://github.com/sirlisko/uk-postcode-validator",
		},
		tech: ["NPM Module", "Regex"],
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
		],
		logo: "/images/projects/pizza.png",
		invertIcon: true,
		links: {
			Website: "https://pizzaclub.sirlisko.com/",
			Github: "https://github.com/sirlisko/pizzaclub",
		},
		tech: ["Gatsby", "React", "GitHub Pages"],
	},
	{
		title: "GifDay",
		description: [
			"Assign a GIF to every day of the year. Your year, in GIFs.",
			"GifDay is a webapp that allows you to create a gif for every day of the year, using the Giphy API.",
		],
		icon: CalendarHeart,
		links: {
			Website: "https://gifday.sirlisko.com/",
			Github: "https://github.com/sirlisko/gifday",
		},
		tech: [
			"React",
			"Giphy API",
			"Styled Components",
			"Cypress",
			"Netlify",
			"Supabase",
			"PostgreSQL",
			"Edge Functions",
		],
	},
	{
		title: "Countdown",
		description: [
			"Customisable countdowns for future and past events. Small and sharp.",
		],
		icon: ClockAlert,
		links: {
			Website: "https://countdown.sirlisko.com/",
			Github: "https://github.com/sirlisko/countdown",
		},
		tech: ["React", "TypeScript", "Tailwind", "Vite", "Netlify"],
	},
];

export const pastProjects: Project[] = [
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
		isDeprecated: true,
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
		isDeprecated: true,
	},
	{
		title: "Gulp Blacklist Marker",
		description: [
			"Chrome Extension that marks blacklisted gulp modules when browsing NPM and GitHub.",
		],
		logo: "/images/projects/gulp.png",
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
		isDeprecated: true,
	},
	{
		title: "POMOfy",
		description: [
			"Use Spotify songs as a Pomodoro timer. Focus mode, musical edition.",
		],
		logo: "https://raw.githubusercontent.com/sirlisko/apps-pomofy/master/img/pomodoro.png",
		links: {
			Screenshot: "/images/projects/pomofy.png",
			Github: "https://github.com/sirlisko/apps-pomofy",
		},
		tech: ["Spotify App"],
		isDeprecated: true,
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
		isDeprecated: true,
	},
];
