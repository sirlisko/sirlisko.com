import { execSync, spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import puppeteer from "puppeteer";

const SITE_URL = "https://sirlisko.com";
const OUTPUT_DIR = "public/cv";
const ENV_FILE = ".env";
const QR_CODE_PATH = join("scripts", "assets", "qr-code.png");
const QR_CODE_ALT_PATH = join("scripts", "assets", "qr-code-alt.png");
const QR_CODE_SIZE = 70;
const QR_CODE_MARGIN = 24;

if (!existsSync(OUTPUT_DIR)) {
	mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!existsSync(ENV_FILE)) {
	throw new Error(`${ENV_FILE} not found — create it with PHONE_NUMBER=...`);
}

const detectBaseUrl = (proc, timeout = 15000) =>
	new Promise((resolve, reject) => {
		let output = "";
		const timer = setTimeout(() => {
			proc.stdout.off("data", onData);
			reject(
				new Error(
					`Preview server did not report a port within ${timeout}ms:\n${output}`,
				),
			);
		}, timeout);
		const onData = (chunk) => {
			output += chunk.toString();
			const match = output.match(/localhost:(\d+)/);
			if (match) {
				clearTimeout(timer);
				proc.stdout.off("data", onData);
				resolve(`http://localhost:${match[1]}`);
			}
		};
		proc.stdout.on("data", onData);
	});

const addQrCode = async (filePath, isAlt) => {
	const [pdfBytes, qrCodeBytes] = await Promise.all([
		readFile(filePath),
		readFile(isAlt ? QR_CODE_ALT_PATH : QR_CODE_PATH),
	]);
	const pdfDoc = await PDFDocument.load(pdfBytes);
	const qrCodeImage = await pdfDoc.embedPng(qrCodeBytes);
	const [firstPage] = pdfDoc.getPages();
	firstPage.drawImage(qrCodeImage, {
		x: QR_CODE_MARGIN,
		y: QR_CODE_MARGIN,
		width: QR_CODE_SIZE,
		height: QR_CODE_SIZE,
	});
	await writeFile(filePath, await pdfDoc.save());
};

const compress = (filePath) => {
	const tmp = `${filePath}.tmp.pdf`;
	try {
		execSync(
			`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.7 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${tmp}" "${filePath}"`,
		);
		execSync(`mv "${tmp}" "${filePath}"`);
	} catch {
		console.warn(
			"  ⚠ Ghostscript not found, skipping compression (install with: brew install ghostscript)",
		);
		if (existsSync(tmp)) execSync(`rm "${tmp}"`);
	}
};

const generatePdf = async (browser, baseUrl, path, outputFile) => {
	const page = await browser.newPage();
	await page.setRequestInterception(true);
	page.on("request", async (request) => {
		const url = request.url();
		if (url.startsWith(baseUrl) && url.endsWith(".webp")) {
			try {
				const res = await fetch(url.replace(".webp", ".png"));
				if (res.ok) {
					request.respond({
						status: 200,
						contentType: "image/png",
						body: Buffer.from(await res.arrayBuffer()),
					});
					return;
				}
			} catch {}
		}
		request.continue();
	});
	const response = await page.goto(`${baseUrl}${path}`, {
		waitUntil: "networkidle0",
	});
	if (!response.ok()) {
		throw new Error(
			`${baseUrl}${path} returned ${response.status()}, expected a successful response`,
		);
	}
	await page.evaluate(
		(from, to) => {
			for (const el of document.querySelectorAll("a[href]")) {
				el.href = el.href.replace(from, to);
			}
		},
		baseUrl,
		SITE_URL,
	);
	const outPath = join(OUTPUT_DIR, outputFile);
	await page.pdf({ path: outPath, format: "A4", printBackground: true });
	await page.close();
	await addQrCode(outPath, path.includes("alt=true"));
	compress(outPath);
	console.log(`  ✓ ${outPath}`);
};

// The phone number is baked in at build time by CV_BUILD, so the public and
// private PDFs need a build each rather than a querystring on one preview.
const withPreview = async (env, run) => {
	console.log("Building...");
	execSync("pnpm build", { stdio: "inherit", env: { ...process.env, ...env } });

	console.log("Starting preview server...");
	const server = spawn("pnpm", ["preview"], {
		stdio: ["ignore", "pipe", "ignore"],
		detached: true,
	});
	try {
		console.log("Waiting for server...");
		const baseUrl = await detectBaseUrl(server);
		console.log(`  Preview server at ${baseUrl}`);
		await run(baseUrl);
	} finally {
		if (server.pid) {
			try {
				process.kill(-server.pid, "SIGTERM");
			} catch {}
		}
	}
};

console.log("Launching browser...");
const systemChrome =
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
	executablePath: existsSync(systemChrome) ? systemChrome : undefined,
});

try {
	// Explicitly empty, not merely absent: a stray CV_BUILD in the shell or in
	// .env would otherwise leak the phone number into the public PDFs.
	await withPreview({ CV_BUILD: "" }, async (baseUrl) => {
		console.log("Generating public PDFs...");
		await generatePdf(browser, baseUrl, "/resume", "luca-lischetti-resume.pdf");
		await generatePdf(browser, baseUrl, "/resume?alt=true", "alt.pdf");
	});

	await withPreview({ CV_BUILD: "1" }, async (baseUrl) => {
		console.log("Generating private PDFs...");
		await generatePdf(browser, baseUrl, "/resume", "private.pdf");
		await generatePdf(browser, baseUrl, "/resume?alt=true", "private-alt.pdf");
	});
	console.log("Done!");
} finally {
	await browser.close();
}
