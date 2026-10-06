const MOBILE_QUERY = "(max-width: 760px)";

/** The dialog owns focus, Escape and inertness; this only opens and closes it. */
export const initNav = (root: ParentNode = document) => {
	const start = root.querySelector<HTMLButtonElement>("#nav-start");
	const pause = root.querySelector<HTMLDialogElement>("#nav-pause");
	if (!start || !pause) {
		return () => {};
	}

	const mobileQuery = window.matchMedia(MOBILE_QUERY);

	const onStart = () => pause.showModal();
	// Clicks on the dialog itself, not its contents, land on the backdrop.
	const onPauseClick = (e: MouseEvent) => {
		if (e.target === pause || (e.target as Element).closest("a")) {
			pause.close();
		}
	};
	// The desktop menu takes over above the breakpoint, so a stale modal must go.
	const onBreakpoint = () => {
		if (!mobileQuery.matches && pause.open) {
			pause.close();
		}
	};

	start.addEventListener("click", onStart);
	pause.addEventListener("click", onPauseClick);
	mobileQuery.addEventListener("change", onBreakpoint);

	return () => {
		start.removeEventListener("click", onStart);
		pause.removeEventListener("click", onPauseClick);
		mobileQuery.removeEventListener("change", onBreakpoint);
	};
};
