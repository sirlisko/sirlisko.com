const PREFIX = "track";

/** `data-track-foo="bar"` on the element becomes `{ foo: "bar" }`. */
const props = (el: HTMLElement) =>
	Object.fromEntries(
		Object.entries(el.dataset)
			.filter(([key]) => key.startsWith(PREFIX) && key !== PREFIX)
			.map(([key, value]) => [
				key.charAt(PREFIX.length).toLowerCase() + key.slice(PREFIX.length + 1),
				value,
			]),
	);

// Umami's own `data-umami-event` clicks are switched off along with
// auto-track, so clicks on `[data-track]` are reported from here instead.
export const initTracking = (target: Document = document) => {
	const onClick = (event: MouseEvent) => {
		if (!(event.target instanceof Element)) {
			return;
		}
		const el = event.target.closest<HTMLElement>("[data-track]");
		const name = el?.dataset.track;
		if (el && name) {
			window.umami?.track(name, props(el));
		}
	};

	target.addEventListener("click", onClick);
	return () => target.removeEventListener("click", onClick);
};
