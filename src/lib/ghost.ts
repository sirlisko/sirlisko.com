import { debounce } from "./debounce";
import { KONAMI_EVENT } from "./konami";
import { prefersReducedMotion } from "./motion";

const GHOST_WIDTH = 64;
const MOVE_DEBOUNCE = 100;
const START_POSITION = { x: -100, y: -100 };

interface GhostElements {
	ghost: HTMLElement;
	hearts: HTMLElement[];
	gameOver: HTMLElement;
}

const query = (root: ParentNode): GhostElements | null => {
	const ghost = root.querySelector<HTMLElement>("[data-ghost-sprite]");
	const gameOver = root.querySelector<HTMLElement>("[data-ghost-gameover]");
	const hearts = [...root.querySelectorAll<HTMLElement>("[data-ghost-heart]")];
	return ghost && gameOver && hearts.length > 0
		? { ghost, hearts, gameOver }
		: null;
};

export const initGhost = (root: ParentNode = document) => {
	const els = query(root);
	if (!els) {
		return () => {};
	}
	const { ghost, hearts, gameOver } = els;

	let life = hearts.length;
	const place = ({ x, y }: { x: number; y: number }) => {
		ghost.style.left = `${x - GHOST_WIDTH}px`;
		ghost.style.top = `${y - GHOST_WIDTH}px`;
		ghost.classList.toggle(
			"flipped",
			x < ghost.getBoundingClientRect().left + GHOST_WIDTH,
		);
	};
	place(START_POSITION);

	const loseLife = () => {
		if (life === 0) {
			return;
		}
		life -= 1;
		hearts[life]?.toggleAttribute("hidden", true);
		if (life === 0) {
			gameOver.toggleAttribute("hidden", false);
		}
	};
	ghost.addEventListener("mouseover", loseLife);

	const revive = () => {
		life = hearts.length;
		for (const heart of hearts) {
			heart.toggleAttribute("hidden", false);
		}
		gameOver.toggleAttribute("hidden", true);
	};
	document.addEventListener(KONAMI_EVENT, revive);

	const detach = () => {
		ghost.removeEventListener("mouseover", loseLife);
		document.removeEventListener(KONAMI_EVENT, revive);
	};

	// `ontouchstart` is null on touch devices, so only `in` detects it.
	if ("ontouchstart" in window || prefersReducedMotion()) {
		return detach;
	}

	const onMouseMove = debounce(
		(e: MouseEvent) => place({ x: e.clientX, y: e.clientY }),
		MOVE_DEBOUNCE,
	);
	document.addEventListener("mousemove", onMouseMove);

	return () => {
		onMouseMove.cancel();
		document.removeEventListener("mousemove", onMouseMove);
		detach();
	};
};
