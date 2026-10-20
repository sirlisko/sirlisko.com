#!/usr/bin/env node
// Usage: pnpm run gsc [url ...]
// Asks Search Console's URL Inspection API for the index status of every URL
// in the live sitemap (plus any URLs passed), grouped by coverage state. The
// "Why pages aren't indexed" report has no API, and lags days behind this.
// Needs GSC_CREDENTIALS in .env: the path to a service account key with
// access to the sc-domain:sirlisko.com property.
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";

const SITE = "sc-domain:sirlisko.com";
const SITEMAP = "https://sirlisko.com/sitemap-0.xml";
const CONCURRENCY = 5;

process.loadEnvFile(".env");
const key = JSON.parse(await readFile(process.env.GSC_CREDENTIALS, "utf8"));

async function getToken() {
	const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
	const now = Math.floor(Date.now() / 1000);
	const claims = b64({
		iss: key.client_email,
		scope: "https://www.googleapis.com/auth/webmasters.readonly",
		aud: key.token_uri,
		iat: now,
		exp: now + 3600,
	});
	const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${claims}`;
	const signature = crypto
		.sign("RSA-SHA256", Buffer.from(unsigned), key.private_key)
		.toString("base64url");
	const res = await fetch(key.token_uri, {
		method: "POST",
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: `${unsigned}.${signature}`,
		}),
	});
	const body = await res.json();
	if (!body.access_token) throw new Error(JSON.stringify(body));
	return body.access_token;
}

async function inspect(url, token) {
	const res = await fetch(
		"https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
		{
			method: "POST",
			headers: { authorization: `Bearer ${token}` },
			body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
		},
	);
	const body = await res.json();
	const status = body.inspectionResult?.indexStatusResult;
	return {
		url,
		state: status?.coverageState ?? `Error: ${body.error?.message}`,
		crawled: status?.lastCrawlTime?.slice(0, 10) ?? "never",
	};
}

const sitemap = await (await fetch(SITEMAP)).text();
const urls = [
	...[...sitemap.matchAll(/<loc>([^<]+)/g)].map((match) => match[1]),
	...process.argv.slice(2).filter((arg) => arg !== "--"),
];

const token = await getToken();
const results = [];
for (let i = 0; i < urls.length; i += CONCURRENCY) {
	const batch = urls.slice(i, i + CONCURRENCY);
	results.push(...(await Promise.all(batch.map((url) => inspect(url, token)))));
}

const byState = Object.groupBy(results, (result) => result.state);
for (const [state, group] of Object.entries(byState)) {
	console.log(`\n${state} (${group.length})`);
	if (state === "Submitted and indexed") continue;
	for (const { url, crawled } of group) {
		console.log(`  ${url}  (crawled: ${crawled})`);
	}
}
