import { describe, expect, test } from "vitest";
import me from "../../data/me";
import { navLinks } from "./links";

describe("navLinks", () => {
	test("leaves the links untouched on the home page", () => {
		expect(navLinks(me.links)).toEqual(me.links);
	});

	test("prepends home and drops the current page", () => {
		const links = navLinks(me.links, "uses");

		expect(links[0]).toEqual({ name: "home", url: "/", label: "home" });
		expect(links.map(({ name }) => name)).not.toContain("uses");
		expect(links).toHaveLength(me.links.length);
	});

	test("keeps every other page reachable", () => {
		const names = navLinks(me.links, "now").map(({ name }) => name);

		for (const { name } of me.links) {
			if (name !== "now") {
				expect(names).toContain(name);
			}
		}
	});
});
