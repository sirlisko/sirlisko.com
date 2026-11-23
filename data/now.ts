export interface Section {
	label: string;
	title: string;
	content: string[];
	tags?: string[];
}

/** Year and month, as a `<time datetime>` takes it. */
export const NOW_LAST_UPDATED = "2026-11";

const ext = (href: string, text: string) =>
	`<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

export const sections: Section[] = [
	{
		label: "day job",
		title: "Building, shipping & breaking things",
		content: [
			`Full-time on ${ext("https://talelock.com", "Talelock")}, story-driven treasure hunts played on your phone. I <a href="/blog/talelock">launched it</a> in October. Two hunts are live: ${ext("https://talelock.com/hunts/walthamstow", "The Strawberry Thief Strikes Again")} in Walthamstow and ${ext("https://talelock.com/hunts/soho", "The Last Round of Sidney Bell")} in Soho. For a tiny free taste, try ${ext("https://talelock.com/play?code=GRUDGE", "the story of Reginald the pigeon")}.`,
			`Now writing ${ext("https://talelock.com/hunts/national-gallery", "Cupid Was There")}, a date-night hunt in the National Gallery where Cupid makes a mess.`,
			`I also write ${ext("https://talelock.com/made-for-you", "hunts made for one person")}, built around their names, places and running jokes. A good present, if you are looking for one.`,
			`Also running ${ext("https://barbooto.com", "Barbooto")}, a small software consultancy. Right now building the website for a London theatre company. Got a project in mind? If you need someone who's been fighting with the web since the Netscape/IE5 days, we might be a good fit.`,
			'Drop a line at <a href="mailto:ciao@barbooto.com">ciao@barbooto.com</a>.',
		],
	},
	{
		label: "keeper of forbidden knowledge",
		title: "Tabletop games, all of them",
		content: [
			`${ext("https://ogreballerino.com", "Ogre&nbsp;Ballerino")}, the community for Italian-speaking tabletop players in London, keeps growing: new people on Discord, more websites and side projects around it. I built a few Discord bots for it, for session summaries and notifications.`,
			`Building ${ext("https://canterino.ogreballerino.com/", "Canterino")}, a tool to play music and sound effects at the table. It's only for Ogre Ballerino members, and our groups already use it in their sessions.`,
			`Playing <strong>Curse of Strahd</strong> as Tariq Cornelius, a halfling Divination Wizard with strong opinions about fate and a questionable track record predicting it. We play every week and the group works really well together. The sessions end up in a ${ext("https://strahd.ogreballerino.com/", "campaign journal")} (in Italian, sorry).`,
			`Our <strong>Call of Cthulhu</strong> campaign is back, and I'm playing my investigator Agatha Fletcher again. Its ${ext("https://ombre.ogreballerino.com/", "journal")} is in Italian too.`,
		],
	},
	{
		label: "out and about",
		title: "Walking, local communities & getting outside",
		content: [
			'After the <a href="/blog/100km">100km in one day</a>, planning the next long walk: all around London in two stages, about 160 km. Still working out how.',
			'Reached <a href="/blog/500-hours-at-foodcycle">500 hours</a> at FoodCycle, cooking community meals from surplus food. Still project lead at Walthamstow and Finsbury Park, and helping at other venues when they need hands.',
		],
	},
	{
		label: "reading, watching & playing",
		title: "Dark worlds, on and off the page",
		content: [
			"Still working through <strong>Between Two Fires</strong> (no spoilers, please) and <strong>Delicious in Dungeon</strong>. Also hooked on <strong>Murdoku</strong>, which is less a book and more a pile of murder puzzles.",
			"Watching <strong>Nord Sud Ovest Est</strong>, the second season of the series about 883, an Italian band from the 90s. Pure nostalgia for Italy in the 90s.",
			'Finished <strong>Super Mario Bros. Wonder</strong>, and finally got my hands on a few Switch games. More on that soon. Before that, <a href="/blog/silent-hill-2-remake">Silent Hill 2</a>. WHAT A GAME!',
			"Trying to watch more films and get to the cinema at least once a month. Recent top picks: <strong>Obsession</strong> and <strong>Project Hail Mary</strong>.",
		],
	},
	{
		label: "writing more",
		title: "Actually committing to the blog",
		content: [
			'Finished a long <a href="/blog/autumn-cleaning">autumn cleaning</a> of this site: every page is a different video game, and <a href="/blog/the-blog-is-a-game-boy-now">the blog is now a Game Boy</a>.',
			`${ext("https://lazybea.rs/ovr-088/", "Lazy Bears")} interviewed me for their Over/Under series. The long answer is in <a href="/blog/why-i-write">Why I Write</a>.`,
		],
	},
];
