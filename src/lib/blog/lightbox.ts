const MAX_SCALE = 4;
const DOUBLE_TAP_MS = 300;

const reducedMotion = () =>
	matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Article images open full screen, with pinch zoom and pan on touch screens. */
export const initLightbox = (article: HTMLElement) => {
	let overlay: HTMLElement | null = null;
	let lastFocused: HTMLElement | null = null;

	// Deferred, so the attribute changes don't push back the LCP timestamp.
	requestAnimationFrame(() => {
		for (const image of article.querySelectorAll("img")) {
			if (image.closest("a")) {
				continue;
			}
			image.setAttribute("role", "button");
			image.setAttribute("tabindex", "0");
			image.setAttribute("aria-haspopup", "dialog");
			image.setAttribute(
				"aria-label",
				image.alt ? `Zoom image: ${image.alt}` : "Zoom image",
			);
		}
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			close();
		} else if (e.key === "Tab") {
			trapFocus(e);
		}
	};

	const trapFocus = (e: KeyboardEvent) => {
		const focusables = overlay?.querySelectorAll<HTMLElement>(
			'a[href], button, [tabindex]:not([tabindex="-1"])',
		);
		const first = focusables?.[0];
		const last = focusables?.[focusables.length - 1];
		if (!first || !last) {
			return;
		}
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	const close = () => {
		if (!overlay) {
			return;
		}
		const el = overlay;
		overlay = null;
		document.removeEventListener("keydown", onKeyDown);
		document.body.style.overflow = "";
		lastFocused?.focus();
		lastFocused = null;

		if (reducedMotion()) {
			el.remove();
			return;
		}
		const remove = () => el.remove();
		el.addEventListener("transitionend", remove, { once: true });
		// In case transitionend never fires.
		setTimeout(remove, 250);
		el.classList.remove("open");
	};

	const open = (src: string, alt: string, trigger: HTMLElement) => {
		if (overlay) {
			return;
		}
		lastFocused = trigger;

		const el = document.createElement("div");
		el.className = "lightbox";
		el.setAttribute("role", "dialog");
		el.setAttribute("aria-modal", "true");
		el.setAttribute(
			"aria-label",
			alt ? `Image preview: ${alt}` : "Image preview",
		);

		const closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "lightbox-close";
		closeButton.setAttribute("aria-label", "Close image preview");
		closeButton.textContent = "✕";
		closeButton.addEventListener("click", close);

		const image = document.createElement("img");
		image.src = src;
		image.alt = "";

		el.append(closeButton, image);
		addTouchZoom(el, image);
		el.addEventListener("click", (e) => {
			if (e.target === el && !image.style.transform) {
				close();
			}
		});

		overlay = el;
		document.body.append(el);
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKeyDown);
		requestAnimationFrame(() => el.classList.add("open"));
		closeButton.focus();
	};

	const imageFrom = (e: Event) => {
		const image = e.target instanceof Element ? e.target.closest("img") : null;
		return image && article.contains(image) && !image.closest("a")
			? image
			: null;
	};

	article.addEventListener("click", (e) => {
		const image = imageFrom(e);
		if (image) {
			e.preventDefault();
			open(image.currentSrc || image.src, image.alt, image);
		}
	});

	article.addEventListener("keydown", (e) => {
		const image = imageFrom(e);
		if (image && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			open(image.currentSrc || image.src, image.alt, image);
		}
	});

	return close;
};

const addTouchZoom = (overlay: HTMLElement, image: HTMLImageElement) => {
	let scale = 1;
	let x = 0;
	let y = 0;
	let pinchStart = 0;
	let scaleStart = 1;
	let pan = { x: 0, y: 0, fromX: 0, fromY: 0 };
	let lastTap = 0;

	const apply = () => {
		image.style.transform =
			scale > 1 ? `scale(${scale}) translate(${x}px, ${y}px)` : "";
	};

	const reset = () => {
		scale = 1;
		x = 0;
		y = 0;
		apply();
	};

	const startPan = (touch: Touch) => {
		pan = { x, y, fromX: touch.clientX, fromY: touch.clientY };
	};

	overlay.addEventListener(
		"touchstart",
		(e) => {
			const [a, b] = e.touches;
			if (a && b) {
				pinchStart = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
				scaleStart = scale;
			} else if (a) {
				const now = Date.now();
				if (now - lastTap < DOUBLE_TAP_MS) {
					e.preventDefault();
					if (scale > 1) {
						reset();
					} else {
						scale = 2;
						apply();
					}
					lastTap = 0;
				} else {
					lastTap = now;
				}
				startPan(a);
			}
		},
		{ passive: false },
	);

	overlay.addEventListener(
		"touchmove",
		(e) => {
			const [a, b] = e.touches;
			e.preventDefault();
			if (a && b) {
				const distance = Math.hypot(
					b.clientX - a.clientX,
					b.clientY - a.clientY,
				);
				scale = Math.min(
					MAX_SCALE,
					Math.max(1, scaleStart * (distance / pinchStart)),
				);
				apply();
			} else if (a && scale > 1) {
				const maxX = Math.max(
					0,
					(image.clientWidth - overlay.clientWidth / scale) / 2,
				);
				const maxY = Math.max(
					0,
					(image.clientHeight - overlay.clientHeight / scale) / 2,
				);
				x = Math.min(
					maxX,
					Math.max(-maxX, pan.x + (a.clientX - pan.fromX) / scale),
				);
				y = Math.min(
					maxY,
					Math.max(-maxY, pan.y + (a.clientY - pan.fromY) / scale),
				);
				apply();
			}
		},
		{ passive: false },
	);

	const settle = (e: TouchEvent) => {
		if (e.touches.length === 0 && scale <= 1.05) {
			reset();
		}
	};
	overlay.addEventListener("touchend", settle);
	overlay.addEventListener("touchcancel", settle);
};
