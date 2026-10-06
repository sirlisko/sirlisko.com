import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer";
import sharp from "sharp";

const OUTPUT_DIR = "public/images/og";
const SIZE = { width: 1200, height: 630 };

// Each card wears its page's game, so a shared link already hints at what's behind it.
const CARDS = {
	now: {
		title: "/now",
		tagline: "What I'm up to right now",
		bg: "#000",
		fg: "#fff",
		accent: "#ffe14d",
		pellets: true,
	},
	projects: {
		title: "Projects",
		tagline: "Side projects & experiments",
		bg: "#000",
		fg: "#fcfcfc",
		accent: "#f83800",
	},
	uses: {
		title: "$ uses",
		tagline: "Apps and tools I use daily",
		bg: "#1b1c24",
		fg: "#eff0eb",
		accent: "#5af78e",
	},
	resume: {
		title: "Resume",
		tagline: "Senior full stack engineer",
		bg: "#2f4a3a",
		fg: "#fff",
		accent: "#ffd166",
	},
};

const dataUri = (path, type) =>
	`data:${type};base64,${readFileSync(path).toString("base64")}`;

const fonts = "node_modules/@fontsource";
const DISPLAY = dataUri(
	join(fonts, "press-start-2p/files/press-start-2p-latin-400-normal.woff2"),
	"font/woff2",
);
const MONO = dataUri(
	join(fonts, "ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2"),
	"font/woff2",
);
const FACE = dataUri("src/images/me.webp", "image/webp");

const html = ({ title, tagline, bg, fg, accent, pellets }) => `<!doctype html>
<html>
<head>
<style>
@font-face { font-family: "Press Start 2P"; src: url(${DISPLAY}); }
@font-face { font-family: "IBM Plex Mono"; src: url(${MONO}); }
* { box-sizing: border-box; }
body {
	margin: 0;
	width: ${SIZE.width}px;
	height: ${SIZE.height}px;
	background: ${bg};
	color: ${fg};
	display: flex;
	align-items: center;
	gap: 72px;
	padding: 0 96px;
	border: 16px solid ${accent};
}
img { width: 280px; image-rendering: pixelated; flex-shrink: 0; }
.text { display: flex; flex-direction: column; gap: 36px; min-width: 0; }
h1 { margin: 0; font: 400 72px/1.2 "Press Start 2P"; }
p { margin: 0; font: 400 34px/1.4 "IBM Plex Mono"; opacity: 0.9; }
.site { font: 400 20px "Press Start 2P"; color: ${accent}; }
.pellets {
	height: 16px;
	background-image: radial-gradient(circle, #ffb8ae 5px, transparent 5.5px);
	background-size: 40px 16px;
}
</style>
</head>
<body>
	<img src="${FACE}" alt="">
	<div class="text">
		<h1>${title}</h1>
		<p>${tagline}</p>
		${pellets ? '<div class="pellets"></div>' : ""}
		<span class="site">sirlisko.com</span>
	</div>
</body>
</html>`;

mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await puppeteer.launch();
try {
	const page = await browser.newPage();
	await page.setViewport(SIZE);
	for (const [name, card] of Object.entries(CARDS)) {
		await page.setContent(html(card), { waitUntil: "load" });
		await page.evaluate(() => document.fonts.ready);
		const path = join(OUTPUT_DIR, `${name}.png`);
		await sharp(await page.screenshot())
			.png({ palette: true, quality: 90 })
			.toFile(path);
		console.log(`Wrote ${path}`);
	}
} finally {
	await browser.close();
}
