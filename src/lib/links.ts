import type { Link } from "../../data/me";

export type PageName = "projects" | "resume" | "now" | "uses" | "credits";

const HOME: Link = { name: "home", url: "/", label: "home" };

/** Subpages lead with a way back home; every other link keeps its place. */
export const navLinks = (links: Link[], page?: PageName): Link[] =>
	page ? [HOME, ...links] : links;
