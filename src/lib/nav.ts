const MOBILE_QUERY = "(max-width: 650px)";

export const initNav = (root: ParentNode = document) => {
	const hamburger = root.querySelector<HTMLElement>("#hamburger");
	const navLinks = root.querySelector<HTMLElement>("#nav-links");
	if (!hamburger || !navLinks) {
		return () => {};
	}

	const mobileQuery = window.matchMedia(MOBILE_QUERY);
	const isOpen = () => navLinks.classList.contains("active");

	// The open menu is a full-screen overlay, so everything it does not own has to
	// leave the tab order or focus walks behind it. The nav is not always a direct
	// child of body, so this collects the siblings of every ancestor up to it.
	const behindTheMenu: Element[] = [];
	for (
		let node: Element | null = navLinks;
		node && node !== document.body;
		node = node.parentElement
	) {
		for (const sibling of node.parentElement?.children ?? []) {
			if (!sibling.contains(navLinks) && !sibling.contains(hamburger)) {
				behindTheMenu.push(sibling);
			}
		}
	}

	const syncInert = () => {
		const open = isOpen();
		navLinks.toggleAttribute("inert", mobileQuery.matches && !open);
		for (const el of behindTheMenu) {
			el.toggleAttribute("inert", mobileQuery.matches && open);
		}
	};
	const setOpen = (open: boolean) => {
		navLinks.classList.toggle("active", open);
		hamburger.classList.toggle("active", open);
		hamburger.setAttribute("aria-expanded", open.toString());
		document.body.classList.toggle("no-scroll", open);
		syncInert();
		if (open) {
			navLinks.querySelector("a")?.focus();
		}
	};
	const close = () => {
		setOpen(false);
		hamburger.focus();
	};

	const onToggle = () => setOpen(!isOpen());
	const onLinkClick = () => setOpen(false);
	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && isOpen()) {
			close();
		}
	};

	syncInert();
	mobileQuery.addEventListener("change", syncInert);
	hamburger.addEventListener("click", onToggle);
	document.addEventListener("keydown", onKeydown);
	const links = [...navLinks.querySelectorAll("a")];
	for (const link of links) {
		link.addEventListener("click", onLinkClick);
	}

	return () => {
		mobileQuery.removeEventListener("change", syncInert);
		hamburger.removeEventListener("click", onToggle);
		document.removeEventListener("keydown", onKeydown);
		for (const link of links) {
			link.removeEventListener("click", onLinkClick);
		}
	};
};
