#!/usr/bin/env node
// Usage: pnpm run gpx [--tolerance 2] [--force]
// Drop GPX tracks in assets/gpx/ and simplified copies land in public/blog/gpx/
// under the same name. A watch logs a point every second or so, megabytes of
// them, when the map only needs the shape: the copy keeps the points the line
// needs to stay within --tolerance metres of the original (Douglas-Peucker),
// without elevation or time. Originals are left untouched.
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

const { values: opts } = parseArgs({
	// pnpm passes a leading "--" through, which would end option parsing
	args: process.argv.slice(2).filter((arg) => arg !== "--"),
	options: {
		tolerance: { type: "string", default: "2" },
		force: { type: "boolean", default: false },
	},
});

const SRC = path.resolve("assets/gpx");
const DEST = path.resolve("public/blog/gpx");
const TOLERANCE = Number(opts.tolerance);
const EARTH_RADIUS = 6371000;

function parseSegments(gpx) {
	return [...gpx.matchAll(/<trkseg>([\s\S]*?)<\/trkseg>/g)].map(([, seg]) =>
		[...seg.matchAll(/<trkpt\b[^>]*>/g)].map(([tag]) => [
			Number(tag.match(/lat="([-\d.]+)"/)[1]),
			Number(tag.match(/lon="([-\d.]+)"/)[1]),
		]),
	);
}

// Metres on a flat projection, close enough over the length of a walk
function toXY(points) {
	const lat0 = (points[0][0] * Math.PI) / 180;
	return points.map(([lat, lon]) => [
		((lon * Math.PI) / 180) * Math.cos(lat0) * EARTH_RADIUS,
		((lat * Math.PI) / 180) * EARTH_RADIUS,
	]);
}

function distanceToSegment([x, y], [x1, y1], [x2, y2]) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const lengthSq = dx * dx + dy * dy;
	const t = lengthSq
		? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq))
		: 0;
	return Math.hypot(x - x1 - t * dx, y - y1 - t * dy);
}

function simplify(points) {
	if (points.length < 3) return points;
	const xy = toXY(points);
	const keep = new Set([0, points.length - 1]);
	const stack = [[0, points.length - 1]];

	while (stack.length) {
		const [first, last] = stack.pop();
		let farthest = 0;
		let index = 0;
		for (let i = first + 1; i < last; i++) {
			const d = distanceToSegment(xy[i], xy[first], xy[last]);
			if (d > farthest) [farthest, index] = [d, i];
		}
		if (farthest > TOLERANCE) {
			keep.add(index);
			stack.push([first, index], [index, last]);
		}
	}

	return points.filter((_, i) => keep.has(i));
}

function toGpx(segments) {
	const trksegs = segments
		.map((points) => {
			const trkpts = points
				.map(([lat, lon]) => `<trkpt lat="${lat}" lon="${lon}"/>`)
				.join("\n");
			return `<trkseg>\n${trkpts}\n</trkseg>`;
		})
		.join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="sirlisko blog" xmlns="http://www.topografix.com/GPX/1/1">
<trk>
${trksegs}
</trk>
</gpx>
`;
}

if (!(await fs.stat(SRC).catch(() => null))) {
	console.error("No assets/gpx/ folder found.");
	process.exit(1);
}

await fs.mkdir(DEST, { recursive: true });
let failed = 0;
for (const name of await fs.readdir(SRC)) {
	if (path.extname(name).toLowerCase() !== ".gpx") continue;
	const file = path.join(SRC, name);
	const out = path.join(DEST, name);

	if (!opts.force && (await fs.stat(out).catch(() => null))) {
		console.log(`skip   ${name} (output exists, use --force)`);
		continue;
	}

	try {
		const segments = parseSegments(await fs.readFile(file, "utf8"));
		if (!segments.flat().length) throw new Error("no track points");
		const simplified = segments.map(simplify);
		await fs.writeFile(out, toGpx(simplified));

		const [before, after] = await Promise.all([fs.stat(file), fs.stat(out)]);
		const kb = (n) => `${Math.round(n / 1024)}KB`;
		console.log(
			`done   ${name}: ${segments.flat().length} -> ` +
				`${simplified.flat().length} points ` +
				`(${kb(before.size)} -> ${kb(after.size)})`,
		);
	} catch (err) {
		failed++;
		console.error(`fail   ${name}: ${err.message}`);
	}
}
process.exit(failed ? 1 : 0);
