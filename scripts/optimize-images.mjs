#!/usr/bin/env node
// Usage: pnpm run images [-- --max 1280 --quality 80 --force]
// Drop images in assets/<post-slug>/ and the optimised copies land in
// src/content/posts/images/<post-slug>/. Originals are left untouched.
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs, promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

const { values: opts } = parseArgs({
	options: {
		max: { type: "string", default: "1280" },
		quality: { type: "string", default: "80" },
		force: { type: "boolean", default: false },
	},
});

const SRC = path.resolve("assets");
const DEST = path.resolve("src/content/posts/images");
const MAX = Number(opts.max);
const QUALITY = Number(opts.quality);

const INPUT_EXT = new Set([
	".heic",
	".heif",
	".jpg",
	".jpeg",
	".png",
	".webp",
	".tif",
	".tiff",
]);

async function* walk(dir) {
	for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(full);
		else if (!entry.name.startsWith(".")) yield full;
	}
}

// sharp's prebuilt libvips can't decode HEIC, so let macOS do it.
async function heicToJpeg(file, tmpDir) {
	const out = path.join(tmpDir, `${path.basename(file)}.jpg`);
	await run("sips", ["-s", "format", "jpeg", file, "--out", out]);
	return out;
}

async function optimise(file, tmpDir) {
	const ext = path.extname(file).toLowerCase();
	const isHeic = ext === ".heic" || ext === ".heif";
	const keepPng = ext === ".png";

	const rel = path.relative(SRC, file);
	const outExt = keepPng ? ".png" : ".jpeg";
	const out = path.join(DEST, rel.slice(0, -ext.length) + outExt);

	if (!opts.force && (await fs.stat(out).catch(() => null))) {
		console.log(`skip   ${rel} (output exists, use --force)`);
		return;
	}

	const input = isHeic ? await heicToJpeg(file, tmpDir) : file;
	const pipeline = sharp(input).rotate().resize({
		width: MAX,
		height: MAX,
		fit: "inside",
		withoutEnlargement: true,
	});

	await fs.mkdir(path.dirname(out), { recursive: true });
	if (keepPng) {
		await pipeline.png({ compressionLevel: 9, palette: true }).toFile(out);
	} else {
		await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(out);
	}

	const [before, after] = await Promise.all([fs.stat(file), fs.stat(out)]);
	const kb = (n) => `${Math.round(n / 1024)}KB`;
	console.log(
		`done   ${rel} -> ${path.relative(process.cwd(), out)} ` +
			`(${kb(before.size)} -> ${kb(after.size)})`,
	);
}

if (!(await fs.stat(SRC).catch(() => null))) {
	console.error("No assets/ folder found.");
	process.exit(1);
}

const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "optimize-images-"));
let failed = 0;
try {
	for await (const file of walk(SRC)) {
		if (!INPUT_EXT.has(path.extname(file).toLowerCase())) {
			console.log(`skip   ${path.relative(SRC, file)} (unsupported type)`);
			continue;
		}
		try {
			await optimise(file, tmpDir);
		} catch (err) {
			failed++;
			console.error(`fail   ${path.relative(SRC, file)}: ${err.message}`);
		}
	}
} finally {
	await fs.rm(tmpDir, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
