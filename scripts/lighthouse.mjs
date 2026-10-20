#!/usr/bin/env node
// Usage: pnpm run lighthouse [--desktop] [--real] [url ...]
// Runs Lighthouse in headless Chrome against each URL (the live site by
// default), prints scores, Core Web Vitals and the biggest savings, and keeps
// the full HTML reports in a temp folder. Scores move a few points between
// runs, so rerun before reading much into a small change.
// --real throttles the network and CPU for real instead of simulating it,
// like PageSpeed does: slower, but simulation can misjudge pages that download
// and parse a big file at once, such as the GPX maps.
// For a local build: pnpm run build && pnpm run preview, then pass
// http://localhost:4321/blog/<slug>.
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs, promisify } from "node:util";

const run = promisify(execFile);

const { values: opts, positionals } = parseArgs({
	// pnpm passes a leading "--" through, which would end option parsing
	args: process.argv.slice(2).filter((arg) => arg !== "--"),
	allowPositionals: true,
	options: {
		desktop: { type: "boolean", default: false },
		real: { type: "boolean", default: false },
	},
});

const URLS = positionals.length
	? positionals
	: [
			"https://sirlisko.com",
			"https://sirlisko.com/resume",
			"https://sirlisko.com/blog",
			"https://sirlisko.com/blog/the-invariant-pattern-cleaner-typescript-with-assertion-functions",
			"https://sirlisko.com/blog/100km",
			"https://sirlisko.com/blog/southeast-asia-2026-part-1",
		];

const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "lighthouse-"));

for (const url of URLS) {
	const { host, pathname } = new URL(url);
	const name = `${host}${pathname}`.replace(/\W+/g, "-").replace(/-$/, "");
	const base = path.join(outDir, name);

	await run("npx", [
		"-y",
		"lighthouse@12.8.2",
		url,
		"--quiet",
		"--chrome-flags=--headless=new",
		"--only-categories=performance,accessibility,best-practices,seo",
		"--output=json",
		"--output=html",
		`--output-path=${base}`,
		...(opts.desktop ? ["--preset=desktop"] : []),
		...(opts.real ? ["--throttling-method=devtools"] : []),
	]);

	const { categories, audits } = JSON.parse(
		await fs.readFile(`${base}.report.json`, "utf8"),
	);
	const score = (id) => Math.round(categories[id].score * 100);
	const metric = (id) => audits[id].displayValue;

	console.log(`\n${url}`);
	console.log(
		`  perf ${score("performance")}  a11y ${score("accessibility")}  best ${score("best-practices")}  seo ${score("seo")}`,
	);
	console.log(
		`  LCP ${metric("largest-contentful-paint")}  CLS ${metric("cumulative-layout-shift")}  TBT ${metric("total-blocking-time")}  FCP ${metric("first-contentful-paint")}`,
	);

	const savings = Object.values(audits)
		.filter((a) => a.details?.overallSavingsMs > 100)
		.sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
		.slice(0, 3);
	for (const a of savings) {
		console.log(`  - ${a.title}: ${a.displayValue ?? ""}`);
	}
	console.log(`  report: ${base}.report.html`);
}
