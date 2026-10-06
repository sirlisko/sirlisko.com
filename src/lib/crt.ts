const KEY = "crt";

// Storage can throw in private windows or with site data blocked; the effect is optional.
const read = () => {
	try {
		return sessionStorage.getItem(KEY) === "on";
	} catch {
		return false;
	}
};

const write = (on: boolean) => {
	try {
		if (on) {
			sessionStorage.setItem(KEY, "on");
		} else {
			sessionStorage.removeItem(KEY);
		}
	} catch {}
};

export const applyCrt = (root: HTMLElement = document.documentElement) => {
	root.toggleAttribute("data-crt", read());
};

export const toggleCrt = (root: HTMLElement = document.documentElement) => {
	const on = !root.hasAttribute("data-crt");
	write(on);
	root.toggleAttribute("data-crt", on);
	return on;
};
