import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { rolls } from "./credits";
import { friends } from "./friends";
import me from "./me";
import { NOW_LAST_UPDATED, sections } from "./now";
import OG_CARDS from "./og.json";
import { NPMPackages, pastProjects, projects, tinyProjects } from "./projects";
import resume from "./resume";
import { cli, hardware, USES_LAST_UPDATED, uses } from "./uses";

// Blog pages are built from the posts, not one file each, so only their prefix is checked here.
const isBlog = (path: string) => path === "/blog" || path.startsWith("/blog/");

/** A path on this site has to be a page or a public file. */
const resolves = (path: string) =>
	isBlog(path) ||
	existsSync(`src/pages/${path === "/" ? "index" : path.slice(1)}.astro`) ||
	existsSync(`public${path}`);

// Tests stay offline, so an address elsewhere is only checked for its shape.
const isWellFormed = (url: string) =>
	/^(https?|mailto):/.test(url) && URL.canParse(url);

const isBroken = (url: string) =>
	url.startsWith("/") ? !resolves(url) : !isWellFormed(url);

const allProjects = [
	...projects,
	...tinyProjects,
	...NPMPackages,
	...pastProjects,
];

// /now is written as HTML, so its links only exist once it's parsed.
const nowLinks = sections
	.flatMap(({ content }) => content)
	.flatMap((html) => [
		...new DOMParser().parseFromString(html, "text/html").querySelectorAll("a"),
	]);

describe("site data", () => {
	test("every nav link leads to a page", () => {
		const broken = me.links.filter(({ url }) => isBroken(url));
		expect(broken).toEqual([]);
	});

	test("every credits link resolves or is well formed", () => {
		const broken = rolls
			.flatMap(({ credits }) => credits)
			.flatMap(({ url }) => (url ? [url] : []))
			.filter(isBroken);
		expect(broken).toEqual([]);
	});

	test("nav link names are unique", () => {
		const names = me.links.map(({ name }) => name);
		expect(new Set(names).size).toBe(names.length);
	});

	test("the typewriter has something to type", () => {
		expect(me.descriptions.length).toBeGreaterThan(0);
		expect(me.descriptions.every((d) => d.trim().length > 0)).toBe(true);
	});

	// The greeting doesn't wrap, so anything longer pushes the heading off a 375px screen.
	test("every description fits on one line on mobile", () => {
		expect(me.descriptions.every((d) => d.length <= 13)).toBe(true);
	});

	test("every resume link is well formed", () => {
		const urls = [
			...resume.experiences.flatMap(({ url }) => (url ? [url] : [])),
			...resume.sideQuests.flatMap(({ link }) => (link ? [link.url] : [])),
			...[resume.lore, ...resume.feats]
				.flat()
				.flatMap((s) => (typeof s === "string" ? [] : [s.url])),
		];
		expect(urls.filter(isBroken)).toEqual([]);
	});

	test("every resume experience has content", () => {
		for (const experience of resume.experiences) {
			expect(experience.where.trim()).not.toBe("");
			expect(experience.blurb.length).toBeGreaterThan(0);
		}
	});

	test("every /now section has content", () => {
		for (const section of sections) {
			expect(section.content.length).toBeGreaterThan(0);
		}
	});

	test("every friend links to a real site", () => {
		expect(friends.filter(({ url }) => !isWellFormed(url))).toEqual([]);
	});

	test("every /uses link is well formed", () => {
		const broken = [...hardware, ...uses, ...cli]
			.flatMap(({ apps }) => apps)
			.filter(({ url }) => url !== undefined && isBroken(url));
		expect(broken).toEqual([]);
	});

	test("every /now link is well formed", () => {
		const broken = nowLinks
			.map((a) => a.getAttribute("href") ?? "")
			.filter(isBroken);
		expect(broken).toEqual([]);
	});

	test("every project link is well formed", () => {
		const broken = allProjects
			.flatMap(({ links }) => Object.values(links))
			.filter(isBroken);
		expect(broken).toEqual([]);
	});

	test("every project logo is a public file", () => {
		const missing = allProjects
			.flatMap((p) => ("logo" in p ? [p.logo] : []))
			.filter((logo) => !existsSync(`public${logo}`));
		expect(missing).toEqual([]);
	});

	test("every share card has its image", () => {
		const missing = Object.keys(OG_CARDS).filter(
			(page) => !existsSync(`public/images/og/${page}.png`),
		);
		expect(missing).toEqual([]);
	});

	test("every netlify.toml redirect onto this site resolves", () => {
		const targets = [
			...readFileSync("netlify.toml", "utf8").matchAll(/^to = "(\/[^"]*)"/gm),
		].flatMap(([, to]) => (to ? [to] : []));
		expect(targets.length).toBeGreaterThan(0);
		expect(targets.filter(isBroken)).toEqual([]);
	});

	test("the dated pages say when they were last updated", () => {
		expect(NOW_LAST_UPDATED).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
		expect(USES_LAST_UPDATED).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
	});
});
