// Four-shade Game Boy palette for Shiki code blocks
export default {
	name: "game-boy",
	type: "dark" as const,
	colors: {
		"editor.background": "#0f380f",
		"editor.foreground": "#c4d49a",
	},
	tokenColors: [
		{
			scope: ["comment", "punctuation.definition.comment"],
			settings: {
				foreground: "#8bac0f",
				fontStyle: "italic",
			},
		},
		{
			scope: [
				"keyword",
				"storage",
				"storage.type",
				"storage.modifier",
				"keyword.control",
				"keyword.operator.new",
				"keyword.operator.expression",
			],
			settings: {
				foreground: "#f0f7d4",
				fontStyle: "bold",
			},
		},
		{
			scope: [
				"string",
				"string.quoted",
				"string.template",
				"markup.inline.raw",
			],
			settings: {
				foreground: "#9bbc0f",
			},
		},
		{
			scope: [
				"constant.numeric",
				"constant.language",
				"constant.character",
				"support.constant",
				"variable.other.constant",
			],
			settings: {
				foreground: "#b7d35a",
			},
		},
		{
			scope: [
				"entity.name.function",
				"support.function",
				"meta.function-call",
				"entity.name.type",
				"entity.name.class",
				"support.type",
				"support.class",
			],
			settings: {
				foreground: "#e0eeb0",
			},
		},
		{
			scope: ["entity.name.tag", "entity.other.attribute-name"],
			settings: {
				foreground: "#e0eeb0",
			},
		},
		{
			scope: ["markup.heading", "markup.bold"],
			settings: {
				fontStyle: "bold",
			},
		},
		{
			scope: ["markup.italic"],
			settings: {
				fontStyle: "italic",
			},
		},
		{
			scope: ["markup.inserted"],
			settings: {
				foreground: "#9bbc0f",
			},
		},
		{
			scope: ["markup.deleted"],
			settings: {
				foreground: "#ff8a7a",
			},
		},
	],
};
