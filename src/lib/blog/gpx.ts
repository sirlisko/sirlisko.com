import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Posts link tracks by their public URL, /blog/gpx/<file>.gpx, which is where they sit in public/. */
export const readGpx = (url: string): Promise<string> =>
	readFile(join("public", url), "utf8");

export type Bounds = [[number, number], [number, number]];

export const boundsOf = (gpx: string[]): Bounds => {
	let [south, west, north, east] = [90, 180, -90, -180];
	for (const track of gpx) {
		for (const [, lat, lon] of track.matchAll(
			/<trkpt lat="([-\d.]+)" lon="([-\d.]+)"/g,
		)) {
			south = Math.min(south, Number(lat));
			north = Math.max(north, Number(lat));
			west = Math.min(west, Number(lon));
			east = Math.max(east, Number(lon));
		}
	}
	return [
		[south, west],
		[north, east],
	];
};
