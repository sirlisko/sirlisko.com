import { prefersReducedMotion } from "./motion";

const DELAY = 1500;
const SPEED = 40;
const HANDS_ON = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

/** Rolls the page like end credits until the reader takes over. */
export const initStaffRoll = (root: Document = document) => {
	if (!root.querySelector("[data-staff-roll]") || prefersReducedMotion()) {
		return () => {};
	}

	const win = root.defaultView ?? window;
	const page = root.scrollingElement ?? root.documentElement;
	let y = page.scrollTop;
	let last: number | undefined;
	let frame = 0;

	const stop = () => {
		clearTimeout(timer);
		win.cancelAnimationFrame(frame);
		for (const type of HANDS_ON) {
			win.removeEventListener(type, stop);
		}
	};

	const step = (now: number) => {
		// Any scroll we didn't make (scrollbar, Tab to a link, find in page) is the reader's.
		if (Math.abs(page.scrollTop - Math.round(y)) > 2) {
			stop();
			return;
		}
		y += last === undefined ? 0 : (SPEED * (now - last)) / 1000;
		last = now;
		page.scrollTop = y;
		if (y >= page.scrollHeight - page.clientHeight) {
			stop();
			return;
		}
		frame = win.requestAnimationFrame(step);
	};

	for (const type of HANDS_ON) {
		win.addEventListener(type, stop, { passive: true });
	}
	const timer = setTimeout(() => {
		y = page.scrollTop;
		frame = win.requestAnimationFrame(step);
	}, DELAY);

	return stop;
};
