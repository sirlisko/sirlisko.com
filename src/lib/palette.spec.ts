import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initPalette } from "./palette";

const PALETTE = `
	<div data-palette>
		<label data-palette-js hidden><input type="search"></label>
		<ul>
			<li data-search="web browser zen privacy-focused"><a href="https://zen.test">Zen</a></li>
			<li data-search="mail service fastmail masked emails"><a href="https://fastmail.test">FastMail</a></li>
			<li data-search="read later readeck self-hosted."><a href="https://readeck.test">Readeck</a></li>
		</ul>
		<p data-palette-empty hidden>Nothing</p>
		<div data-palette-js hidden><span data-palette-count></span></div>
	</div>
`;

const input = () => document.querySelector("input") as HTMLInputElement;
const rows = () => [...document.querySelectorAll<HTMLElement>("[data-search]")];
const type = (value: string) => {
	input().value = value;
	input().dispatchEvent(new Event("input"));
};
const press = (key: string) =>
	input().dispatchEvent(new KeyboardEvent("keydown", { key }));
const selectedText = () =>
	document.querySelector("[data-selected]")?.textContent;

let cleanup: () => void;

beforeEach(() => {
	document.body.innerHTML = PALETTE;
	cleanup = initPalette();
});

afterEach(() => cleanup());

describe("software palette", () => {
	test("shows the search and every row once it runs", () => {
		expect(document.querySelector("label")?.hidden).toBe(false);
		expect(rows().every((row) => !row.hidden)).toBe(true);
		expect(document.querySelector("[data-palette-count]")?.textContent).toBe(
			"3 of 3",
		);
	});

	test("filters by category, app or note, ignoring case", () => {
		type("MAIL");
		expect(rows().map((row) => row.hidden)).toEqual([true, false, true]);
		type("self");
		expect(selectedText()).toBe("Readeck");
	});

	test("says so when nothing matches", () => {
		type("emacs");
		expect(
			document.querySelector<HTMLElement>("[data-palette-empty]")?.hidden,
		).toBe(false);
		expect(selectedText()).toBeUndefined();
	});

	test("arrows move through visible rows and wrap", () => {
		press("ArrowDown");
		expect(selectedText()).toBe("FastMail");
		press("ArrowUp");
		press("ArrowUp");
		expect(selectedText()).toBe("Readeck");
	});

	test("enter opens the selected row", () => {
		const click = vi.fn((event: Event) => event.preventDefault());
		document.addEventListener("click", click);
		type("zen");
		press("Enter");
		expect(click).toHaveBeenCalledOnce();
		const target = click.mock.lastCall?.[0]?.target as HTMLElement | undefined;
		expect(target?.textContent).toBe("Zen");
		document.removeEventListener("click", click);
	});
});
