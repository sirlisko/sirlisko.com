import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import puppeteer from "puppeteer";

const OUTPUT_DIR = "public/images/projects/screens";
const VIEWPORT = { width: 1280, height: 800 };

const SIMPLE_CAPTURES = {
	been: "https://been.sirlisko.com/@luca",
	countdown: "https://countdown.sirlisko.com/",
	moon: "https://moon.sirlisko.com",
	pizzaclub: "https://pizzaclub.sirlisko.com/",
	rainylondon: "https://rainylondon.sirlisko.com",
	strahd: "https://strahd.ogreballerino.com",
	talelock: "https://talelock.com",
	pixelicons: "https://pixelicons.sirlisko.com",
	zoommeme: "https://zoomme.me",
};

const GIF_TOPICS = [
	"cat",
	"dog",
	"pizza",
	"coffee",
	"rain",
	"london",
	"beach",
	"music",
	"party",
	"sleep",
	"friday",
	"coding",
	"football",
	"sun",
	"concert",
	"travel",
	"food",
	"happy",
	"tired",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot(url, { setup, before, clip, scale = 1 } = {}) {
	const page = await browser.newPage();
	await page.setViewport({ ...VIEWPORT, deviceScaleFactor: scale });
	await page.emulateMediaFeatures([
		{ name: "prefers-color-scheme", value: "dark" },
	]);
	await setup?.(page);
	await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
	await sleep(3000);
	await before?.(page);
	const png = await page.screenshot({ clip, encoding: "base64" });
	await page.close();
	return png;
}

async function save(name, png) {
	const [large, small] = await canvas.evaluate(async (src) => {
		const img = new Image();
		img.src = `data:image/png;base64,${src}`;
		await img.decode();
		return [1280, 640].map((width) => {
			const c = document.createElement("canvas");
			c.width = width;
			c.height = (width * 10) / 16;
			c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
			return c.toDataURL("image/webp", 0.8).split(",")[1];
		});
	}, png);
	await writeFile(join(OUTPUT_DIR, `${name}@2x.webp`), large, "base64");
	await writeFile(join(OUTPUT_DIR, `${name}.webp`), small, "base64");
	console.log("✓", name);
}

const fixedTime = (iso, timezone) => async (page) => {
	await page.emulateTimezone(timezone);
	await page.evaluateOnNewDocument((now) => {
		const RealDate = Date;
		globalThis.Date = class extends RealDate {
			constructor(...args) {
				super(...(args.length ? args : [now]));
			}
			static now() {
				return now;
			}
		};
	}, new Date(iso).getTime());
};

const seedStorage = (key, value) => (page) =>
	page.evaluateOnNewDocument(
		(k, v) => localStorage.setItem(k, v),
		key,
		JSON.stringify(value),
	);

async function randomGifDays() {
	const gifs = [];
	for (const topic of GIF_TOPICS) {
		const res = await fetch(
			`https://gifday.sirlisko.com/.netlify/functions/gif?q=${topic}`,
		);
		const { data } = await res.json();
		if (data?.images) {
			gifs.push({
				text: topic,
				gif: {
					gif: data.images.downsized_small.mp4,
					still: data.images["480w_still"].url,
				},
			});
		}
	}
	const today = new Date();
	const days = {};
	for (let m = 0; m <= today.getMonth(); m++) {
		for (let d = 0; d < 28; d++) {
			if (m === today.getMonth() && d >= today.getDate() - 1) break;
			if (Math.random() < 0.7) {
				days[`${d}-${m}-${today.getFullYear()}`] =
					gifs[Math.floor(Math.random() * gifs.length)];
			}
		}
	}
	return days;
}

// The page centres its content and pads only SÌ for the accent, so the two verdicts land at
// different heights; top-align both and pad both so they line up when cut side by side.
const alignVerdict = async (page) => {
	await page.addStyleTag({
		content:
			"main { justify-content: flex-start } .answer { padding-top: .3em }",
	});
	await sleep(300);
};

// Crop the centre of each verdict and put them side by side.
async function cappuccino() {
	return canvas.evaluate(
		async (yesSrc, noSrc) => {
			const load = async (src) => {
				const img = new Image();
				img.src = `data:image/png;base64,${src}`;
				await img.decode();
				return img;
			};
			const c = document.createElement("canvas");
			c.width = 1280;
			c.height = 800;
			const ctx = c.getContext("2d");
			ctx.drawImage(await load(yesSrc), 290, 0, 700, 800, 0, 0, 700, 800);
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(700, 0);
			ctx.lineTo(1280, 0);
			ctx.lineTo(1280, 800);
			ctx.lineTo(580, 800);
			ctx.clip();
			ctx.drawImage(await load(noSrc), 290, 0, 700, 800, 580, 0, 700, 800);
			ctx.restore();
			ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(700, 0);
			ctx.lineTo(580, 800);
			ctx.stroke();
			return c.toDataURL("image/png").split(",")[1];
		},
		await shoot("https://cappuccino.sirlisko.com", {
			setup: fixedTime("2026-09-28T09:30:00+01:00", "Europe/London"),
			before: alignVerdict,
		}),
		await shoot("https://cappuccino.sirlisko.com", {
			setup: fixedTime("2026-09-28T16:30:00+01:00", "Europe/London"),
			before: alignVerdict,
		}),
	);
}

async function gifday() {
	return shoot("https://gifday.sirlisko.com/", {
		setup: seedStorage("dailyGifs", await randomGifDays()),
		before: async (page) => {
			await page.evaluate(() => window.scrollTo(0, 0));
			await sleep(3000);
		},
	});
}

// The band photo and setlist highlights fade in after the page settles.
async function gigplaylist() {
	return shoot("https://gigplaylist.sirlisko.com/the%20black%20keys", {
		before: () => sleep(5000),
	});
}

const CAPTURES = {
	gigplaylist,
	gifday,
	cappuccino,
	...Object.fromEntries(
		Object.entries(SIMPLE_CAPTURES).map(([name, url]) => [
			name,
			() => shoot(url),
		]),
	),
};

async function pick() {
	const names = Object.keys(CAPTURES).sort();
	const args = process.argv.slice(2);
	if (args.length) return args;

	console.log(
		names.map((name, i) => `${String(i + 1).padStart(2)}. ${name}`).join("\n"),
	);
	const rl = createInterface({ input: stdin, output: stdout });
	rl.on("SIGINT", () => process.exit(0));
	rl.on("close", () => process.exit(0));
	const answer = await rl
		.question(
			"\nWhich ones? (numbers or names, comma/space separated, empty for all) ",
		)
		.catch(() => process.exit(0));
	rl.removeAllListeners("close");
	rl.close();
	const picks = answer.split(/[\s,]+/).filter(Boolean);
	if (!picks.length) return names;
	return picks.map((p) => (/^\d+$/.test(p) ? (names[Number(p) - 1] ?? p) : p));
}

const selected = await pick();
const unknown = selected.filter((name) => !CAPTURES[name]);
if (unknown.length) {
	console.error(`Unknown capture: ${unknown.join(", ")}`);
	process.exit(1);
}

// System Chrome, because the bundled one can't play GIPHY's H.264 videos on GifDay.
const browser = await puppeteer.launch({ channel: "chrome" });
const canvas = await browser.newPage();

for (const name of selected) {
	await save(name, await CAPTURES[name]());
}

await browser.close();
