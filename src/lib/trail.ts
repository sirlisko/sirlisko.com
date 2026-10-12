const SPEED = 180;
const PAUSE = 600;

/** Pac-Man clears the row of dots on a click; the board blinks, then the dots come back. */
export const initTrail = (root: ParentNode = document) => {
	const trail = root.querySelector<HTMLElement>("[data-trail]");
	const pacman = trail?.querySelector<HTMLElement>("[data-trail-pacman]");
	const power = trail?.querySelector<HTMLElement>("[data-trail-power]");
	if (!trail || !pacman || !power) {
		return () => {};
	}

	let timer: ReturnType<typeof setTimeout> | undefined;

	const onEat = () => {
		if (trail.dataset.state) {
			return;
		}
		const travel = trail.clientWidth - pacman.offsetWidth;
		trail.style.setProperty("--travel", `${travel}px`);
		trail.style.setProperty("--duration", `${travel / SPEED}s`);
		trail.dataset.state = "eating";
		window.umami?.track("pacman");
	};

	// Only the trail's own transition marks the end of the run.
	const onCleared = (event: Event) => {
		if (event.target !== trail) {
			return;
		}
		trail.dataset.state = "cleared";
		timer = setTimeout(() => {
			trail.dataset.state = "respawn";
		}, PAUSE);
	};

	const onRespawned = () => {
		delete trail.dataset.state;
	};

	pacman.addEventListener("click", onEat);
	trail.addEventListener("transitionend", onCleared);
	power.addEventListener("animationend", onRespawned);

	return () => {
		clearTimeout(timer);
		pacman.removeEventListener("click", onEat);
		trail.removeEventListener("transitionend", onCleared);
		power.removeEventListener("animationend", onRespawned);
	};
};
