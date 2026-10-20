import { describe, expect, test } from "vitest";
import { boundsOf } from "./gpx";

const track = (...points: [number, number][]) =>
	points
		.map(([lat, lon]) => `<trkpt lat="${lat}" lon="${lon}"></trkpt>`)
		.join("");

describe("boundsOf", () => {
	test("spans every point of every track", () => {
		expect(
			boundsOf([track([50.8, -0.1], [50.9, 0.2]), track([50.7, 0.5])]),
		).toEqual([
			[50.7, -0.1],
			[50.9, 0.5],
		]);
	});
});
