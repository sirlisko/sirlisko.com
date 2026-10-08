import { type IconNode, icons } from "lucide";
import sharp from "sharp";

export type IconName = keyof typeof icons;

export const GRID = 16;
// Lucide draws on 24 units, so 1.5 lands on exactly one pixel of a 16 grid.
const STROKE = 1.5;
// Alpha a pixel needs to be inked; lower fills in curves, higher breaks diagonals.
const INK = 100;

const toSvg = (node: IconNode) => {
	const children = node
		.map(
			([tag, attrs]) =>
				`<${tag} ${Object.entries(attrs)
					.map(([k, v]) => `${k}="${v}"`)
					.join(" ")}/>`,
		)
		.join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="${STROKE}" stroke-linecap="square" stroke-linejoin="miter">${children}</svg>`;
};

/** One path for the inked pixels, a rectangle per horizontal run. */
export const runsToPath = (alpha: Uint8Array, size = GRID) => {
	const inked = (i: number) => (alpha[i] ?? 0) >= INK;
	let d = "";
	for (let y = 0; y < size; y++) {
		let x = 0;
		while (x < size) {
			if (!inked(y * size + x)) {
				x++;
				continue;
			}
			const start = x;
			while (x < size && inked(y * size + x)) x++;
			d += `M${start} ${y}h${x - start}v1h${start - x}z`;
		}
	}
	return d;
};

/** Redraws a Lucide icon as a 16×16 sprite, at build time. */
export const pixelIcon = async (name: IconName) => {
	const alpha = await sharp(Buffer.from(toSvg(icons[name])), { density: 384 })
		.resize(GRID, GRID, { kernel: "lanczos3" })
		.ensureAlpha()
		.extractChannel(3)
		.raw()
		.toBuffer();
	return runsToPath(alpha);
};
