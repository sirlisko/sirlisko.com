#!/usr/bin/env node
// Usage: pnpm run generate:feed-images [base-url]
// Screenshots every map and diagram in a post body, in the light scheme, for
// the RSS feed, which can't run Leaflet or read the page's CSS. Needs a build
// and a server: pnpm run build && pnpm run preview, then run this and commit
// public/blog/feed. Rerun after adding or editing a map or diagram.
import { mkdir, readdir, readFile, rm } from "node:fs/promises";
import puppeteer from "puppeteer";

const OUTPUT_DIR = "public/blog/feed";
// Each shot is the full article column, the same images the page shows.
const SELECTOR =
	"#article :is(figure.pele-diagram, [data-gpx-map], [data-route-map])";
const MARKERS = ['class="pele-diagram"', "data-gpx-map=", "data-route-map="];

const base = (
	process.argv.slice(2).find((arg) => arg !== "--") ?? "http://localhost:4321"
).replace(/\/$/, "");

// Post slugs, as postSlug() in src/lib/blog/posts.ts makes them
const posts = (await readdir("src/content/posts"))
	.filter((file) => /\.mdx?$/.test(file))
	.map((file) =>
		file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx?$/, ""),
	);

const slugs = [];
for (const slug of posts) {
	const html = await readFile(`dist/blog/${slug}/index.html`, "utf8").catch(
		() => "",
	);
	if (MARKERS.some((marker) => html.includes(marker))) slugs.push(slug);
}

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });

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
