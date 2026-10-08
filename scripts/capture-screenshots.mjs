import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer";

const OUTPUT_DIR = "public/images/projects/screens";
const VIEWPORT = { width: 1280, height: 800 };

const SIMPLE_CAPTURES = {
	been: "https://been.sirlisko.com/@luca",
	countdown: "https://countdown.sirlisko.com/",
	gigplaylist: "https://gigplaylist.sirlisko.com/the%20black%20keys",
	moon: "https://moon.sirlisko.com",
	pizzaclub: "https://pizzaclub.sirlisko.com/",
	rainylondon: "https://rainylondon.sirlisko.com",
	strahd: "https://strahd.ogreballerino.com",
	talelock: "https://talelock.com",
	pixelicons: "https://pixelicons.sirlisko.com",
};

const ZOOMMEME_EXAMPLE =
	"https://raw.githubusercontent.com/sirlisko/zoomMEME/master/example.jpeg";
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

// System Chrome, because the bundled one can't play GIPHY's H.264 videos on GifDay.
const browser = await puppeteer.launch({ channel: "chrome" });
const canvas = await browser.newPage();

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

async function zoomMemeFace() {
	const example = Buffer.from(
		await (await fetch(ZOOMMEME_EXAMPLE)).arrayBuffer(),
	).toString("base64");
	const face = await canvas.evaluate(async (src) => {
		const img = new Image();
		img.src = `data:image/jpeg;base64,${src}`;
		await img.decode();
		const c = document.createElement("canvas");
		c.width = 800;
		c.height = 400;
		// example.jpeg stacks four zoom frames; the first is the unzoomed photo
		c.getContext("2d").drawImage(
			img,
			0,
			0,
			img.width,
			img.width / 2,
			0,
			0,
			800,
			400,
		);
		return c.toDataURL("image/jpeg", 0.9).split(",")[1];
	}, example);
	const path = join(await mkdtemp(join(tmpdir(), "zoommeme-")), "face.jpg");
	await writeFile(path, face, "base64");
	return path;
}

// Both verdicts sit in the same spot, so crop the centre of each and put them side by side.
const cappuccino = await canvas.evaluate(
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
	}),
	await shoot("https://cappuccino.sirlisko.com", {
		setup: fixedTime("2026-09-28T16:30:00+01:00", "Europe/London"),
	}),
);

const face = await zoomMemeFace();
await save(
	"zoommeme",
	await shoot("https://zoomme.me", {
		scale: 2,
		clip: { x: 320, y: 150, width: 640, height: 400 },
		before: async (page) => {
			const input = await page.$("input[type=file]");
			await input.uploadFile(face);
			await sleep(2000);
			// The same width and margins the +/- buttons and dragging set, keeping the face centred.
			await page.evaluate(() => {
				const imgs = [...document.querySelectorAll(".zoom__box img")];
				const base = imgs[0].offsetWidth;
				for (const [frame, img] of imgs.entries()) {
					const grown = frame * 200;
					img.style.width = `${base + grown}px`;
					img.style.marginLeft = `${-grown * 0.55}px`;
					img.style.marginTop = `${-grown * 0.2}px`;
				}
			});
			await sleep(800);
		},
	}),
);

await save(
	"gifday",
	await shoot("https://gifday.sirlisko.com/", {
		setup: seedStorage("dailyGifs", await randomGifDays()),
		before: async (page) => {
			await page.evaluate(() => window.scrollTo(0, 0));
			await sleep(3000);
		},
	}),
);

await save("cappuccino", cappuccino);

for (const [name, url] of Object.entries(SIMPLE_CAPTURES)) {
	await save(name, await shoot(url));
}

await browser.close();
