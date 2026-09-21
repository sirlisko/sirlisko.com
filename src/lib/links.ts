import type { Link } from "../../data/me";

export type PageName = "projects" | "resume" | "now" | "uses";

const HOME: Link = { name: "home", url: "/", label: "home" };

/** Subpages swap their own entry for a way back home. */
export const navLinks = (links: Link[], page?: PageName): Link[] =>
	page ? [HOME, ...links.filter(({ name }) => name !== page)] : links;
