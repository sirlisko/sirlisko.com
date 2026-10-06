export const initLamp = (root: ParentNode = document) => {
	const lamp = root.querySelector<HTMLButtonElement>("[data-lamp]");
	if (!lamp) {
		return () => {};
	}

	const onClick = () => {
		const on = lamp.getAttribute("aria-pressed") === "true";
		lamp.setAttribute("aria-pressed", String(!on));
	};

	lamp.addEventListener("click", onClick);
	return () => lamp.removeEventListener("click", onClick);
};
