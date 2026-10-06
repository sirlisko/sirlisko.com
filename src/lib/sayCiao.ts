const TOUCH_QUERY = "(hover: none)";

/** Touch screens can't hover, so the first tap shows the balloon and the second sends. */
export const initSayCiao = (root: ParentNode = document) => {
	const link = root.querySelector<HTMLAnchorElement>("[data-say-ciao]");
	if (!link) {
		return () => {};
	}

	const touchQuery = window.matchMedia(TOUCH_QUERY);

	const onClick = (e: MouseEvent) => {
		if (touchQuery.matches && !link.hasAttribute("data-open")) {
			e.preventDefault();
			link.toggleAttribute("data-open", true);
		}
	};
	const onOutside = (e: Event) => {
		if (!link.contains(e.target as Node)) {
			link.removeAttribute("data-open");
		}
	};

	link.addEventListener("click", onClick);
	document.addEventListener("click", onOutside);

	return () => {
		link.removeEventListener("click", onClick);
		document.removeEventListener("click", onOutside);
	};
};
