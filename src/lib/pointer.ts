/** A mouse or trackpad. It asks about the primary pointer, so a touchscreen laptop still counts. */
export const finePointer = () =>
	window.matchMedia("(hover: hover) and (pointer: fine)");
