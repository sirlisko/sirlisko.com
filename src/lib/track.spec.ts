import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initTracking } from "./track";

describe("track", () => {
	let cleanup = () => {};
	const track = vi.fn();

	beforeEach(() => {
		window.umami = { track };
		cleanup = initTracking();
	});

	afterEach(() => {
		cleanup();
		track.mockReset();
		delete window.umami;
		document.body.innerHTML = "";
	});

	test("reports the event with its data attributes", () => {
		document.body.innerHTML = `<a data-track="project" data-track-name="Kitchen Sink" data-track-link-type="main">Go</a>`;
		document.querySelector("a")?.click();

		expect(track).toHaveBeenCalledWith("project", {
			name: "Kitchen Sink",
			linkType: "main",
		});
	});

	test("reports clicks on a child of the tracked element", () => {
		document.body.innerHTML = `<a data-track="resume-pdf"><span>PDF</span></a>`;
		document.querySelector("span")?.click();

		expect(track).toHaveBeenCalledWith("resume-pdf", {});
	});

	test("ignores untracked clicks", () => {
		document.body.innerHTML = `<a>Nope</a>`;
		document.querySelector("a")?.click();

		expect(track).not.toHaveBeenCalled();
	});

	test("stops after cleanup", () => {
		cleanup();
		document.body.innerHTML = `<a data-track="contact">Mail</a>`;
		document.querySelector("a")?.click();

		expect(track).not.toHaveBeenCalled();
	});

	test("does nothing when umami is blocked", () => {
		delete window.umami;
		document.body.innerHTML = `<a data-track="contact">Mail</a>`;

		expect(() => document.querySelector("a")?.click()).not.toThrow();
	});
});
