const LABELS: Record<string, string> = {
	Github: "Source",
	Blog: "Blog post",
	"NPM Module": "npm",
	"Chrome extension": "Chrome Web Store",
};

export interface ProjectLinks {
	href: string;
	extra: { label: string; href: string }[];
}

/** The title opens the thing itself; source and write-ups become the small links. */
export const projectLinks = (links: Record<string, string>): ProjectLinks => {
	const all = Object.entries(links);
	const main =
		all.find(([k]) => k !== "Github" && k !== "Blog") ??
		all.find(([k]) => k === "Blog") ??
		all[0];
	if (!main) throw new Error("A project needs at least one link");
	return {
		href: main[1],
		extra: all
			.filter(([k]) => k !== main[0])
			.map(([k, href]) => ({ label: LABELS[k] ?? k, href })),
	};
};
