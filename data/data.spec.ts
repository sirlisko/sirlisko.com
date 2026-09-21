import { describe, expect, test } from "vitest";
import me from "./me";
import { NOW_LAST_UPDATED, sections } from "./now";
import resume from "./resume";
import { cli, hardware, USES_LAST_UPDATED, uses } from "./uses";

const isReachable = (url: string) =>
	url.startsWith("/") ||
	url.startsWith("mailto:") ||
	URL.canParse(url) === true;

describe("site data", () => {
	test("every nav link points somewhere", () => {
		const broken = me.links.filter(({ url }) => !isReachable(url));
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

	test("every resume project links out", () => {
		const broken = resume.projects.filter(({ url }) => !isReachable(url));
		expect(broken).toEqual([]);
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

	test("every /uses entry links to a real app", () => {
		const broken = [...hardware, ...uses, ...cli]
			.flatMap(({ apps }) => apps)
			.filter(({ url }) => url !== undefined && !isReachable(url));
		expect(broken).toEqual([]);
	});

	test("the dated pages say when they were last updated", () => {
		expect(NOW_LAST_UPDATED).toMatch(/\w+ \d{4}/);
		expect(USES_LAST_UPDATED).toMatch(/\w+ \d{4}/);
	});
});
