#!/usr/bin/env node
// Usage: pnpm check:links, after pnpm build
// Fails when a page in dist links to a path or #anchor on this site that the
// build didn't produce. Links elsewhere aren't fetched; CI stays offline.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const DIST = "dist";

const pages = readdirSync(DIST, { recursive: true })
	.filter((file) => file.endsWith(".html") && !file.includes("pagefind"))
	.map((file) => `/${file}`);

// Netlify serves these, so a link to one is fine even with no file behind it.
const redirects = new Set(
	[
		...readFileSync("netlify.toml", "utf8").matchAll(/^from = "([^"*:]+)"$/gm),
	].map(([, from]) => from),
);

const fileFor = (urlPath) =>
	[urlPath, `${urlPath}/index.html`, `${urlPath}.html`]
		.map((candidate) => path.join(DIST, decodeURIComponent(candidate)))
		.find((file) => existsSync(file) && statSync(file).isFile());

const ids = new Map();
const idsIn = (file) => {
	if (!ids.has(file)) {
		const html = readFileSync(file, "utf8");
		ids.set(
			file,
			new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id)),
		);
	}
	return ids.get(file);
};

const broken = [];
for (const page of pages) {
	const html = readFileSync(path.join(DIST, page), "utf8");
	// Relative links resolve against the served address, which has no trailing slash.
	const served = page.replace(/(\/index)?\.html$/, "") || "/";
	for (const [, link] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
		const url = new URL(link.replaceAll("&amp;", "&"), `https://site${served}`);
		if (url.host !== "site") continue;
		const target = url.pathname.replace(/\/$/, "") || "/";
		if (redirects.has(target)) continue;
		const file = fileFor(target);
		const hash = decodeURIComponent(url.hash.slice(1));
		if (!file) broken.push(`${page} → ${link}`);
		else if (hash && file.endsWith(".html") && !idsIn(file).has(hash))
			broken.push(`${page} → ${link} (no #${hash})`);
	}
}

console.log(`Checked ${pages.length} pages.`);
if (broken.length) {
	console.error([...new Set(broken)].join("\n"));
	process.exit(1);
}
