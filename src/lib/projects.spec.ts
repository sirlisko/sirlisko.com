import { describe, expect, test } from "vitest";
import { projectLinks } from "./projects";

describe("projectLinks", () => {
	test("opens the live site and keeps the rest as extras", () => {
		expect(
			projectLinks({
				Website: "https://moon.sirlisko.com",
				Github: "https://github.com/sirlisko/moon",
			}),
		).toEqual({
			href: "https://moon.sirlisko.com",
			extra: [{ label: "Source", href: "https://github.com/sirlisko/moon" }],
		});
	});

	test("falls back to the blog post when nothing is live", () => {
		const { href, extra } = projectLinks({
			Blog: "https://sirlisko.com/blog/x",
			Github: "https://github.com/sirlisko/x",
		});

		expect(href).toBe("https://sirlisko.com/blog/x");
		expect(extra.map(({ label }) => label)).toEqual(["Source"]);
	});

	test("falls back to the source when that's all there is", () => {
		expect(projectLinks({ Github: "https://github.com/sirlisko/x" })).toEqual({
			href: "https://github.com/sirlisko/x",
			extra: [],
		});
	});

	test("keeps unknown link names as they are", () => {
		const { extra } = projectLinks({
			"NPM Module": "https://npmjs.com/package/x",
			Demo: "https://codesandbox.io/x",
		});

		expect(extra).toEqual([
			{ label: "Demo", href: "https://codesandbox.io/x" },
		]);
	});

	test("refuses a project with nowhere to go", () => {
		expect(() => projectLinks({})).toThrow();
	});
});
