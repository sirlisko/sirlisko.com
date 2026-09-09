export interface Section {
	label: string;
	title: string;
	content: string[];
	tags?: string[];
}

export const NOW_LAST_UPDATED = "September 2026";

export const sections = [
	{
		label: "day job",
		title: "Building apps, breaking things, shipping side projects",
		content: [
			"Full-stack and mobile developer by trade, currently working on client apps and a handful of side projects. I like picking up new tools and seeing how far I can push them before they (or I) give up.",
			'Also running <a href="https://barbooto.com" target="_blank" rel="noopener noreferrer">Barbooto</a>, a small software consultancy. Got a project in mind? If you need someone who\'s been fighting with the web since the Netscape/IE5 days, we might be a good fit.',
			'Drop a line at <a href="mailto:ciao@barbooto.com">ciao@barbooto.com</a>.',
		],
	},
	{
		label: "keeper of forbidden knowledge",
		title: "Tabletop games, all of them",
		content: [
			"Keeper for a <strong>Call of Cthulhu</strong> campaign, currently running a homebrew scenario set in the New Mexico desert, digging into the origins of my investigator Agatha Fletcher.",
			"Playing <strong>Curse of Strahd</strong> as Tariq Cornelius, a halfling Divination Wizard with strong opinions about fate and a questionable track record predicting it.",
			"Recently joined <strong>D17</strong>, a local TTRPG community in Walthamstow. Good people, good dice.",
			'Also started something new: <a href="https://ogreballerino.com" target="_blank" rel="noopener noreferrer" style="display: inline-block">Ogre Ballerino</a>, a community for Italian-speaking tabletop players in London. Just shipped a fresh rebrand of the site. Early days, but let\'s see where it goes.',
		],
	},
	{
		label: "out and about",
		title: "Walking, local communities & getting outside",
		content: [
			"Just back from a long trip in South East Asia (Thailand, Malaysia, Indonesia, and Laos).",
			'Still training for long distances. Completed the <a href="https://sirlisko.com/blog/brighton-to-hastings" target="_blank" rel="noopener noreferrer">Brighton to Hastings coastal walk over Easter</a>, and recently did a <a href="https://sirlisko.com/blog/100km" target="_blank" rel="noopener noreferrer">100km walk in one day</a> just because why not. Now aiming for an Ultra Challenge event, London to Brighton is on the list.',
			'Volunteering with <a href="https://sirlisko.com/blog/one-year-at-foodcycle" target="_blank" rel="noopener noreferrer">FoodCycle</a>, cooking community meals from surplus food and helping lead the project locally. Good people, good food, zero waste. Lately became project leader of a new venue (Finsbury Park).',
		],
	},
	{
		label: "reading, watching & playing",
		title: "Dark worlds, on and off the page",
		content: [
			"Working through <strong>Between Two Fires</strong> (no spoilers, please) and <strong>Delicious in Dungeon</strong>.",
			'On the PlayStation, just wrapped up <a href="https://sirlisko.com/blog/death-stranding" target="_blank" rel="noopener noreferrer">Death Stranding</a> and started Persona 5 Royal, a very different kind of grind.',
			"Trying to watch more films and get to the cinema at least once a month. Recent top picks: <strong>Obsession</strong> and <strong>Project Hail Mary</strong>",
		],
	},
	{
		label: "writing more",
		title: "Actually committing to the blog",
		content: [
			"I've had a blog for years but never taken it seriously. That's changing. I want to write about everything: code, tabletop, food, community, whatever I'm thinking about.",
		],
	},
] satisfies Section[];
