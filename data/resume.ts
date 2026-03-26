interface Experience {
	where: string;
	blurb: string[];
	when?: string;
}

interface Skills {
	main: string[];
	"misc.": string[];
}

interface ProjectShort {
	name: string;
	url: string;
	blurb: string[];
}

export interface Resume {
	skills: Skills;
	experiences: Experience[];
	projects: ProjectShort[];
}

const resume = {
	skills: {
		main: [
			"JavaScript",
			"TypeScript",
			"Node.js",
			"Full Stack Architecture",
			"React",
			"React Native",
			"Expo",
			"Next.js",
			"HTML/CSS",
			"Accessibility (WCAG)",
			"CI/CD",
			"Testing (TDD / BDD / E2E)",
		],
		"misc.": [
			"GraphQL",
			"Redux",
			"Tailwind",
			"AWS",
			"GitHub Actions",
			"Astro",
			"Chrome Extensions",
			"Bash Scripting",
		],
	},
	experiences: [
		{
			where: "Red Badger",
			when: "02/25 - Now",
			blurb: [
				"Developed a complete React Native app using Expo.",
				"Focused on enhancing accessibility (WCAG 2.1 AA), improved the developer experience and expanded the test stack.",
				"Integrated various systems using GraphQL and Auth0.",
			],
		},
		{
			where: "YLD",
			when: "05/21 - 10/24",
			blurb: [
				"Developed a Next.js application, orchestrated and maintained a RESTful service for seamless data integration from various sources.",
				"Standardised and modernised codebase, enhanced accessibility, and strengthened test coverage.",
				"Built pipelines with GitHub Actions and deployed to Azure for seamless CI/CD.",
			],
		},
		{
			where: "Hackney Council",
			when: "Multiple gigs (11/19 ~ 05/21)",
			blurb: [
				"Developed new services utilizing React/Next.js, lambda functions deployed on AWS.",
				"Contributed to internal Component Libraries, mentored junior developers, and shared knowledge.",
				"Revamped the Hackney website using Jamstack (Gatsby, WordPress, Netlify), emphasizing React best practices and implementing robust testing strategies. Improved CI/CD.",
			],
		},
		{
			where: "uSwitch / RVU",
			when: "01/20 - 03/20",
			blurb: [
				"Enhanced internal tools using React/Redux-Saga to manage complex async data flows and API integrations.",
				"Contributed to the internal UI/component library, improving consistency across products.",
			],
		},
		{
			where: "Architecture Consultant",
			when: "09/19 - 11/19",
			blurb: [
				"Initiated a Next.js (TypeScript) project with Apollo (FE/BE) and GraphQL Gateway, integrating REST APIs (internal and third-party) alongside WordPress data.",
			],
		},
		{
			where: "Kalo",
			when: "04/19 - 06/19",
			blurb: [
				"Architected a monorepo and shared UI library, driving performance improvements and developer experience.",
			],
		},
		{
			where: "Reason",
			when: "09/18 - 12/18",
			blurb: [
				"Built a new service from scratch for a client utilizing React/Redux and Node.js for API proxy.",
			],
		},
		{
			where: "Previous experiences:",
			blurb: [
				"Shazam (~5 years), YOOX Net-a-Porter (1+ years), Pobble (1+ years), Verve (1+ years). Full details on LinkedIn.",
			],
		},
	],
	projects: [
		{
			name: "GigPlaylist",
			url: "https://gigplaylist.sirlisko.com/",
			blurb: [
				"Next.js app that proxies several APIs (Spotify, MusicBrainz, Songkick, etc.), combines their data to predict the most probable songs for a given artist's gig, and creates a Spotify playlist for you using Spotify Auth.",
			],
		},
	],
} satisfies Resume;

export default resume;
