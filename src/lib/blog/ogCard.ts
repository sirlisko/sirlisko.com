import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

interface Card {
	title: string;
	subtitle?: string;
	meta?: string;
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

const INK = "#0f380f";
const SHADE = "#306230";
const PEA = "#8bac0f";
const LCD = "#dde4c3";
const LED = "#c8231b";

// satori can't read woff2, so it gets Fontsource's woff and the browser fonts stay woff2-only.
const loadFont = (family: string, weight: number) =>
	readFile(
		join(
			process.cwd(),
			`node_modules/@fontsource/${family}/files/${family}-latin-${weight}-normal.woff`,
		),
	);

// satori can't decode webp, and smoothing would blur the pixel art.
const loadAvatar = async () => {
	const png = await sharp(join(process.cwd(), "src/images/me.webp"))
		.resize({ width: 64, kernel: sharp.kernel.nearest })
		.png()
		.toBuffer();
	return `data:image/png;base64,${png.toString("base64")}`;
};

const el = (
	type: string,
	style: Record<string, unknown>,
	children?: unknown,
) => ({ type, props: { style, children } });

/** The blog's share card: a Game Boy screen with the title, and the face in the corner. */
export const renderGameBoyCard = async ({ title, subtitle, meta }: Card) => {
	const [regular, semibold, pixel, avatar] = await Promise.all([
		loadFont("ibm-plex-mono", 400),
		loadFont("ibm-plex-mono", 600),
		loadFont("press-start-2p", 400),
		loadAvatar(),
	]);

	const header = el(
		"div",
		{ display: "flex", justifyContent: "space-between", alignItems: "center" },
		[
			el(
				"span",
				{
					fontFamily: "Press Start 2P",
					fontSize: 36,
					textShadow: `2px 2px 0 ${PEA}, 4px 4px 0 ${SHADE}`,
				},
				"/blog",
			),
			el("div", { width: 18, height: 18, borderRadius: 9, background: LED }),
		],
	);

	const body = el(
		"div",
		{ display: "flex", flexDirection: "column", gap: 20 },
		[
			el(
				"div",
				{
					fontSize: title.length > 60 ? 50 : 62,
					fontWeight: 600,
					lineHeight: 1.15,
					letterSpacing: -1,
				},
				title,
			),
			subtitle && el("div", { fontSize: 30, color: SHADE }, subtitle),
		].filter(Boolean),
	);

	const footer = el(
		"div",
		{
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			fontSize: 26,
			color: SHADE,
		},
		[
			el("div", { display: "flex", alignItems: "center", gap: 20 }, [
				{ type: "img", props: { src: avatar, width: 64, height: 92 } },
				el("span", {}, "sirlisko.com/blog"),
			]),
			meta && el("span", {}, meta),
		].filter(Boolean),
	);

	const screen = el(
		"div",
		{
			flex: 1,
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			border: `6px solid ${INK}`,
			boxShadow: `16px 16px 0 ${PEA}`,
			background: LCD,
			padding: "44px 56px",
		},
		[header, body, footer],
	);

	const svg = await satori(
		el(
			"div",
			{
				width: "100%",
				height: "100%",
				display: "flex",
				background: LCD,
				padding: "40px 56px 56px 40px",
				fontFamily: "IBM Plex Mono",
				color: INK,
			},
			screen,
		) as Parameters<typeof satori>[0],
		{
			...OG_IMAGE_SIZE,
			embedFont: true,
			fonts: [
				{ name: "IBM Plex Mono", data: regular, weight: 400, style: "normal" },
				{ name: "IBM Plex Mono", data: semibold, weight: 600, style: "normal" },
				{ name: "Press Start 2P", data: pixel, weight: 400, style: "normal" },
			],
		},
	);

	return sharp(Buffer.from(svg)).png().toBuffer();
};
