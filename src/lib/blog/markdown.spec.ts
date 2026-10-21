import { describe, expect, test } from "vitest";
import { rehypeTaskListLabels } from "./markdown";

const el = (
	tagName: string,
	children: { type: string }[] = [],
	properties = {},
) => ({
	type: "element",
	tagName,
	properties,
	children,
});
const text = (value: string) => ({ type: "text", value });
const checkbox = () => el("input", [], { type: "checkbox", disabled: true });

describe("rehypeTaskListLabels", () => {
	test("wraps the checkbox and its text in a label, leaving nested lists out", () => {
		const nested = el("ul", [el("li", [text("Sub")])]);
		const item = el("li", [
			checkbox(),
			text(" Ship "),
			el("code", [text("it")]),
			nested,
		]);

		rehypeTaskListLabels()(item);

		expect(item.children).toEqual([
			el("label", [checkbox(), text(" Ship "), el("code", [text("it")])]),
			nested,
		]);
	});

	test("labels the checkbox inside a loose item's paragraph", () => {
		const paragraph = el("p", [checkbox(), text(" Done")]);
		const item = el("li", [text("\n"), paragraph]);

		rehypeTaskListLabels()(item);

		expect(paragraph.children).toEqual([
			el("label", [checkbox(), text(" Done")]),
		]);
	});

	test("leaves items without a checkbox alone", () => {
		const item = el("li", [text("Plain")]);

		rehypeTaskListLabels()(item);

		expect(item.children).toEqual([text("Plain")]);
	});
});
