#!/usr/bin/env node
// Usage: pnpm run generate:feed-images [base-url] [slug...]
// Screenshots every map and diagram in a post body, in the light scheme, for
// the RSS feed, which can't run Leaflet or read the page's CSS. Needs a build
// and a server: pnpm run build && pnpm run preview, then run this and commit
// public/blog/feed. Rerun after adding or editing a map or diagram; pass
// slugs to reshoot only those posts, or none to rebuild the whole folder.
import { mkdir, readdir, readFile, rm } from "node:fs/promises";
import puppeteer from "puppeteer";

const OUTPUT_DIR = "public/blog/feed";
// Each shot is the full article column, the same images the page shows.
const SELECTOR =
	"#article :is(figure.pele-diagram, [data-gpx-map], [data-route-map])";
const MARKERS = ['class="pele-diagram"', "data-gpx-map=", "data-route-map="];

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const base = (
	args.find((arg) => arg.startsWith("http")) ?? "http://localhost:4321"
).replace(/\/$/, "");
const only = args.filter((arg) => !arg.startsWith("http"));

// Post slugs, as postSlug() in src/lib/blog/posts.ts makes them
const posts = (await readdir("src/content/posts"))
	.filter((file) => /\.mdx?$/.test(file))
	.map((file) => file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx?$/, ""))
	.filter((slug) => !only.length || only.includes(slug));

const slugs = [];
for (const slug of posts) {
	const html = await readFile(`dist/blog/${slug}/index.html`, "utf8").catch(
		() => "",
	);
	if (MARKERS.some((marker) => html.includes(marker))) slugs.push(slug);
}

// A full run starts from an empty folder so removed maps leave no orphans;
// a partial one clears only its own posts' shots.
if (only.length) {
	const stale = (await readdir(OUTPUT_DIR)).filter((file) =>
		slugs.some((slug) => new RegExp(`^${slug}-\\d+\\.webp$`).test(file)),
	);
	await Promise.all(stale.map((file) => rm(`${OUTPUT_DIR}/${file}`)));
} else {
	await rm(OUTPUT_DIR, { recursive: true, force: true });
	await mkdir(OUTPUT_DIR, { recursive: true });
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
await page.emulateMediaFeatures([
	{ name: "prefers-color-scheme", value: "light" },
]);

for (const slug of slugs) {
	await page.goto(`${base}/blog/${slug}`, { waitUntil: "networkidle0" });
	// Controls do nothing in a picture; the attribution stays, OSM requires it.
	await page.addStyleTag({
		content: ".leaflet-bar { display: none }",
	});
	const elements = await page.$$(SELECTOR);
	for (const [i, element] of elements.entries()) {
		await element.scrollIntoView();
		await page.waitForNetworkIdle();
		// Route maps put their legend after the map, so the shot takes both.
		const clip = await element.evaluate((el) => {
			const legend = el.nextElementSibling?.matches(".route-map-legend")
				? el.nextElementSibling
				: el;
			const { left, top, width } = el.getBoundingClientRect();
			const bottom = legend.getBoundingClientRect().bottom;
			return {
				x: left + scrollX,
				y: top + scrollY,
				width,
				height: bottom - top,
			};
		});
		await page.screenshot({
			path: `${OUTPUT_DIR}/${slug}-${i + 1}.webp`,
			type: "webp",
			quality: 85,
			clip,
		});
	}
	console.log(`${slug}: ${elements.length}`);
}

await browser.close();
