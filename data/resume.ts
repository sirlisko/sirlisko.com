export interface Link {
	text: string;
	url: string;
}

/** Prose with the odd inline link. */
export type Rich = string | (string | Link)[];

export interface Experience {
	where: string;
	role?: string;
	when: string;
	url?: string;
	blurb: string[];
}

export interface SideQuest {
	link?: Link;
	blurb: string;
}

export interface Resume {
	stats: [value: string, label: string][];
	experiences: Experience[];
	earlier: string[];
	sideQuests: SideQuest[];
	skills: { main: string[]; misc: string[]; past: string[] };
	lore: Rich;
	feats: Rich[];
	traits: string[];
	ideals: string[];
	downtime: string;
}

const resume = {
	stats: [
		["Senior software engineer", "Class"],
		["London, UK", "Home base"],
		["Computer Science graduate", "Background"],
		["Since the Netscape/IE5 days", "Experience"],
		["Chaotic good", "Alignment"],
		["English, Italian, Spanish", "Languages"],
	],
	experiences: [
		{
			where: "Talelock",
			role: "Founder & engineer",
			when: "Sep 2026 to now",
			url: "https://talelock.com",
			blurb: [
				"Building my own product: story-driven treasure hunts played on your phone. No app, no account, just a link.",
				"A Studio for writing hunts (riddles, QR codes, GPS and photo steps) and a Play side for walking them, with answers checked server-side.",
				"Stripe payments, with webhooks setting up each player's session and sending it straight to them.",
			],
		},
		{
			where: "Long rest",
			when: "May 2026 to Aug 2026",
			blurb: ["Took time out to travel and volunteer full time."],
		},
		{
			where: "Red Badger",
			role: "Senior software engineer",
			when: "Feb 2025 to Apr 2026",
			blurb: [
				"Worked full stack on a React Native app built with Expo, from early development to its App Store launch, drastically improving its accessibility (WCAG 2.1 AA) and stability.",
				"Consolidated the data layer across the app and the backend, replacing custom GraphQL and state code with Apollo Client and Zustand, and made the app work offline.",
				"Introduced Architecture Decision Records, standardised team processes and coordinated work across multiple teams.",
			],
		},
		{
			where: "YLD",
			role: "Senior software engineer",
			when: "May 2021 to Oct 2024",
			blurb: [
				"Built a Next.js application, later turned into a white-label product used by third parties, and maintained the REST service that brought together data from various sources.",
				"Standardised and modernised the codebase, improved accessibility and strengthened test coverage.",
				"Built pipelines with GitHub Actions and deployed to Azure.",
			],
		},
		{
			where: "Hackney Council",
			role: "Senior full stack developer",
			when: "Nov 2019 to May 2021",
			blurb: [
				"Called in after the 2020 cyberattack to build a new platform and rescue the services it had affected.",
				"Built the services that helped the council cope with COVID, from food bank support to social services tracking, with React/Next.js and AWS Lambda.",
				"Contributed to internal component libraries and mentored junior developers.",
				"Rebuilt the Hackney website on Jamstack (Gatsby, WordPress, Netlify) with robust testing and improved CI/CD.",
			],
		},
		{
			where: "uSwitch / RVU",
			role: "Senior software engineer",
			when: "Jan 2020 to Mar 2020",
			blurb: [
				"Enhanced internal tools using React/Redux-Saga for complex async data flows and API integrations.",
				"Contributed to the internal UI component library, improving consistency across products.",
			],
		},
		{
			where: "Architecture consultant",
			when: "Sep 2019 to Nov 2019",
			blurb: [
				"Started a Next.js project with Apollo and a GraphQL gateway, joining internal and third-party REST APIs with WordPress data.",
			],
		},
	],
	earlier: [
		"Shazam (about 5 years)",
		"YOOX Net-a-Porter",
		"Reason",
		"Pobble",
		"Kalo",
		"Verve",
	],
	sideQuests: [
		{
			link: { text: "GigPlayList", url: "https://gigplaylist.sirlisko.com" },
			blurb:
				"predicts the setlist for an upcoming gig and builds you a Spotify playlist, from a Next.js backend that mashes up a bunch of third-party APIs.",
		},
		{
			link: { text: "Moon", url: "https://moon.sirlisko.com" },
			blurb:
				"a live 3D Moon showing its real phase and position from where you stand, rendered with Three.js on NASA imagery.",
		},
		{
			blurb:
				"Freelance sites with WordPress, Gatsby and Astro, with headless CMS (Sanity.io and others), payment integrations (Stripe and others) and serverless features on Netlify Functions, AWS Lambda, and Clouflare Workers.",
		},
	],
	skills: {
		main: [
			"TypeScript",
			"Node.js",
			"Full stack architecture",
			"React, React Native, Expo",
			"Next.js",
			"Accessibility (WCAG)",
			"CI/CD",
			"Testing (TDD, BDD, E2E)",
		],
		misc: [
			"GraphQL, Apollo",
			"Tailwind",
			"Supabase, PostgreSQL",
			"Stripe",
			"AWS, GitHub Actions",
			"Astro",
		],
		past: ["Python", "Java", "Scala", "PHP", "MySQL", "C++", "Ruby on Rails"],
	},
	lore: [
		"Degree in Computer Science at Università degli Studi dell'Insubria and Universidad de Salamanca. Thesis on ",
		{ text: "assistive technology", url: "https://assistivetechnology.it" },
		".",
	],
	feats: [
		"Co-ran a workshop on TDD in JavaScript at Università di Cesena.",
		[
			"Project lead and volunteer cook at ",
			{ text: "FoodCycle", url: "https://foodcycle.org.uk/" },
			".",
		],
		"Cisco CCNA certificate.",
		"Trained as a fire marshal.",
	],
	traits: [
		"Curious: picks up new tools to see how far they go",
		"Enjoys building useful things",
		"Team player and mentor",
	],
	ideals: [
		"Accessible by default",
		"Code the next person can maintain",
		"Share what you learn",
	],
	downtime:
		"Tabletop RPGs (running campaigns as Game Master), puzzle and brain-teaser games, long-distance walking, cinema, books, music, modern art, 8-bit graphics, travel and pizza.",
} satisfies Resume;

export default resume;
