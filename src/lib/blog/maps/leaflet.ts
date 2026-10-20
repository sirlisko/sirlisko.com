import type { Map as LeafletMap } from "leaflet";
import leafletCss from "../../../styles/blog/leaflet.css?url";

// Astro hoists CSS from a dynamic import onto every page as a render-blocking
// link, so the styles are linked here, only once a map needs them.
function loadCss() {
	return new Promise((resolve, reject) => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = leafletCss;
		link.onload = resolve;
		link.onerror = reject;
		document.head.append(link);
	});
}

// Code-split, so pages without a map never download Leaflet
export async function loadLeaflet() {
	const [L, { gameboyTileLayer, gameboyToggle }] = await Promise.all([
		import("leaflet"),
		import("leaflet-gameboy"),
		loadCss(),
	]);

	return {
		L,
		createMap(el: HTMLElement): LeafletMap {
			// Wheel zoom only once the map has focus, so scrolling past it scrolls the page
			const map = L.map(el, { scrollWheelZoom: false });
			map.on("focus", () => map.scrollWheelZoom.enable());
			map.on("blur", () => map.scrollWheelZoom.disable());

			const theme = matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
			const tiles = gameboyTileLayer(
				"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
				{
					attribution:
						'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					maxZoom: 18,
					theme,
				},
			).addTo(map);
			gameboyToggle({ layer: tiles }).addTo(map);
			return map;
		},
	};
}

export type Leaflet = Awaited<ReturnType<typeof loadLeaflet>>;

// Leaves the map's loading label in place but says the map isn't coming
export function markFailed(els: HTMLElement[]) {
	for (const el of els) {
		el.dataset.mapState = "failed";
	}
}

// A map on a fractional pixel (under a title whose line height ends in .5,
// say) rasterises its tiles with a seam between rows, so nudge each map onto
// the device pixel grid.
export function snapMapsToPixelGrid() {
	const ratio = window.devicePixelRatio;
	const offset = (v: number) => (Math.round(v * ratio) - v * ratio) / ratio;
	document.querySelectorAll<HTMLElement>(".leaflet-container").forEach((el) => {
		el.style.translate = "";
		const { left, top } = el.getBoundingClientRect();
		el.style.translate = `${offset(left + scrollX)}px ${offset(top + scrollY)}px`;
	});
}
