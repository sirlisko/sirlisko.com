import type { Link } from "../../data/me";
import { slashes } from "../../data/slashes";

export type PageName =
	| "projects"
	| "resume"
	| "now"
	| "uses"
	| "credits"
	| "friends"
	| "stats"
	| "slashes"
	| "blog";

const HOME: Link = { name: "home", url: "/", label: "home" };

/** Subpages lead with a way back home; every other link keeps its place. */
export const navLinks = (links: Link[], page?: PageName): Link[] =>
	page ? [HOME, ...links] : links;

/** The menu entry a page sits under: its own, or slashes for a slash page the menu leaves out. */
export const navSection = (
	links: Link[],
	page?: PageName,
): string | undefined => {
	if (!page || links.some(({ name }) => name === page)) {
		return page;
	}
	return slashes.some(({ url }) => url === `/${page}`) ? "slashes" : undefined;
};
