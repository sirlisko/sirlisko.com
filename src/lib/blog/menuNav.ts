const STEPS: Record<string, (index: number, last: number) => number> = {
	ArrowDown: (index, last) => Math.min(index + 1, last),
	ArrowUp: (index) => Math.max(index - 1, 0),
	Home: () => 0,
	End: (_, last) => last,
};

/** Where the cursor lands in a list of `length` items, or null for keys it ignores. */
export const menuStep = (
	key: string,
	index: number,
	length: number,
): number | null => STEPS[key]?.(index, length - 1) ?? null;

/**
 * Once a post in a list has focus, the arrow keys move between posts like a
 * Game Boy menu. Until then they scroll the page as usual.
 */
export const handleMenuKeys = (event: KeyboardEvent) => {
	const current = document.activeElement;
	if (
		event.altKey ||
		event.ctrlKey ||
		event.metaKey ||
		event.shiftKey ||
		!(current instanceof HTMLElement) ||
		!current.matches("[data-menu-item]")
	) {
		return;
	}
	const items = [
		...document.querySelectorAll<HTMLElement>("[data-menu-item]"),
	].filter((item) => item.checkVisibility());
	const next = menuStep(event.key, items.indexOf(current), items.length);
	if (next === null) {
		return;
	}
	event.preventDefault();
	items[next]?.focus();
	items[next]?.scrollIntoView({ block: "nearest" });
};
