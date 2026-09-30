export const initPalette = (root: ParentNode = document) => {
	const palette = root.querySelector<HTMLElement>("[data-palette]");
	const input = palette?.querySelector<HTMLInputElement>("input");
	if (!palette || !input) {
		return () => {};
	}

	const rows = [...palette.querySelectorAll<HTMLElement>("[data-search]")];
	const count = palette.querySelector<HTMLElement>("[data-palette-count]");
	const empty = palette.querySelector<HTMLElement>("[data-palette-empty]");
	let selected: HTMLElement | undefined;

	const visibleRows = () => rows.filter((row) => !row.hidden);
	const select = (row: HTMLElement | undefined) => {
		selected?.removeAttribute("data-selected");
		selected = row;
		selected?.setAttribute("data-selected", "");
	};

	const filter = () => {
		const query = input.value.trim().toLowerCase();
		for (const row of rows) {
			row.hidden = !row.dataset.search?.includes(query);
		}
		const visible = visibleRows();
		select(visible[0]);
		if (count) count.textContent = `${visible.length} of ${rows.length}`;
		if (empty) empty.hidden = visible.length > 0;
	};

	const onKeydown = (event: KeyboardEvent) => {
		const visible = visibleRows();
		if (!visible.length) return;
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			const step = event.key === "ArrowDown" ? 1 : -1;
			const current = selected ? visible.indexOf(selected) : -1;
			select(visible[(current + step + visible.length) % visible.length]);
			selected?.scrollIntoView?.({ block: "nearest" });
		} else if (event.key === "Enter" && selected) {
			event.preventDefault();
			selected.querySelector("a")?.click();
		}
	};

	// Without JS the palette is a plain list; the search only exists once it works.
	for (const el of palette.querySelectorAll<HTMLElement>("[data-palette-js]")) {
		el.hidden = false;
	}
	input.addEventListener("input", filter);
	input.addEventListener("keydown", onKeydown);
	filter();

	return () => {
		input.removeEventListener("input", filter);
		input.removeEventListener("keydown", onKeydown);
	};
};
