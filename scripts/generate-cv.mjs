import { execSync, spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer";

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = "public/cv";

if (!existsSync(OUTPUT_DIR)) {
	mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("Building...");
execSync("pnpm build", { stdio: "inherit" });

console.log("Starting preview server...");
const server = spawn("pnpm", ["preview"], { stdio: "ignore" });

const waitForServer = async (url, timeout = 15000) => {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		try {
			await fetch(url);
			return;
		} catch {
			await new Promise((r) => setTimeout(r, 300));
		}
	}
	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
};

try {
	console.log("Waiting for server...");
	await waitForServer(BASE_URL);

	console.log("Launching browser...");
	const systemChrome =
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
	const browser = await puppeteer.launch({
		executablePath: existsSync(systemChrome) ? systemChrome : undefined,
	});

	const compress = (filePath) => {
		const tmp = `${filePath}.tmp.pdf`;
		try {
			execSync(
				`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/printer -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${tmp}" "${filePath}"`,
			);
			execSync(`mv "${tmp}" "${filePath}"`);
		} catch {
			console.warn("  ⚠ Ghostscript not found, skipping compression");
			if (existsSync(tmp)) execSync(`rm "${tmp}"`);
		}
	};

	const generatePdf = async (path, outputFile) => {
		const page = await browser.newPage();
		await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle0" });
		const outPath = join(OUTPUT_DIR, outputFile);
		await page.pdf({ path: outPath, format: "A4", printBackground: true });
		await page.close();
		compress(outPath);
		console.log(`  ✓ ${outPath}`);
	};

	console.log("Generating PDFs...");
	await generatePdf("/resume", "luca-lischetti-resume.pdf");
	await generatePdf("/resume?alt=true", "alt.pdf");

	await browser.close();
	console.log("Done!");
} finally {
	server.kill();
}
