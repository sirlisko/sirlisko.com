import { existsSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { rolls } from "./credits";
import me from "./me";
import { NOW_LAST_UPDATED, sections } from "./now";
import { NPMPackages, pastProjects, projects, tinyProjects } from "./projects";
import resume from "./resume";
import { cli, hardware, USES_LAST_UPDATED, uses } from "./uses";

// Served by the blog through the /blog/* rewrite in netlify.toml.
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

	test("every /uses link is well formed", () => {
		const broken = [...hardware, ...uses, ...cli]
			.flatMap(({ apps }) => apps)
			.filter(({ url }) => url !== undefined && isBroken(url));
		expect(broken).toEqual([]);
	});

	test("every project link is well formed", () => {
		const broken = [
			...projects,
			...tinyProjects,
			...NPMPackages,
			...pastProjects,
		]
			.flatMap(({ links }) => Object.values(links))
			.filter(isBroken);
		expect(broken).toEqual([]);
	});

	test("the dated pages say when they were last updated", () => {
		expect(NOW_LAST_UPDATED).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
		expect(USES_LAST_UPDATED).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
	});
});
