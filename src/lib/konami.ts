const SEQUENCE = [
	"arrowup",
	"arrowup",
	"arrowdown",
	"arrowdown",
	"arrowleft",
	"arrowright",
	"arrowleft",
	"arrowright",
	"b",
	"a",
];

export const KONAMI_EVENT = "konami";

const isTyping = (target: EventTarget | null) =>
	target instanceof HTMLElement &&
	(target.isContentEditable ||
		["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export const initKonami = (target: Document = document) => {
	let keys: string[] = [];

	const onKeyDown = (event: KeyboardEvent) => {
		if (isTyping(event.target)) {
			return;
		}
		// A rolling window rather than a cursor, so a third ↑ still leaves ↑↑ in place.
		keys = [...keys, event.key.toLowerCase()].slice(-SEQUENCE.length);
		if (keys.join() === SEQUENCE.join()) {
			keys = [];
			target.dispatchEvent(new CustomEvent(KONAMI_EVENT));
		}
	};

	target.addEventListener("keydown", onKeyDown);
	return () => target.removeEventListener("keydown", onKeyDown);
};
