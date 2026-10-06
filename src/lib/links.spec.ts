import { describe, expect, test } from "vitest";
import me from "../../data/me";
import { navLinks } from "./links";

describe("navLinks", () => {
	test("leaves the links untouched on the home page", () => {
		expect(navLinks(me.links)).toEqual(me.links);
	});

	test("prepends home on subpages", () => {
		expect(navLinks(me.links, "uses")[0]).toEqual({
			name: "home",
			url: "/",
			label: "home",
		});
	});

	test("keeps every link in the same order on every subpage", () => {
		const orders = (["projects", "resume", "now", "uses"] as const).map(
			(page) => navLinks(me.links, page).map(({ name }) => name),
		);

		for (const order of orders) {
			expect(order).toEqual(["home", ...me.links.map(({ name }) => name)]);
		}
	});
});
