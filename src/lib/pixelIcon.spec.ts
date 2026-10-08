import { describe, expect, test } from "vitest";
import { pixelIcon, runsToPath } from "./pixelIcon";

describe("runsToPath", () => {
	test("merges each horizontal run into one rectangle", () => {
		const alpha = new Uint8Array([0, 255, 255, 0, 255, 0, 0, 0, 0]);

		expect(runsToPath(alpha, 3)).toBe("M1 0h2v1h-2zM1 1h1v1h-1z");
	});

	test("leaves faint pixels blank", () => {
		expect(runsToPath(new Uint8Array([40, 60, 99, 0]), 2)).toBe("");
	});
});

describe("pixelIcon", () => {
	test("draws a sprite inside the 16 grid", async () => {
		const d = await pixelIcon("Mail");

		expect(d).not.toBe("");
		const coords = [...d.matchAll(/M(\d+) (\d+)h(\d+)/g)].map(([, x, y, w]) => [
			Number(x) + Number(w),
			Number(y),
		]);
		expect(coords.flat().every((n) => n <= 16)).toBe(true);
	});
});
