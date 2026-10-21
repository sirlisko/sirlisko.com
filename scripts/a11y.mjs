#!/usr/bin/env node
// Usage: pnpm run a11y [base-url]
// Runs axe-core (WCAG 2.2 AA plus best practices) on every page in dist, in
// both colour schemes, and prints each failing rule with the pages it hits.
// Exits 1 if anything fails. Needs a build and a server:
// pnpm run build && pnpm run preview, then pnpm run a11y (or pass a base URL).
// axe can't judge focus visibility in forced colours, motion or reading
// order, so this complements a manual pass rather than replacing one.
import { readdir } from "node:fs/promises";
import puppeteer from "puppeteer";

const AXE = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js";
const TAGS = [
	"wcag2a",
	"wcag2aa",
	"wcag21a",
	"wcag21aa",
	"wcag22aa",
	"best-practice",
];

const base = (
	process.argv.slice(2).find((arg) => arg !== "--") ?? "http://localhost:4321"
).replace(/\/$/, "");

const pages = (await readdir("dist", { recursive: true }))
	.filter((file) => file.endsWith("index.html") && !file.includes("pagefind"))
	.map((file) => `/${file.replace(/\/?index\.html$/, "")}`)
	.sort();

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

/** rule id → { impact, help, hits: Map<"selector", Set<"scheme path">> } */
const failures = new Map();

for (const scheme of ["light", "dark"]) {
	// Reduced motion stops the typing and rolling effects mid-way through a check.
	await page.emulateMediaFeatures([
		{ name: "prefers-color-scheme", value: scheme },
		{ name: "prefers-reduced-motion", value: "reduce" },
	]);
	for (const path of pages) {
		await page.goto(`${base}${path}`, { waitUntil: "networkidle0" });
		await page.addScriptTag({ url: AXE });
		const violations = await page.evaluate(
			async (tags) =>
				(await window.axe.run(document, { runOnly: tags })).violations.map(
					(v) => ({
						id: v.id,
						impact: v.impact,
						help: v.help,
						targets: v.nodes.map((n) => n.target.join(" ")),
					}),
				),
			TAGS,
		);
		for (const { id, impact, help, targets } of violations) {
			const rule = failures.get(id) ?? { impact, help, hits: new Map() };
			for (const target of targets) {
				const where = rule.hits.get(target) ?? new Set();
				where.add(`${scheme} ${path}`);
				rule.hits.set(target, where);
			}
			failures.set(id, rule);
		}
	}
	process.stdout.write(`${scheme}: ${pages.length} pages checked\n`);
}

await browser.close();

if (failures.size === 0) {
	console.log("No violations.");
	process.exit(0);
}

for (const [id, { impact, help, hits }] of failures) {
	console.log(`\n${impact} · ${id}: ${help}`);
	for (const [target, where] of hits) {
		console.log(`  ${target}`);
		console.log(`    ${[...where].join(", ")}`);
	}
}
process.exit(1);
