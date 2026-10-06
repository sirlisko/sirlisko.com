import { prefersReducedMotion } from "./motion";

const TYPING_SPEED = 120;
const DELETING_SPEED = 10;
const PAUSE = 2000;

interface GreetingOptions {
	random?: () => number;
}

export const initGreeting = (
	el: HTMLElement,
	descriptions: string[],
	{ random = Math.random }: GreetingOptions = {},
) => {
	if (descriptions.length === 0 || prefersReducedMotion()) {
		return () => {};
	}

	let timer: ReturnType<typeof setTimeout> | undefined;
	let word = el.textContent ?? "";
	let typed = word.length;

	const schedule = (fn: () => void, delay: number) => {
		timer = setTimeout(fn, delay);
	};

	const render = () => {
		el.textContent = word.slice(0, typed);
	};

	const type = () => {
		if (typed < word.length) {
			typed += 1;
			render();
			schedule(type, TYPING_SPEED);
			return;
		}
		schedule(remove, PAUSE);
	};

	const remove = () => {
		if (typed > 0) {
			typed -= 1;
			render();
			schedule(remove, DELETING_SPEED);
			return;
		}
		const others = descriptions.filter((d) => d !== word);
		const pool = others.length > 0 ? others : descriptions;
		word = pool[Math.floor(random() * pool.length)] ?? "";
		schedule(type, TYPING_SPEED);
	};

	schedule(remove, PAUSE);

	return () => clearTimeout(timer);
};
